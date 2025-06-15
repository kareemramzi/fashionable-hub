
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Palette, Sparkles } from "lucide-react";

interface SkinAnalysisResultsProps {
  onBack: () => void;
  onContinue: () => void;
  skinTone: string;
  colorPalette: string[];
  capturedImage: string;
}

const SkinAnalysisResults = ({ 
  onBack, 
  onContinue, 
  skinTone, 
  colorPalette, 
  capturedImage 
}: SkinAnalysisResultsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const skinToneDescriptions = {
    'Fair': 'Light complexion with cool undertones. You have delicate, porcelain-like skin.',
    'Light': 'Light to medium complexion with neutral undertones. Your skin has a natural glow.',
    'Medium': 'Medium complexion with warm undertones. You have beautiful olive-toned skin.',
    'Olive': 'Medium to dark complexion with golden undertones. Your skin has rich, warm tones.',
    'Dark': 'Dark complexion with deep undertones. You have gorgeous, rich melanin.',
    'Deep': 'Very dark complexion with deep, rich undertones. Your skin is beautifully dark and radiant.'
  };

  const getRecommendations = (tone: string) => {
    const recommendations = {
      'Fair': ['Pastels', 'Cool blues', 'Soft pinks', 'Lavender', 'Mint green'],
      'Light': ['Earth tones', 'Warm neutrals', 'Coral', 'Peach', 'Soft yellows'],
      'Medium': ['Rich jewel tones', 'Emerald', 'Sapphire', 'Deep purples', 'Burgundy'],
      'Olive': ['Warm golds', 'Burnt orange', 'Deep reds', 'Forest green', 'Chocolate brown'],
      'Dark': ['Bright colors', 'Electric blue', 'Hot pink', 'Sunshine yellow', 'Pure white'],
      'Deep': ['Bold contrasts', 'Neon colors', 'Royal purple', 'Crimson red', 'Bright turquoise']
    };
    return recommendations[tone as keyof typeof recommendations] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Your Glow Analysis</h1>
        </div>

        {/* User's Photo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              Your Beautiful Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={capturedImage} 
              alt="Your photo" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Skin Tone Analysis */}
        <Card className="shadow-lg border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              Your Skin Tone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {skinTone}
              </Badge>
            </div>
            <p className="text-gray-600 text-center">
              {skinToneDescriptions[skinTone as keyof typeof skinToneDescriptions]}
            </p>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Your Perfect Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    selectedColor === color 
                      ? 'border-white shadow-lg scale-110' 
                      : 'border-gray-200 hover:border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                />
              ))}
            </div>
            {selectedColor && (
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Selected: <span style={{ color: selectedColor }}>{selectedColor}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Recommendations */}
        <Card className="shadow-lg bg-gradient-to-r from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-center">Perfect Style Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {getRecommendations(skinTone).map((rec, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-white/70 text-purple-700 hover:bg-white transition-colors"
                >
                  {rec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Continue to Outfit Selection
        </Button>
      </div>
    </div>
  );
};

export default SkinAnalysisResults;
