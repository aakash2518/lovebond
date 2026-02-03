import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
}

const ActionCard = ({ title, subtitle, icon: Icon, onClick, disabled = false }: ActionCardProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`glass-card rounded-2xl p-4 w-full text-left flex items-center justify-between transition-all duration-300 group ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02]'
      }`}
    >
      <div>
        <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center transition-colors duration-300 ${
        disabled ? '' : 'group-hover:bg-primary/30'
      }`}>
        <Icon className={`w-6 h-6 text-primary transition-transform duration-300 ${
          disabled ? '' : 'group-hover:scale-110'
        }`} />
      </div>
    </button>
  );
};

export default ActionCard;
