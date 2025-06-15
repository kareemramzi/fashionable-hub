
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

  const styles = [
    { id: 'formal', name: 'Formal & Professional', description: 'Business attire, formal events' },
    { id: 'casual-chic', name: 'Casual Chic', description: 'Stylish everyday wear' },
    { id: 'trendy', name: 'Trendy & Fashion-Forward', description: 'Latest fashion trends' },
    { id: 'classic', name: 'Classic & Timeless', description: 'Elegant, never goes out of style' },
    { id: 'boho', name: 'Bohemian', description: 'Free-spirited, artistic' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple lines' },
    { id: 'edgy', name: 'Edgy & Bold', description: 'Statement pieces, unique style' },
    { id: 'romantic', name: 'Romantic & Feminine', description: 'Soft, delicate pieces' }
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
          <h1 className="text-2xl font-bold text-gray-800">Choose Your Style</h1>
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
            <CardTitle>What's your style preference?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {styles.map((style) => (
                <div
                  key={style.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStyle === style.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{style.name}</h3>
                      <p className="text-sm text-gray-600">{style.description}</p>
                    </div>
                    {selectedStyle === style.id && (
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
          Get My Recommendations
        </Button>
      </div>
    </div>
  );
};

export default OutfitStyleSelector;
