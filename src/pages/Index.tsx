import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        if (headers.join(',') !== 'SHOW,Episode,Title,Original air date,Watched') {
          console.error('Invalid CSV format');
          return;
        }

        const parsedEpisodes = lines.slice(1).filter(line => line.trim()).map(line => {
          const [show, episode, title, originalAirDate, watched] = line.split(',');
          return { show, episode, title, originalAirDate, watched };
        });

        // Calculate statistics for each show
        const stats: { [key: string]: { total: number; watched: number } } = {};
        parsedEpisodes.forEach(ep => {
          if (!stats[ep.show]) {
            stats[ep.show] = { total: 0, watched: 0 };
          }
          stats[ep.show].total += 1;
          if (ep.watched.toLowerCase() === 'true') {
            stats[ep.show].watched += 1;
          }
        });

        setShowStats(stats);
        setEpisodes(parsedEpisodes);
      };
      reader.readAsText(file);
    }
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
                    {episode.watched.toLowerCase() === 'true' ? '✅' : '❌'}
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