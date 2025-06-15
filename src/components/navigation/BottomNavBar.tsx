
import { Button } from "@/components/ui/button";
import { Home, Heart, ShoppingCart, User, ShoppingBag } from "lucide-react";

interface BottomNavBarProps {
  currentPage: string;
  onHome: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
  onShopping: () => void;
}

const BottomNavBar = ({ 
  currentPage, 
  onHome, 
  onFavorites, 
  onCart, 
  onProfile, 
  onShopping 
}: BottomNavBarProps) => {
  const navItems = [
    { key: 'home', label: 'Home', icon: Home, onClick: onHome },
    { key: 'favorites', label: 'Favorites', icon: Heart, onClick: onFavorites },
    { key: 'cart', label: 'Cart', icon: ShoppingCart, onClick: onCart },
    { key: 'shopping', label: 'Shop', icon: ShoppingBag, onClick: onShopping },
    { key: 'profile', label: 'Profile', icon: User, onClick: onProfile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ key, label, icon: Icon, onClick }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={onClick}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                currentPage === key 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
