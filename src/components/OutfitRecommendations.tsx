import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Palette, Sparkles, Shirt } from "lucide-react";
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

interface OutfitRecommendationsProps {
  occasion: string;
  skinTone: string;
  colorPalette: string[];
  recommendationSource: "wardrobe" | "shop";
  onBack: () => void;
  onAddToCart: (item: any) => void;
  onAddToFavorites: (item: any) => void;
  onShopNow: () => void;
}

const OutfitRecommendations = ({ 
  occasion, 
  skinTone, 
  colorPalette, 
  recommendationSource,
  onBack, 
  onAddToCart, 
  onAddToFavorites, 
  onShopNow 
}: OutfitRecommendationsProps) => {
  const [wardrobeOutfits, setWardrobeOutfits] = useState<OutfitCombination[]>([]);
  const [shopOutfits, setShopOutfits] = useState<OutfitCombination[]>([]);

  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data } = await supabase
        .from('user_profiles')
        .select('gender')
        .eq('user_id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', userProfile?.gender],
    queryFn: () => fetchProducts(undefined, userProfile?.gender),
    enabled: !!userProfile
  });

  const { data: wardrobeItems = [] } = useQuery({
    queryKey: ['wardrobe-items', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user
  });

  useEffect(() => {
    if (recommendationSource === "wardrobe" && wardrobeItems.length > 0) {
      // Generate outfit combinations from wardrobe items
      const wardrobeProducts = wardrobeItems.map(item => item.products).filter(Boolean);
      const combinations = generateOutfitCombinations(wardrobeProducts, colorPalette, occasion, 4);
      setWardrobeOutfits(combinations);
    } else if (recommendationSource === "shop" && products.length > 0) {
      // Generate outfit combinations from shop products
      const combinations = generateOutfitCombinations(products, colorPalette, occasion, 6);
      setShopOutfits(combinations);
    }
  }, [wardrobeItems, products, colorPalette, occasion, recommendationSource]);

  const calculateMatch = (product: Product): number => {
    return calculateAdvancedProductMatch(product, colorPalette, occasion);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <TopNavBar 
          onBack={onBack}
          onFavorites={() => {}}
          onCart={() => {}}
          onProfile={() => {}}
          showBackButton={true}
          title="Recommendations"
        />
        <div className="max-w-md mx-auto p-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const currentOutfits = recommendationSource === "wardrobe" ? wardrobeOutfits : shopOutfits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <TopNavBar 
        onBack={onBack}
        onFavorites={() => {}}
        onCart={() => {}}
        onProfile={() => {}}
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
              <Shirt className="w-5 h-5 text-purple-600" />
              {recommendationSource === "wardrobe" ? "From Your Wardrobe" : "Shop Recommendations"}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Perfect for: <span className="font-semibold capitalize">{occasion}</span>
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Complete Outfit Combinations</h2>
          
          {currentOutfits.length > 0 ? (
            <div className="grid gap-4">
              {currentOutfits.map((combination) => (
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
                      {combination.items.map((item: any, index: number) => (
                        <div key={index} className="text-center">
                          <div className="relative">
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-20 object-contain rounded border"
                            />
                            <div 
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                          <p className="text-xs font-medium mt-1 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.brand}</p>
                          {recommendationSource === "shop" && (
                            <p className="text-xs text-purple-600 font-semibold">{item.price} EGP</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      {recommendationSource === "shop" && (
                        <div className="text-sm text-gray-600">
                          Total: <span className="font-bold text-purple-600">
                            {combination.items.reduce((sum, item) => sum + item.price, 0)} EGP
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {(combination.items.reduce((sum, item) => sum + (item.rating || 4.0), 0) / combination.items.length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    {recommendationSource === "wardrobe" ? (
                      <p className="text-xs text-green-600 font-medium text-center py-2">
                        ✨ Complete outfit from your wardrobe!
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            combination.items.forEach(item => onAddToCart(item));
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add All to Cart
                        </Button>
                        <Button
                          onClick={() => {
                            combination.items.forEach(item => onAddToFavorites(item));
                          }}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save Outfit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4">
                  {recommendationSource === "wardrobe" 
                    ? "No items in your wardrobe yet for outfit combinations"
                    : "No outfit combinations available for this occasion"
                  }
                </p>
                {recommendationSource === "wardrobe" && (
                  <Button
                    variant="outline"
                    onClick={onShopNow}
                    className="mb-2"
                  >
                    Browse Shop Instead
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitRecommendations;
