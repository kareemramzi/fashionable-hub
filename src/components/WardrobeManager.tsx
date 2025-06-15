
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WardrobeItem {
  id: number;
  name: string;
  type: string;
  color: string;
  image: string;
  brand: string;
  occasion?: string[];
}

interface OutfitCombination {
  id: number;
  name: string;
  occasion: string;
  items: WardrobeItem[];
  match: number;
}

interface WardrobeManagerProps {
  userProfile: {
    skinTone: string;
    colorPalette: string[];
    selectedOutfitType: string;
    wardrobe: WardrobeItem[];
  };
  onProceedToShopping: () => void;
  onBack: () => void;
  onProfile: () => void;
}

const WardrobeManager = ({ userProfile, onProceedToShopping, onBack, onProfile }: WardrobeManagerProps) => {
  const [activeTab, setActiveTab] = useState("combinations");
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfitCombinations, setOutfitCombinations] = useState<OutfitCombination[]>([]);

  // Initialize with some sample wardrobe items
  useEffect(() => {
    const sampleItems: WardrobeItem[] = [
      {
        id: 1,
        name: "White Button Shirt",
        type: "shirt",
        color: "#FFFFFF",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop",
        brand: "Elegant Essentials",
        occasion: ["formal", "casual"]
      },
      {
        id: 2,
        name: "Navy Blazer",
        type: "blazer",
        color: "#2C3E50",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
        brand: "Professional Plus",
        occasion: ["formal", "business"]
      },
      {
        id: 3,
        name: "Dark Jeans",
        type: "jeans",
        color: "#1C2833",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop",
        brand: "Modern Fit",
        occasion: ["casual", "weekend"]
      },
      {
        id: 4,
        name: "Black Trousers",
        type: "pants",
        color: "#000000",
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=400&fit=crop",
        brand: "Chic Collection",
        occasion: ["formal", "business"]
      },
      {
        id: 5,
        name: "Midi Dress",
        type: "dress",
        color: userProfile.colorPalette[0] || "#F8E8FF",
        image: "https://images.unsplash.com/photo-1566479179817-c3e6fba5dde4?w=300&h=400&fit=crop",
        brand: "Grace & Style",
        occasion: ["party", "dinner"]
      }
    ];
    setWardrobeItems(sampleItems);
    generateOutfitCombinations(sampleItems);
  }, [userProfile.colorPalette]);

  const generateOutfitCombinations = (items: WardrobeItem[]) => {
    const combinations: OutfitCombination[] = [];

    // Formal combination
    const formalItems = items.filter(item => 
      item.occasion?.includes("formal") || item.occasion?.includes("business")
    );
    if (formalItems.length >= 2) {
      combinations.push({
        id: 1,
        name: "Professional Look",
        occasion: "Business Meeting",
        items: formalItems.slice(0, 3),
        match: 95
      });
    }

    // Casual combination
    const casualItems = items.filter(item => 
      item.occasion?.includes("casual") || item.type === "jeans"
    );
    if (casualItems.length >= 2) {
      combinations.push({
        id: 2,
        name: "Smart Casual",
        occasion: "Weekend Brunch",
        items: casualItems.slice(0, 2),
        match: 88
      });
    }

    // Party combination
    const partyItems = items.filter(item => 
      item.occasion?.includes("party") || item.type === "dress"
    );
    if (partyItems.length >= 1) {
      combinations.push({
        id: 3,
        name: "Evening Elegance",
        occasion: "Dinner Date",
        items: partyItems.slice(0, 2),
        match: 92
      });
    }

    setOutfitCombinations(combinations);
  };

  const addItemToWardrobe = (item: WardrobeItem) => {
    setWardrobeItems(prev => [...prev, item]);
    generateOutfitCombinations([...wardrobeItems, item]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Your Wardrobe</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Personalized for {userProfile.skinTone}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {userProfile.colorPalette.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="combinations">Outfit Ideas</TabsTrigger>
                <TabsTrigger value="items">My Items ({wardrobeItems.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="combinations" className="space-y-4 p-4">
                {outfitCombinations.length > 0 ? (
                  <div className="space-y-3">
                    {outfitCombinations.map((combo) => (
                      <Card key={combo.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">{combo.name}</h3>
                              <p className="text-sm text-gray-600">{combo.occasion}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {combo.match}% match
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            {combo.items.map((item) => (
                              <div key={item.id} className="flex-1">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-16 object-cover rounded"
                                />
                                <p className="text-xs text-center mt-1 truncate">{item.name}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {combo.items.map(item => item.name).join(" + ")}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No outfit combinations yet</p>
                    <p className="text-sm text-gray-500 mb-4">Add more items to get personalized outfit suggestions</p>
                    <Button onClick={onProceedToShopping} variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Shop for Items
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4 p-4">
                {wardrobeItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {wardrobeItems.map((item) => (
                      <Card key={item.id} className="border border-gray-200 overflow-hidden">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-purple-600 capitalize">{item.type}</span>
                            {item.occasion && (
                              <Badge variant="secondary" className="text-xs">
                                {item.occasion[0]}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Your wardrobe is empty</p>
                    <Button onClick={onProceedToShopping} variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Item
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={onProceedToShopping}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Recommended Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WardrobeManager;
