import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Filter, Palette, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TopNavBar from "./navigation/TopNavBar";
import { fetchProducts, addProductToWardrobe, Product } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OutfitRecommendationsProps {
  occasion: string;
  skinTone: string;
  colorPalette: string[];
  onBack: () => void;
  onAddToCart: (item: any) => void;
  onAddToFavorites: (item: any) => void;
  onShopNow: () => void;
}

const OutfitRecommendations = ({ 
  occasion, 
  skinTone, 
  colorPalette, 
  onBack, 
  onAddToCart, 
  onAddToFavorites, 
  onShopNow 
}: OutfitRecommendationsProps) => {
  const [recommendationSource, setRecommendationSource] = useState<"wardrobe" | "shop">("shop");
  const [wardrobeOutfits, setWardrobeOutfits] = useState<any[]>([]);

  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
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
    if (wardrobeItems.length > 0) {
      // Generate outfit combinations from wardrobe items
      const combinations = generateWardrobeOutfits(wardrobeItems);
      setWardrobeOutfits(combinations);
    }
  }, [wardrobeItems]);

  const generateWardrobeOutfits = (items: any[]) => {
    // Group items by category
    const tops = items.filter(item => item.products?.category === 'tops');
    const bottoms = items.filter(item => item.products?.category === 'bottoms');
    const dresses = items.filter(item => item.products?.category === 'dresses');
    const outerwear = items.filter(item => item.products?.category === 'outerwear');

    const outfits = [];

    // Create combinations based on available items
    if (tops.length > 0 && bottoms.length > 0) {
      tops.forEach((top, topIndex) => {
        bottoms.forEach((bottom, bottomIndex) => {
          if (topIndex < 3 && bottomIndex < 3) { // Limit combinations
            const outfit = [top, bottom];
            if (outerwear.length > 0 && Math.random() > 0.5) {
              outfit.push(outerwear[0]);
            }
            outfits.push({
              id: `wardrobe-${topIndex}-${bottomIndex}`,
              items: outfit,
              match: calculateWardrobeMatch(outfit)
            });
          }
        });
      });
    }

    if (dresses.length > 0) {
      dresses.forEach((dress, index) => {
        if (index < 2) {
          outfits.push({
            id: `wardrobe-dress-${index}`,
            items: [dress],
            match: calculateWardrobeMatch([dress])
          });
        }
      });
    }

    return outfits.slice(0, 4); // Limit to 4 outfits
  };

  const calculateWardrobeMatch = (items: any[]): number => {
    let match = 70; // Base score for wardrobe items
    
    // Check color matching with user's palette
    items.forEach(item => {
      const itemColor = item.products?.color?.toLowerCase() || '';
      for (const paletteColor of colorPalette) {
        if (itemColor.includes(paletteColor.toLowerCase()) || 
            paletteColor.toLowerCase().includes(itemColor)) {
          match += 10;
          break;
        }
      }
    });

    return Math.min(match, 95);
  };

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
              <Sparkles className="w-5 h-5 text-purple-600" />
              Choose Recommendation Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={recommendationSource === "wardrobe" ? "default" : "outline"}
                onClick={() => setRecommendationSource("wardrobe")}
                className={`flex-1 ${recommendationSource === "wardrobe" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              >
                My Wardrobe ({wardrobeItems.length})
              </Button>
              <Button
                variant={recommendationSource === "shop" ? "default" : "outline"}
                onClick={() => setRecommendationSource("shop")}
                className={`flex-1 ${recommendationSource === "shop" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              >
                Shop Items
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            {recommendationSource === "wardrobe" ? "From Your Wardrobe" : "Shop Recommendations"}
          </h2>
          
          {recommendationSource === "wardrobe" ? (
            wardrobeOutfits.length > 0 ? (
              <div className="grid gap-4">
                {wardrobeOutfits.map((outfit) => (
                  <Card key={outfit.id} className="shadow-lg overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Wardrobe Combination</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {outfit.match}% match
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {outfit.items.map((item: any, index: number) => (
                          <div key={index} className="text-center">
                            <img
                              src={item.products?.image_url || "/placeholder.svg"}
                              alt={item.products?.name}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <p className="text-xs font-medium">{item.products?.name}</p>
                            <p className="text-xs text-gray-500">{item.products?.brand}</p>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        Perfect for: {occasion}
                      </p>
                      
                      <p className="text-xs text-green-600 font-medium">
                        ✨ Already in your wardrobe!
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    No items in your wardrobe yet for outfit combinations
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setRecommendationSource("shop")}
                    className="mb-2"
                  >
                    Browse Shop Instead
                  </Button>
                </CardContent>
              </Card>
            )
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
                          className="rounded-full text-gray-500 bg-white/80 hover:bg-white"
                          onClick={() => onAddToFavorites(product)}
                        >
                          <Heart className="w-4 h-4" />
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
                          onClick={() => onAddToCart(product)}
                          variant="outline"
                          className="flex-1"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => onAddToFavorites(product)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Favorites
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

export default OutfitRecommendations;
