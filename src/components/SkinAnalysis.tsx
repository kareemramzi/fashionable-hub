
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SkinAnalysisResults from "./SkinAnalysisResults";
import TopNavBar from "./navigation/TopNavBar";

interface SkinAnalysisProps {
  onAnalysisComplete: (skinTone: string, palette: string[]) => void;
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const SkinAnalysis = ({ onAnalysisComplete, onBack, onFavorites, onCart, onProfile }: SkinAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    skinTone: string;
    colorPalette: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        analyzeImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results based on common skin tone categories
    const skinTones = [
      { name: "Light Cool", colors: ["#E8F4F8", "#D1E7DD", "#F8E8FF", "#E1F5FE"] },
      { name: "Light Warm", colors: ["#FFF8E1", "#FFECB3", "#FFE0B2", "#FFCC80"] },
      { name: "Medium Cool", colors: ["#E3F2FD", "#F3E5F5", "#E8F5E8", "#FFF3E0"] },
      { name: "Medium Warm", colors: ["#FFF3C4", "#FFCC02", "#FF8A65", "#FFAB40"] },
      { name: "Deep Cool", colors: ["#1A237E", "#4A148C", "#B71C1C", "#1B5E20"] },
      { name: "Deep Warm", colors: ["#BF360C", "#E65100", "#FF6F00", "#F57F17"] }
    ];
    
    const randomTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    
    const results = {
      skinTone: randomTone.name,
      colorPalette: randomTone.colors
    };
    
    setAnalysisResults(results);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete! ✨",
      description: `Your skin tone is ${results.skinTone}. Perfect colors selected for you!`,
    });
  };

  const handleContinue = () => {
    if (analysisResults) {
      onAnalysisComplete(analysisResults.skinTone, analysisResults.colorPalette);
    }
  };

  if (analysisResults && uploadedImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <TopNavBar 
          onBack={onBack}
          onFavorites={onFavorites}
          onCart={onCart}
          onProfile={onProfile}
          showBackButton={true}
          title="Skin Analysis"
        />
        <SkinAnalysisResults
          capturedImage={uploadedImage}
          skinTone={analysisResults.skinTone}
          colorPalette={analysisResults.colorPalette}
          onBack={() => {
            setUploadedImage(null);
            setAnalysisResults(null);
          }}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <TopNavBar 
        onBack={onBack}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        showBackButton={true}
        title="Skin Analysis"
      />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card className="shadow-xl bg-white/80 backdrop-blur-lg border border-white/30">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
              <Camera className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover Your Glow
              </span>
            </CardTitle>
            <p className="text-gray-600">Upload a clear photo of your face in natural lighting</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <Upload className="w-6 h-6" />
                Take or Upload Photo
              </label>
            </div>

            {isAnalyzing && (
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-purple-600">Analyzing your glow...</p>
                  <p className="text-sm text-gray-600">
                    ✨ Detecting skin tone<br/>
                    🎨 Finding perfect colors<br/>
                    💫 Creating your palette
                  </p>
                </div>
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">📸 Tips for best results:</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Use natural daylight (avoid harsh shadows)</li>
                <li>• Face the camera directly</li>
                <li>• Remove makeup if possible</li>
                <li>• Ensure good image quality</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkinAnalysis;
