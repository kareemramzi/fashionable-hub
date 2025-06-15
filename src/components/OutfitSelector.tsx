
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Palette, CheckCircle } from "lucide-react";

interface OutfitSelectorProps {
  skinTone: string;
  colorPalette: string[];
  onOutfitSelected: (outfitType: string) => void;
  onBack: () => void;
}

const OutfitSelector = ({ skinTone, colorPalette, onOutfitSelected, onBack }: OutfitSelectorProps) => {
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);

  const outfitTypes = [
    { id: 'formal', name: 'Formal', description: 'Business meetings, interviews, formal events' },
    { id: 'semi-formal', name: 'Semi-Formal', description: 'Dinner dates, parties, casual office' },
    { id: 'casual', name: 'Casual', description: 'Weekend outings, social gatherings' },
    { id: 'everyday', name: 'Everyday Wear', description: 'Daily activities, running errands' },
    { id: 'comfy', name: 'Comfy Wear', description: 'Lounging, relaxing at home' },
    { id: 'home', name: 'Home Wear', description: 'Staying in, working from home' },
    { id: 'beach', name: 'Beach Wear', description: 'Beach, pool, vacation' },
    { id: 'workout', name: 'Workout', description: 'Gym, sports, active lifestyle' },
    { id: 'party', name: 'Party Wear', description: 'Clubs, celebrations, night out' },
    { id: 'travel', name: 'Travel Wear', description: 'Comfortable for long journeys' }
  ];

  const handleOutfitSelection = () => {
    if (selectedOutfit) {
      onOutfitSelected(selectedOutfit);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Choose Your Style</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Your Color Palette
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
            <CardTitle>What occasion are you dressing for?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {outfitTypes.map((outfit) => (
                <div
                  key={outfit.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedOutfit === outfit.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedOutfit(outfit.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{outfit.name}</h3>
                      <p className="text-sm text-gray-600">{outfit.description}</p>
                    </div>
                    {selectedOutfit === outfit.id && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleOutfitSelection}
          disabled={!selectedOutfit}
          className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
          size="lg"
        >
          Continue to Wardrobe
        </Button>
      </div>
    </div>
  );
};

export default OutfitSelector;
