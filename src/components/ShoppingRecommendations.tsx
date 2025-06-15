
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Filter, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TopNavBar from "./navigation/TopNavBar";

interface ShoppingRecommendationsProps {
  skinTone: string;
  colorPalette: string[];
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const ShoppingRecommendations = ({ skinTone, colorPalette, onBack, onFavorites, onCart, onProfile }: ShoppingRecommendationsProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  // Mock product data with real-looking images
  const products = [
    {
      id: 1,
      name: "Silk Blouse",
      brand: "Elegant Essentials",
      price: 89.99,
      originalPrice: 120.00,
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop",
      color: colorPalette[0] || "#E8F4F8",
      category: "tops",
      rating: 4.5,
      match: 95
    },
    {
      id: 2,
      name: "Tailored Blazer",
      brand: "Professional Plus",
      price: 159.99,
      originalPrice: 200.00,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      color: colorPalette[1] || "#D1E7DD",
      category: "outerwear",
      rating: 4.8,
      match: 92
    },
    {
      id: 3,
      name: "Midi Dress",
      brand: "Grace & Style",
      price: 129.99,
      originalPrice: 170.00,
      image: "https://images.unsplash.com/photo-1566479179817-c3e6fba5dde4?w=300&h=400&fit=crop",
      color: colorPalette[2] || "#F8E8FF",
      category: "dresses",
      rating: 4.6,
      match: 89
    },
    {
      id: 4,
      name: "High-Waist Trousers",
      brand: "Modern Fit",
      price: 79.99,
      originalPrice: 100.00,
      image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop",
      color: colorPalette[3] || "#E1F5FE",
      category: "bottoms",
      rating: 4.4,
      match: 88
    },
    {
      id: 5,
      name: "Cashmere Sweater",
      brand: "Luxury Knits",
      price: 199.99,
      originalPrice: 280.00,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
      color: colorPalette[0] || "#E8F4F8",
      category: "tops",
      rating: 4.9,
      match: 94
    },
    {
      id: 6,
      name: "A-Line Skirt",
      brand: "Chic Collection",
      price: 69.99,
      originalPrice: 90.00,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=300&h=400&fit=crop",
      color: colorPalette[1] || "#D1E7DD",
      category: "bottoms",
      rating: 4.3,
      match: 86
    }
  ];

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter(product => product.category === activeFilter);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const product = products.find(p => p.id === productId);
    toast({
      title: favorites.includes(productId) ? "Removed from favorites" : "Added to favorites",
      description: product?.name,
    });
  };

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to cart",
      description: product?.name,
    });
  };

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
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {product.match}% match
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
                  {product.originalPrice > product.price && (
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
                      {product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: product.color }}
                      title="Recommended color"
                    />
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
