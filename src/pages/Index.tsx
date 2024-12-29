import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import Stats from "@/components/Stats";

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
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEpisodes = localStorage.getItem('episodes');
    if (savedEpisodes) {
      const parsedEpisodes = JSON.parse(savedEpisodes);
      setEpisodes(parsedEpisodes);
      updateShowStats(parsedEpisodes);
    }
  }, []);

  // Save data to localStorage whenever episodes change
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
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        if (lines.length === 0) {
          toast({
            title: "Error",
            description: "The CSV file is empty",
            variant: "destructive",
          });
          return;
        }

        try {
          const parsedEpisodes = lines.slice(1).map(line => {
            const [show, episode, title, originalAirDate, watched] = line.split(',').map(value => value.trim());
            return { show, episode, title, originalAirDate, watched };
          });

          // Sort episodes by watched status and air date
          const sortedEpisodes = sortEpisodes(parsedEpisodes);

          updateShowStats(sortedEpisodes);
          setEpisodes(sortedEpisodes);
          toast({
            title: "Success",
            description: `Imported ${sortedEpisodes.length} episodes`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse CSV data. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const sortEpisodes = (eps: Episode[]) => {
    return [...eps].sort((a, b) => {
      // First sort by watched status (unwatched first)
      if (a.watched.toLowerCase() === 'yes' && b.watched.toLowerCase() !== 'yes') return 1;
      if (a.watched.toLowerCase() !== 'yes' && b.watched.toLowerCase() === 'yes') return -1;
      
      // Then sort by original air date
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
    
    // Sort episodes after updating watched status
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Episode Tracker
          </h1>
          {episodes.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={clearData}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          )}
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

        {Object.entries(showStats).length > 0 && (
          <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">Show Progress</h2>
            {Object.entries(showStats).map(([show, stats]) => (
              <div key={show} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{show}</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400">
                    {stats.watched} / {stats.total} episodes
                  </span>
                </div>
                <Progress 
                  value={(stats.watched / stats.total) * 100} 
                  className="h-2 bg-purple-100"
                />
              </div>
            ))}
          </div>
        )}

        {episodes.length > 0 && (
          <ScrollArea className="h-[600px] rounded-xl border border-purple-200 bg-white dark:bg-gray-800 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50 dark:bg-gray-700">
                  <TableHead className="text-purple-700 dark:text-purple-400">Show</TableHead>
                  <TableHead className="text-purple-700 dark:text-purple-400">Episode</TableHead>
                  <TableHead className="text-purple-700 dark:text-purple-400">Title</TableHead>
                  <TableHead className="text-purple-700 dark:text-purple-400">Original Air Date</TableHead>
                  <TableHead className="text-purple-700 dark:text-purple-400">Watched</TableHead>
                  <TableHead className="text-purple-700 dark:text-purple-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episodes.map((episode, index) => (
                  <TableRow key={index} className="hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell className="font-medium">{episode.show}</TableCell>
                    <TableCell>{episode.episode}</TableCell>
                    <TableCell>{episode.title}</TableCell>
                    <TableCell>{episode.originalAirDate}</TableCell>
                    <TableCell>
                      {episode.watched.toLowerCase() === 'yes' ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWatchedStatus(index)}
                        className={`border-2 ${
                          episode.watched.toLowerCase() === 'yes'
                            ? 'border-purple-300 hover:border-purple-400 text-purple-600'
                            : 'border-pink-300 hover:border-pink-400 text-pink-600'
                        }`}
                      >
                        Mark as {episode.watched.toLowerCase() === 'yes' ? 'Unwatched' : 'Watched'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Index;
