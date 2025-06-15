import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TopNavBar from "./navigation/TopNavBar";

interface ShoppingRecommendationsProps {
  skinTone: string;
  colorPalette: string[];
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const ShoppingRecommendations = ({ 
  skinTone, 
  colorPalette, 
  onBack, 
  onFavorites, 
  onCart, 
  onProfile 
}: ShoppingRecommendationsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { toast } = useToast();

  const addToFavorites = async (product: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_name: product.name,
          brand: product.brand,
          price: product.price,
          color: product.color,
          image_url: product.image
        });

      if (error) throw error;

      toast({
        title: "Added to favorites! ❤️",
        description: `${product.name} has been saved to your favorites`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to favorites",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addToCart = async (product: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_name: product.name,
          brand: product.brand,
          price: product.price,
          size: 'M', // Default size
          color: product.color,
          image_url: product.image,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to cart! 🛒",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const mockProducts = [
    {
      id: 1,
      name: "Silk Blouse",
      brand: "Elegant Co.",
      price: 89,
      category: "Tops",
      color: "#E8F4F8",
      image: "/placeholder.svg",
      match: 95
    },
    {
      id: 2,
      name: "Tailored Blazer",
      brand: "Professional Line",
      price: 159,
      category: "Outerwear",
      color: "#D1E7DD",
      image: "/placeholder.svg",
      match: 92
    },
    {
      id: 3,
      name: "Flowing Midi Dress",
      brand: "Grace Style",
      price: 125,
      category: "Dresses",
      color: "#F8E8FF",
      image: "/placeholder.svg",
      match: 88
    },
    {
      id: 4,
      name: "Classic Trousers",
      brand: "Timeless Fashion",
      price: 95,
      category: "Bottoms",
      color: "#E1F5FE",
      image: "/placeholder.svg",
      match: 90
    }
  ];

  const getRecommendedProducts = () => {
    if (selectedCategory === "All") {
      return mockProducts;
    }
    return mockProducts.filter(product => product.category === selectedCategory);
  };

  const categories = ["All", "Tops", "Dresses", "Bottoms", "Outerwear"];

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
        <Card className="shadow-xl bg-white/80 backdrop-blur-lg border border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect for {skinTone}
              </span>
            </CardTitle>
            <div className="flex gap-2">
              {colorPalette.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardHeader>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "hover:bg-purple-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {getRecommendedProducts().map((product) => (
            <Card key={product.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">${product.price}</p>
                        <p className="text-xs text-green-600">{product.match}% match</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="text-xs text-gray-600">Perfect for your tone</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToFavorites(product)}
                        className="flex-1 text-pink-600 border-pink-600 hover:bg-pink-50"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
