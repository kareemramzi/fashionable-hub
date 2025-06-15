
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, User, ArrowLeft } from "lucide-react";

interface TopNavBarProps {
  onBack?: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
  showBackButton?: boolean;
  title?: string;
}

const TopNavBar = ({ 
  onBack, 
  onFavorites, 
  onCart, 
  onProfile, 
  showBackButton = false,
  title 
}: TopNavBarProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        {title && (
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onFavorites}
          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <Heart className="w-5 h-5 text-pink-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCart}
          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ShoppingCart className="w-5 h-5 text-purple-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onProfile}
          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <User className="w-5 h-5 text-purple-600" />
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;
