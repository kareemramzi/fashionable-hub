
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Palette, Sparkles, BarChart3, Eye } from "lucide-react";

interface SkinAnalysisResultsProps {
  onBack: () => void;
  onContinue: () => void;
  skinTone: string;
  colorPalette: string[];
  capturedImage: string;
  confidence?: number;
  dominantColors?: string[];
}

const SkinAnalysisResults = ({ 
  onBack, 
  onContinue, 
  skinTone, 
  colorPalette, 
  capturedImage,
  confidence = 100,
  dominantColors = []
}: SkinAnalysisResultsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const skinToneDescriptions = {
    'Fair Cool': 'Light complexion with pink/blue undertones. Perfect for cool-toned colors and pastels.',
    'Fair Warm': 'Light complexion with yellow/golden undertones. Ideal for warm earth tones and gold accents.',
    'Fair Neutral': 'Light complexion with balanced undertones. You can wear both warm and cool colors beautifully.',
    'Light Cool': 'Light-medium complexion with cool undertones. Cool blues, purples, and silvers enhance your natural glow.',
    'Light Warm': 'Light-medium complexion with warm undertones. Warm oranges, corals, and golds complement you perfectly.',
    'Light Neutral': 'Light-medium complexion with neutral undertones. You have the versatility to wear most colors.',
    'Medium Cool': 'Medium complexion with cool undertones. Bold cool colors and jewel tones look stunning on you.',
    'Medium Warm': 'Medium complexion with warm undertones. Rich warm colors and earth tones enhance your beauty.',
    'Medium Neutral': 'Medium complexion with balanced undertones. You can confidently wear a wide range of colors.',
    'Deep Cool': 'Deep complexion with cool undertones. Bright, bold colors and cool jewel tones are your power colors.',
    'Deep Warm': 'Deep complexion with warm undertones. Rich, vibrant warm colors create a beautiful contrast.',
    'Deep Neutral': 'Deep complexion with neutral undertones. You look amazing in both warm and cool bold colors.'
  };

  const getRecommendations = (tone: string) => {
    const recommendations = {
      'Fair Cool': ['Pastels', 'Cool blues', 'Soft pinks', 'Lavender', 'Mint green', 'Silver accents'],
      'Fair Warm': ['Peach', 'Warm coral', 'Soft yellows', 'Cream', 'Gold accents', 'Warm beige'],
      'Fair Neutral': ['Soft neutrals', 'Blush pink', 'Light gray', 'Ivory', 'Champagne', 'Nude tones'],
      'Light Cool': ['Cool grays', 'Navy blue', 'Emerald', 'Cool pink', 'Platinum', 'Icy blue'],
      'Light Warm': ['Warm browns', 'Coral', 'Peach', 'Camel', 'Gold', 'Warm olive'],
      'Light Neutral': ['Taupe', 'Soft brown', 'Rose gold', 'Warm gray', 'Nude pink', 'Cream'],
      'Medium Cool': ['Jewel tones', 'Emerald', 'Sapphire', 'Cool purple', 'Silver', 'Fuchsia'],
      'Medium Warm': ['Rich browns', 'Burnt orange', 'Deep coral', 'Bronze', 'Warm red', 'Terracotta'],
      'Medium Neutral': ['Earth tones', 'Olive green', 'Rust', 'Warm gray', 'Cognac', 'Mocha'],
      'Deep Cool': ['Bright colors', 'Electric blue', 'Hot pink', 'Purple', 'Cool red', 'White'],
      'Deep Warm': ['Rich colors', 'Orange', 'Warm red', 'Golden yellow', 'Copper', 'Warm brown'],
      'Deep Neutral': ['Bold contrasts', 'Bright white', 'Deep navy', 'Rich purple', 'Black', 'Gold']
    };
    return recommendations[tone as keyof typeof recommendations] || [];
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600 bg-green-100';
    if (conf >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceText = (conf: number) => {
    if (conf >= 80) return 'High Confidence';
    if (conf >= 60) return 'Good Confidence';
    return 'Moderate Confidence';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Your AI Analysis</h1>
        </div>

        {/* Analysis Confidence */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Confidence Score:</span>
              <Badge className={`${getConfidenceColor(confidence)} border-0`}>
                {confidence}% - {getConfidenceText(confidence)}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              Based on analysis of skin pixels, color distribution, and undertone detection
            </p>
          </CardContent>
        </Card>

        {/* User's Photo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              Analyzed Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={capturedImage} 
              alt="Your analyzed photo" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Dominant Colors */}
        {dominantColors.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Detected Skin Tones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-center">
                {dominantColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skin Tone Classification */}
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
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              {skinToneDescriptions[skinTone as keyof typeof skinToneDescriptions] || 
               'Your unique skin tone has been analyzed for personalized color recommendations.'}
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
            <div className="grid grid-cols-6 gap-2">
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
                  Selected: <span className="font-mono" style={{ color: selectedColor }}>{selectedColor}</span>
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
