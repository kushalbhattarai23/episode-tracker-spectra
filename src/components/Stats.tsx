import { FileText, Eye, BarChart } from "lucide-react";
import StatsCard from "./StatsCard";

interface StatsProps {
  totalEpisodes: number;
  watchedEpisodes: number;
  totalShows: number;
}

const Stats = ({ totalEpisodes, watchedEpisodes, totalShows }: StatsProps) => {
  const watchedPercentage = totalEpisodes > 0 
    ? Math.round((watchedEpisodes / totalEpisodes) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon={FileText}
        title="Total Episodes"
        value={totalEpisodes}
        bgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatsCard
        icon={Eye}
        title="Watched"
        value={`${watchedEpisodes} (${watchedPercentage}%)`}
        bgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatsCard
        icon={BarChart}
        title="Shows"
        value={totalShows}
        bgColor="bg-purple-50 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
};

export default Stats;