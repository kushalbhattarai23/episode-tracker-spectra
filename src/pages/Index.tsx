import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Episode Tracker</h1>
      
      <div className="mb-6">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="max-w-md"
        />
      </div>

      {Object.entries(showStats).length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Show Progress</h2>
          {Object.entries(showStats).map(([show, stats]) => (
            <div key={show} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{show}</span>
                <span className="text-sm text-muted-foreground">
                  {stats.watched} / {stats.total} episodes
                </span>
              </div>
              <Progress value={(stats.watched / stats.total) * 100} />
            </div>
          ))}
        </div>
      )}

      {episodes.length > 0 && (
        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Show</TableHead>
                <TableHead>Episode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Original Air Date</TableHead>
                <TableHead>Watched</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((episode, index) => (
                <TableRow key={index}>
                  <TableCell>{episode.show}</TableCell>
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
  );
};

export default Index;