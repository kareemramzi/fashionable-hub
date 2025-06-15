
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchWardrobeItems } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

interface WardrobeItem {
  id: string;
  user_id: string;
  product_id: string;
  size?: string;
  purchase_date: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    brand: string;
    category: string;
    color: string;
    image_url: string;
    price: number;
  };
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
    wardrobe: any[];
  };
  onProceedToShopping: () => void;
  onBack: () => void;
  onProfile: () => void;
}

const WardrobeManager = ({ userProfile, onProceedToShopping, onBack, onProfile }: WardrobeManagerProps) => {
  const [activeTab, setActiveTab] = useState("combinations");
  const [outfitCombinations, setOutfitCombinations] = useState<OutfitCombination[]>([]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: wardrobeItems = [], isLoading } = useQuery({
    queryKey: ['wardrobe-items', session?.user?.id],
    queryFn: () => session?.user ? fetchWardrobeItems(session.user.id) : Promise.resolve([]),
    enabled: !!session?.user
  });

  useEffect(() => {
    generateOutfitCombinations(wardrobeItems);
  }, [wardrobeItems]);

  const generateOutfitCombinations = (items: WardrobeItem[]) => {
    const combinations: OutfitCombination[] = [];

    // Group items by category
    const tops = items.filter(item => item.products?.category === 'tops');
    const bottoms = items.filter(item => item.products?.category === 'bottoms');
    const dresses = items.filter(item => item.products?.category === 'dresses');
    const outerwear = items.filter(item => item.products?.category === 'outerwear');

    // Formal combination
    if (tops.length > 0 && bottoms.length > 0) {
      const formalTop = tops[0];
      const formalBottom = bottoms[0];
      const formalItems = [formalTop, formalBottom];
      
      if (outerwear.length > 0) {
        formalItems.push(outerwear[0]);
      }

      combinations.push({
        id: 1,
        name: "Professional Look",
        occasion: "Business Meeting",
        items: formalItems,
        match: 95
      });
    }

    // Casual combination
    if (tops.length > 0 && bottoms.length > 0) {
      const casualItems = [tops[Math.min(1, tops.length - 1)] || tops[0], bottoms[Math.min(1, bottoms.length - 1)] || bottoms[0]];
      
      combinations.push({
        id: 2,
        name: "Smart Casual",
        occasion: "Weekend Brunch",
        items: casualItems,
        match: 88
      });
    }

    // Dress combination
    if (dresses.length > 0) {
      const dressItems = [dresses[0]];
      
      combinations.push({
        id: 3,
        name: "Evening Elegance",
        occasion: "Dinner Date",
        items: dressItems,
        match: 92
      });
    }

    setOutfitCombinations(combinations);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Your Wardrobe</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

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
                                  src={item.products?.image_url}
                                  alt={item.products?.name}
                                  className="w-full h-16 object-cover rounded"
                                />
                                <p className="text-xs text-center mt-1 truncate">{item.products?.name}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {combo.items.map(item => item.products?.name).join(" + ")}
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
                            src={item.products?.image_url}
                            alt={item.products?.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: item.products?.color }}
                            />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{item.products?.name}</p>
                          <p className="text-xs text-gray-500">{item.products?.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-purple-600 capitalize">{item.products?.category}</span>
                            {item.size && (
                              <Badge variant="secondary" className="text-xs">
                                Size {item.size}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Added: {new Date(item.created_at).toLocaleDateString()}
                          </p>
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
