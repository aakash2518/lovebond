import { Home, MessageCircle, Heart, User } from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? "bg-primary/20 text-primary glow-pink" 
          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
      }`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const navItems = [
    { id: "home", icon: Home },
    { id: "chat", icon: MessageCircle },
    { id: "love", icon: Heart },
    { id: "profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-nav/95 backdrop-blur-xl border-t border-border/30 px-6 py-3 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
