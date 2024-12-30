import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";
import Stats from "@/components/Stats";
import { exportToCSV } from "@/utils/csvUtils";
import { ShowProgress } from "@/components/ShowProgress";
import { ShowDetails } from "@/components/ShowDetails";
import { parseCSV } from "@/utils/csvParser";

interface Episode {
  show: string;
  episode: string;
  title: string;
  originalAirDate: string;
  watched: string;
}

const Index = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showStats, setShowStats] = useState<{ [key: string]: { total: number; watched: number } }>({});
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedEpisodes = localStorage.getItem('episodes');
    if (savedEpisodes) {
      const parsedEpisodes = JSON.parse(savedEpisodes);
      setEpisodes(parsedEpisodes);
      updateShowStats(parsedEpisodes);
    }
  }, []);

  useEffect(() => {
    if (episodes.length > 0) {
      localStorage.setItem('episodes', JSON.stringify(episodes));
    }
  }, [episodes]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsedEpisodes = parseCSV(text);
          
          if (parsedEpisodes.length === 0) {
            toast({
              title: "Error",
              description: "No episodes found in the file",
              variant: "destructive",
            });
            return;
          }

          const sortedEpisodes = sortEpisodes(parsedEpisodes);
          updateShowStats(sortedEpisodes);
          setEpisodes(sortedEpisodes);
          toast({
            title: "Success",
            description: `Imported ${sortedEpisodes.length} episodes`,
          });
        } catch (error) {
          console.error('CSV parsing error:', error);
          toast({
            title: "Error",
            description: "Failed to read the file content",
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive",
        });
      };

      reader.readAsText(file);
    }
  };

  const sortEpisodes = (eps: Episode[]) => {
    return [...eps].sort((a, b) => {
      if (a.watched.toLowerCase() === 'yes' && b.watched.toLowerCase() !== 'yes') return 1;
      if (a.watched.toLowerCase() !== 'yes' && b.watched.toLowerCase() === 'yes') return -1;
      
      const dateA = new Date(a.originalAirDate);
      const dateB = new Date(b.originalAirDate);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const updateShowStats = (eps: Episode[]) => {
    const stats: { [key: string]: { total: number; watched: number } } = {};
    eps.forEach(ep => {
      if (!stats[ep.show]) {
        stats[ep.show] = { total: 0, watched: 0 };
      }
      stats[ep.show].total += 1;
      if (ep.watched.toLowerCase() === 'yes') {
        stats[ep.show].watched += 1;
      }
    });
    setShowStats(stats);
  };

  const toggleWatchedStatus = (index: number) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = {
      ...updatedEpisodes[index],
      watched: updatedEpisodes[index].watched.toLowerCase() === 'yes' ? 'no' : 'yes'
    };
    
    const sortedEpisodes = sortEpisodes(updatedEpisodes);
    setEpisodes(sortedEpisodes);
    updateShowStats(sortedEpisodes);
    
    toast({
      title: "Status Updated",
      description: `Episode marked as ${updatedEpisodes[index].watched}`,
    });
  };

  const clearData = () => {
    setEpisodes([]);
    setShowStats({});
    setSelectedShow(null);
    localStorage.removeItem('episodes');
    toast({
      title: "Data Cleared",
      description: "All episode data has been cleared",
    });
  };

  const calculateStats = (eps: Episode[]) => {
    const totalEpisodes = eps.length;
    const watchedEpisodes = eps.filter(ep => ep.watched.toLowerCase() === 'yes').length;
    const uniqueShows = new Set(eps.map(ep => ep.show)).size;
    return { totalEpisodes, watchedEpisodes, totalShows: uniqueShows };
  };

  const handleSaveCSV = () => {
    exportToCSV(episodes);
    toast({
      title: "Success",
      description: "Episodes exported to CSV",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Episode Tracker
          </h1>
          <div className="flex gap-2">
            {episodes.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleSaveCSV}
                  className="flex items-center gap-2 border-purple-200 hover:border-purple-300 text-purple-600"
                >
                  <Save className="h-4 w-4" />
                  Save CSV
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearData}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Data
                </Button>
              </>
            )}
          </div>
        </div>

        {episodes.length > 0 && (
          <Stats {...calculateStats(episodes)} />
        )}
        
        <div className="mb-6">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="max-w-md border-2 border-purple-200 focus:border-purple-400 rounded-lg"
          />
        </div>

        {Object.entries(showStats).length > 0 && !selectedShow && (
          <ShowProgress 
            showStats={showStats} 
            onShowSelect={setSelectedShow}
          />
        )}

        {selectedShow ? (
          <ShowDetails 
            selectedShow={selectedShow}
            episodes={episodes}
            showStats={showStats}
            toggleWatchedStatus={toggleWatchedStatus}
            onBack={() => setSelectedShow(null)}
          />
        ) : (
          episodes.length > 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Click on a show above to view its episodes
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Index;