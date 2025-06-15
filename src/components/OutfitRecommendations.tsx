
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutfitRecommendationsProps {
  occasion: string;
  skinTone: string;
  colorPalette: string[];
  onBack: () => void;
  onAddToWardrobe: (item: any) => void;
}

const OutfitRecommendations = ({ occasion, skinTone, colorPalette, onBack, onAddToWardrobe }: OutfitRecommendationsProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  // Generate outfit recommendations based on occasion and skin tone
  const getOutfitRecommendations = () => {
    const baseItems = {
      formal: [
        { id: 1, type: "blazer", name: "Tailored Blazer", price: 159.99, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop" },
        { id: 2, type: "shirt", name: "Silk Blouse", price: 89.99, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop" },
        { id: 3, type: "pants", name: "Dress Trousers", price: 99.99, image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop" },
        { id: 4, type: "shoes", name: "Oxford Heels", price: 129.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop" }
      ],
      casual: [
        { id: 5, type: "top", name: "Cotton T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop" },
        { id: 6, type: "jeans", name: "Denim Jeans", price: 79.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop" },
        { id: 7, type: "cardigan", name: "Knit Cardigan", price: 69.99, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop" },
        { id: 8, type: "sneakers", name: "White Sneakers", price: 89.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop" }
      ],
      party: [
        { id: 9, type: "dress", name: "Cocktail Dress", price: 149.99, image: "https://images.unsplash.com/photo-1566479179817-c3e6fba5dde4?w=300&h=400&fit=crop" },
        { id: 10, type: "heels", name: "Strappy Heels", price: 119.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop" },
        { id: 11, type: "clutch", name: "Evening Clutch", price: 59.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop" },
        { id: 12, type: "jewelry", name: "Statement Earrings", price: 39.99, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop" }
      ]
    };

    const occasionKey = occasion.toLowerCase() as keyof typeof baseItems;
    const items = baseItems[occasionKey] || baseItems.casual;

    return items.map(item => ({
      ...item,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      match: Math.floor(Math.random() * 15) + 85, // 85-100% match
      brand: ["Elegant Essentials", "Modern Fit", "Chic Collection", "Luxury Knits"][Math.floor(Math.random() * 4)]
    }));
  };

  const recommendations = getOutfitRecommendations();

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToWardrobe = (item: any) => {
    onAddToWardrobe(item);
    toast({
      title: "Added to Wardrobe! 👗",
      description: `${item.name} has been added to your wardrobe`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Outfit for {occasion}</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Perfect Outfit Combination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              Curated for your <span className="font-semibold">{skinTone}</span> skin tone
            </p>
            <div className="flex gap-2 mb-4">
              {colorPalette.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {recommendations.map((item) => (
            <Card key={item.id} className="shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {item.match}% match
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`rounded-full ${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-500'} bg-white/80 hover:bg-white`}
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <p className="text-xs text-purple-600 capitalize">{item.type}</p>
                  </div>
                  <p className="font-bold text-purple-600">${item.price}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.color }}
                    title="Recommended color"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToWardrobe(item)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Add to Wardrobe
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitRecommendations;
