
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, ShoppingBag } from "lucide-react";

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

  // Mock wardrobe items
  const mockWardrobeItems = [
    { id: 1, name: "White Button Shirt", type: "top", color: "#FFFFFF", image: "/placeholder.svg" },
    { id: 2, name: "Navy Blazer", type: "top", color: "#2C3E50", image: "/placeholder.svg" },
    { id: 3, name: "Dark Jeans", type: "bottom", color: "#1C2833", image: "/placeholder.svg" },
    { id: 4, name: "Black Trousers", type: "bottom", color: "#000000", image: "/placeholder.svg" },
  ];

  const mockCombinations = [
    {
      id: 1,
      name: "Professional Look",
      items: ["White Button Shirt", "Navy Blazer", "Black Trousers"],
      match: 95
    },
    {
      id: 2,
      name: "Smart Casual",
      items: ["White Button Shirt", "Dark Jeans"],
      match: 88
    }
  ];

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
            <CardTitle>For {userProfile.selectedOutfitType} occasions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="combinations">My Combinations</TabsTrigger>
                <TabsTrigger value="items">My Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="combinations" className="space-y-4 mt-4">
                {mockCombinations.length > 0 ? (
                  <div className="space-y-3">
                    {mockCombinations.map((combo) => (
                      <Card key={combo.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{combo.name}</h3>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              {combo.match}% match
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {combo.items.join(" + ")}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No outfit combinations yet</p>
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Items to Wardrobe
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4 mt-4">
                {mockWardrobeItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {mockWardrobeItems.map((item) => (
                      <Card key={item.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Image</span>
                          </div>
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Your wardrobe is empty</p>
                    <Button variant="outline" className="gap-2">
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
          
          <Button
            variant="outline"
            className="w-full py-6 text-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Items to Wardrobe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WardrobeManager;
