import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ShowProgressProps {
  showStats: { [key: string]: { total: number; watched: number } };
  onShowSelect: (show: string) => void;
}

export const ShowProgress = ({ showStats, onShowSelect }: ShowProgressProps) => {
  return (
    <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">Show Progress</h2>
      {Object.entries(showStats).map(([show, stats]) => (
        <div 
          key={show} 
          className="space-y-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
          onClick={() => onShowSelect(show)}
        >
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
  );
};