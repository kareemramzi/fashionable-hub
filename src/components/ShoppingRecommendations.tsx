
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Heart, Filter } from "lucide-react";
import { toast } from "sonner";

interface ShoppingRecommendationsProps {
  userProfile: {
    skinTone: string;
    colorPalette: string[];
    selectedOutfitType: string;
    wardrobe: any[];
  };
  onBack: () => void;
}

const ShoppingRecommendations = ({ userProfile, onBack }: ShoppingRecommendationsProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock recommended items based on skin tone and outfit type
  const mockRecommendations = [
    {
      id: 1,
      name: "Classic White Cotton Shirt",
      brand: "Premium Brand",
      price: 89.99,
      image: "/placeholder.svg",
      colors: ["White", "Light Blue", "Cream"],
      sizes: ["S", "M", "L", "XL"],
      match: 96,
      inStock: true
    },
    {
      id: 2,
      name: "Tailored Navy Blazer",
      brand: "Executive Collection",
      price: 249.99,
      image: "/placeholder.svg",
      colors: ["Navy", "Charcoal", "Black"],
      sizes: ["S", "M", "L", "XL"],
      match: 94,
      inStock: true
    },
    {
      id: 3,
      name: "Slim Fit Dress Pants",
      brand: "Modern Fit",
      price: 129.99,
      image: "/placeholder.svg",
      colors: ["Black", "Navy", "Charcoal"],
      sizes: ["28", "30", "32", "34", "36"],
      match: 91,
      inStock: false
    },
    {
      id: 4,
      name: "Leather Oxford Shoes",
      brand: "Luxury Footwear",
      price: 199.99,
      image: "/placeholder.svg",
      colors: ["Black", "Brown"],
      sizes: ["7", "8", "9", "10", "11"],
      match: 89,
      inStock: true
    }
  ];

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToCart = (item: any) => {
    toast.success(`${item.name} added to cart!`);
  };

  const handleCheckout = (item: any) => {
    toast.info("Redirecting to checkout...");
    // In a real app, this would redirect to the partner store's checkout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Recommended for You</h1>
            <p className="text-sm text-gray-600">Perfect for {userProfile.selectedOutfitType} occasions</p>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Color Matched Items</CardTitle>
            <div className="flex gap-1">
              {userProfile.colorPalette.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {mockRecommendations.map((item) => (
            <Card key={item.id} className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(item.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {item.match}% match
                      </Badge>
                      {!item.inStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-purple-600">
                        ${item.price}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleCheckout(item)}
                          disabled={!item.inStock}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p>Colors: {item.colors.join(", ")}</p>
                      <p>Sizes: {item.sizes.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <h3 className="font-medium text-purple-800 mb-2">Premium Styling Service</h3>
            <p className="text-sm text-purple-600 mb-3">
              Get personalized outfit combinations delivered monthly
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
