import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Filter, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TopNavBar from "./navigation/TopNavBar";
import { fetchProducts, addProductToWardrobe, Product } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ShoppingRecommendationsProps {
  skinTone: string;
  colorPalette: string[];
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const ShoppingRecommendations = ({ skinTone, colorPalette, onBack, onFavorites, onCart, onProfile }: ShoppingRecommendationsProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', activeFilter],
    queryFn: () => fetchProducts(activeFilter),
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const calculateMatch = (product: Product): number => {
    // Simple color matching algorithm based on color similarity
    const productColor = product.color.toLowerCase();
    let match = 70; // Base match score

    // Check if product color matches any color in the palette
    for (const paletteColor of colorPalette) {
      if (productColor.includes(paletteColor.toLowerCase()) || 
          paletteColor.toLowerCase().includes(productColor)) {
        match += 25;
        break;
      }
    }

    // Add bonus for highly rated products
    if (product.rating && product.rating > 4.5) {
      match += 5;
    }

    return Math.min(match, 98); // Cap at 98%
  };

  const toggleFavorite = async (productId: string) => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites",
      });
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (favorites.includes(productId)) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_name', product.name);
        
        setFavorites(prev => prev.filter(id => id !== productId));
        toast({
          title: "Removed from favorites",
          description: product.name,
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
            product_name: product.name,
            brand: product.brand,
            price: product.price,
            color: product.color,
            image_url: product.image_url
          });
        
        setFavorites(prev => [...prev, productId]);
        toast({
          title: "Added to favorites",
          description: product.name,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Could not update favorites",
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
      });
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      await supabase
        .from('cart_items')
        .insert({
          user_id: session.user.id,
          product_name: product.name,
          brand: product.brand,
          price: product.price,
          color: product.color,
          image_url: product.image_url,
          size: 'M',
          quantity: 1
        });

      setCart(prev => [...prev, productId]);
      toast({
        title: "Added to cart",
        description: product.name,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add to cart",
      });
    }
  };

  const buyAndAddToWardrobe = async (productId: string) => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase items",
      });
      return;
    }

    try {
      const success = await addProductToWardrobe(session.user.id, productId);
      if (success) {
        const product = products.find(p => p.id === productId);
        toast({
          title: "Purchase successful! ✨",
          description: `${product?.name} has been added to your wardrobe`,
        });
      } else {
        toast({
          title: "Purchase failed",
          description: "Could not complete the purchase",
        });
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      toast({
        title: "Error",
        description: "Could not complete the purchase",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <TopNavBar 
          onBack={onBack}
          onFavorites={onFavorites}
          onCart={onCart}
          onProfile={onProfile}
          showBackButton={true}
          title="Recommendations"
        />
        <div className="max-w-md mx-auto p-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <TopNavBar 
        onBack={onBack}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        showBackButton={true}
        title="Recommendations"
      />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Your Perfect Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Skin Tone: <span className="font-semibold">{skinTone}</span></p>
              <div className="flex gap-2">
                {colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-600" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["all", "tops", "bottoms", "dresses", "outerwear"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Perfect Matches for You</h2>
          <div className="grid gap-4">
            {products.map((product) => {
              const match = calculateMatch(product);
              return (
                <Card key={product.id} className="shadow-lg overflow-hidden">
                  <div className="relative bg-gray-50">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {match}% match
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`rounded-full ${favorites.includes(product.id) ? 'text-red-500' : 'text-gray-500'} bg-white/80 hover:bg-white`}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    {product.original_price && product.original_price > product.price && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive">
                          Sale
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">${product.price}</p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-gray-500 line-through">${product.original_price}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating || 4.0}</span>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: product.color }}
                        title="Recommended color"
                      />
                      <span className="text-xs text-gray-500">Stock: {product.stock_quantity}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => buyAndAddToWardrobe(product.id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
