import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Episode {
  show: string;
  episode: string;
  title: string;
  originalAirDate: string;
  watched: string;
}

interface ShowDetailsProps {
  selectedShow: string | null;
  episodes: Episode[];
  showStats: { [key: string]: { total: number; watched: number } };
  toggleWatchedStatus: (index: number) => void;
  onBack: () => void;
}

export const ShowDetails = ({ 
  selectedShow, 
  episodes, 
  showStats, 
  toggleWatchedStatus,
  onBack 
}: ShowDetailsProps) => {
  if (!selectedShow) return null;

  const filteredEpisodes = episodes.filter(ep => ep.show === selectedShow);
  const stats = showStats[selectedShow];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
          {selectedShow}
        </h2>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-purple-200 hover:border-purple-300 text-purple-600"
        >
          Back to All Shows
        </Button>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Total Progress</span>
            <span className="text-sm text-purple-600 dark:text-purple-400">
              {stats.watched} / {stats.total} episodes
            </span>
          </div>
          <Progress 
            value={(stats.watched / stats.total) * 100} 
            className="h-2 bg-purple-100"
          />
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-xl border border-purple-200 bg-white dark:bg-gray-800 shadow-lg">
        <div className="space-y-4 p-4">
          {filteredEpisodes.map((episode, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 p-4 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Episode</span>
                  <span>{episode.episode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Title</span>
                  <span>{episode.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Air Date</span>
                  <span>{episode.originalAirDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Watched</span>
                  <span>
                    {episode.watched.toLowerCase() === 'yes' ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWatchedStatus(episodes.indexOf(episode))}
                    className={`border-2 ${
                      episode.watched.toLowerCase() === 'yes'
                        ? 'border-purple-300 hover:border-purple-400 text-purple-600'
                        : 'border-pink-300 hover:border-pink-400 text-pink-600'
                    }`}
                  >
                    Mark as {episode.watched.toLowerCase() === 'yes' ? 'Unwatched' : 'Watched'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};