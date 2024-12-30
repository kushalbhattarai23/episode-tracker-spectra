import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Episode {
  show: string;
  episode: string;
  title: string;
  originalAirDate: string;
  watched: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  toggleWatchedStatus: (index: number) => void;
  showTitle?: boolean;
}

export const EpisodeList = ({ episodes, toggleWatchedStatus, showTitle = true }: EpisodeListProps) => {
  return (
    <ScrollArea className="h-[600px] rounded-xl border border-purple-200 bg-white dark:bg-gray-800 shadow-lg">
      <div className="space-y-4 p-4">
        {episodes.map((episode, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 p-4 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="grid grid-cols-1 gap-2">
              {showTitle && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">Show</span>
                  <span>{episode.show}</span>
                </div>
              )}
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
                  onClick={() => toggleWatchedStatus(index)}
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
  );
};