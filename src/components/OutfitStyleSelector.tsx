
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Palette } from "lucide-react";

interface OutfitStyleSelectorProps {
  skinTone: string;
  colorPalette: string[];
  onStyleSelected: (style: string) => void;
  onBack: () => void;
}

const OutfitStyleSelector = ({ skinTone, colorPalette, onStyleSelected, onBack }: OutfitStyleSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const occasions = [
    { id: 'formal', name: 'Formal & Professional', description: 'Business meetings, interviews, formal events' },
    { id: 'casual', name: 'Casual Everyday', description: 'Daily wear, shopping, casual outings' },
    { id: 'party', name: 'Party & Evening', description: 'Parties, dinner dates, nightouts' },
    { id: 'business', name: 'Business Casual', description: 'Office wear, client meetings' },
    { id: 'weekend', name: 'Weekend Relaxed', description: 'Weekend activities, brunch, coffee dates' },
    { id: 'workout', name: 'Active & Sporty', description: 'Gym, sports, outdoor activities' },
    { id: 'travel', name: 'Travel Comfort', description: 'Airport, long flights, road trips' },
    { id: 'date', name: 'Date Night', description: 'Romantic dinners, special occasions' }
  ];

  const handleContinue = () => {
    if (selectedStyle) {
      onStyleSelected(selectedStyle);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Choose Occasion</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Your Personalized Palette
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
              {occasions.map((occasion) => (
                <div
                  key={occasion.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStyle === occasion.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedStyle(occasion.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{occasion.name}</h3>
                      <p className="text-sm text-gray-600">{occasion.description}</p>
                    </div>
                    {selectedStyle === occasion.id && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleContinue}
          disabled={!selectedStyle}
          className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
          size="lg"
        >
          Get Outfit Recommendations
        </Button>
      </div>
    </div>
  );
};

export default OutfitStyleSelector;
