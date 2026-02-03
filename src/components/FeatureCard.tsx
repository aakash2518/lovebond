import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const FeatureCard = ({ title, icon: Icon, onClick }: FeatureCardProps) => {
  return (
    <button
      onClick={onClick}
      className="glass-card rounded-2xl p-4 text-center gradient-border hover:scale-105 transition-all duration-300 w-full group"
    >
      <p className="text-primary text-xs font-medium mb-3">{title}</p>
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary animate-float" />
        </div>
      </div>
    </button>
  );
};

export default FeatureCard;
