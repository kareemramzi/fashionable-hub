import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Filter, Palette, Sparkles, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TopNavBar from "./navigation/TopNavBar";
import { fetchProducts, addProductToWardrobe, Product } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateAdvancedProductMatch, 
  generateOutfitCombinations, 
  OutfitCombination 
} from "@/lib/colorMatching";

interface ShoppingRecommendationsProps {
  skinTone: string;
  colorPalette: string[];
  occasion?: string;
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const ShoppingRecommendations = ({ 
  skinTone, 
  colorPalette, 
  occasion = 'casual',
  onBack, 
  onFavorites, 
  onCart, 
  onProfile 
}: ShoppingRecommendationsProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("outfits");
  const [outfitCombinations, setOutfitCombinations] = useState<OutfitCombination[]>([]);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', activeFilter === "outfits" ? "all" : activeFilter],
    queryFn: () => fetchProducts(activeFilter === "outfits" ? undefined : activeFilter),
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Generate outfit combinations when products are loaded
  useEffect(() => {
    if (products.length > 0 && activeFilter === "outfits") {
      const combinations = generateOutfitCombinations(products, colorPalette, occasion, 6);
      setOutfitCombinations(combinations);
    }
  }, [products, colorPalette, occasion, activeFilter]);

  const calculateMatch = (product: Product): number => {
    return calculateAdvancedProductMatch(product, colorPalette, occasion);
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
              <p className="text-sm text-gray-600 mb-2">
                Skin Tone: <span className="font-semibold">{skinTone}</span>
                {occasion && <span className="ml-4">Occasion: <span className="font-semibold capitalize">{occasion}</span></span>}
              </p>
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
              Browse Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["outfits", "tops", "bottoms", "dresses", "shoes", "outerwear"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {filter === "outfits" ? (
                    <div className="flex items-center gap-1">
                      <Shirt className="w-4 h-4" />
                      Complete Outfits
                    </div>
                  ) : (
                    filter.charAt(0).toUpperCase() + filter.slice(1)
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            {activeFilter === "outfits" ? "Perfect Outfit Combinations" : "Individual Items"}
          </h2>
          
          {activeFilter === "outfits" ? (
            <div className="grid gap-4">
              {outfitCombinations.map((combination) => (
                <Card key={combination.id} className="shadow-lg overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{combination.styleDescription}</h3>
                        <p className="text-sm text-gray-600">{combination.colorHarmony} Color Harmony</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {combination.matchScore}% match
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {combination.items.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="relative">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-20 object-contain rounded border"
                            />
                            <div 
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                          <p className="text-xs font-medium mt-1 truncate">{item.name}</p>
                          <p className="text-xs text-purple-600 font-semibold">{item.price} EGP</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        Total: <span className="font-bold text-purple-600">
                          {combination.items.reduce((sum, item) => sum + item.price, 0)} EGP
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {(combination.items.reduce((sum, item) => sum + (item.rating || 4.0), 0) / combination.items.length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          combination.items.forEach(item => addToCart(item.id));
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add All to Cart
                      </Button>
                      <Button
                        onClick={() => {
                          combination.items.forEach(item => buyAndAddToWardrobe(item.id));
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Buy Complete Look
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {outfitCombinations.length === 0 && (
                <Card className="shadow-lg">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600 mb-2">No complete outfits available</p>
                    <p className="text-sm text-gray-500">Try browsing individual items to build your own look</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
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
                          <p className="font-bold text-purple-600">{product.price} EGP</p>
                          {product.original_price && product.original_price > product.price && (
                            <p className="text-sm text-gray-500 line-through">{product.original_price} EGP</p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
