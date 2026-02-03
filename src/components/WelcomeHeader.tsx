import { Heart } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
}

const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
  return (
    <header className="text-center py-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Welcome, {name}
      </h1>
      <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
        Be Naughty <Heart className="w-4 h-4 text-primary fill-primary animate-heartbeat" /> 
        Be Loyal <Heart className="w-4 h-4 text-secondary fill-secondary animate-heartbeat" style={{ animationDelay: '0.2s' }} /> 
        Stay Together
      </p>
    </header>
  );
};

export default WelcomeHeader;
