import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

const StatsCard = ({ icon: Icon, title, value, bgColor, iconColor }: StatsCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center gap-4">
        <Icon className={`h-6 w-6 ${iconColor}`} />
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">{title}</h3>
      </div>
      <p className="mt-4 text-4xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;