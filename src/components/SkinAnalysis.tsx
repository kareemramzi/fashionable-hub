
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SkinAnalysisResults from "./SkinAnalysisResults";
import TopNavBar from "./navigation/TopNavBar";
import { analyzeSkinTone } from "@/lib/skinToneAnalysis";

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
    confidence: number;
    dominantColors: string[];
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please choose an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

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
    setAnalysisError(null);
    
    try {
      console.log('Starting skin tone analysis...');
      const results = await analyzeSkinTone(imageUrl);
      
      console.log('Analysis results:', results);
      setAnalysisResults(results);
      
      if (results.confidence < 60) {
        toast({
          title: "Analysis Complete with Low Confidence",
          description: `Detected ${results.skinTone} with ${results.confidence}% confidence. Consider retaking the photo in better lighting.`,
        });
      } else {
        toast({
          title: "Analysis Complete! ✨",
          description: `Your skin tone is ${results.skinTone} with ${results.confidence}% confidence.`,
        });
      }
    } catch (error) {
      console.error('Skin tone analysis failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try with a clearer photo with good lighting.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (analysisResults) {
      onAnalysisComplete(analysisResults.skinTone, analysisResults.colorPalette);
    }
  };

  const handleRetry = () => {
    setUploadedImage(null);
    setAnalysisResults(null);
    setAnalysisError(null);
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
          confidence={analysisResults.confidence}
          dominantColors={analysisResults.dominantColors}
          onBack={handleRetry}
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
                AI Skin Analysis
              </span>
            </CardTitle>
            <p className="text-gray-600">Upload a clear photo for accurate skin tone analysis</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isAnalyzing}
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center gap-3 ${
                  isAnalyzing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer hover:scale-105'
                } text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <Upload className="w-6 h-6" />
                {isAnalyzing ? 'Analyzing...' : 'Take or Upload Photo'}
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
                  <p className="font-semibold text-purple-600">AI analyzing your skin tone...</p>
                  <p className="text-sm text-gray-600">
                    ✨ Processing image<br/>
                    🔍 Detecting skin pixels<br/>
                    🎨 Analyzing undertones<br/>
                    💫 Creating your palette
                  </p>
                </div>
              </div>
            )}

            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Analysis Failed</h3>
                </div>
                <p className="text-sm text-red-600 mb-3">{analysisError}</p>
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">📸 For best results:</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Use natural daylight (avoid artificial lighting)</li>
                <li>• Face the camera directly with clear skin visible</li>
                <li>• Remove makeup if possible for accurate analysis</li>
                <li>• Ensure the image is clear and well-lit</li>
                <li>• Include forehead, cheeks, and jawline in the frame</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🔬 AI Technology:</h3>
              <p className="text-sm text-blue-700">
                Our advanced computer vision analyzes thousands of skin pixels to determine your exact skin tone, undertones, and create a personalized color palette just for you.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkinAnalysis;
