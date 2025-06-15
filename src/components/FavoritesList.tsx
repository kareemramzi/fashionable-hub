import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TopNavBar from "./navigation/TopNavBar";

interface FavoriteItem {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  image_url: string;
  color: string;
  created_at: string;
}

interface FavoritesListProps {
  onBack: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const FavoritesList = ({ onBack, onCart, onProfile }: FavoritesListProps) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use 'any' temporarily to avoid TypeScript errors while types are updating
      const { data, error } = await (supabase as any)
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading favorites",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('favorites')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setFavorites(favorites.filter(item => item.id !== itemId));
      
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error removing favorite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addToCart = async (item: FavoriteItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_name: item.product_name,
          brand: item.brand,
          price: item.price,
          size: 'M', // Default size
          color: item.color,
          image_url: item.image_url,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: `${item.product_name} has been added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <TopNavBar 
        onBack={onBack}
        onFavorites={() => {}} // Already on favorites page
        onCart={onCart}
        onProfile={onProfile}
        showBackButton={true}
        title="My Favorites"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {favorites.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Start adding items to your favorites</p>
              <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((item) => (
              <Card key={item.id} className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="text-sm text-gray-600">{item.color}</p>
                      <p className="font-bold text-purple-600">${item.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFavorite(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToCart(item)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
