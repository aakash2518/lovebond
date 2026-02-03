interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatsCard = ({ title, value, subtitle }: StatsCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-4 text-center gradient-border hover:scale-105 transition-transform duration-300">
      <p className="text-primary text-xs font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground glow-text">{value}</p>
      {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
