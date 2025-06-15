
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SkinAnalysisProps {
  onAnalysisComplete: (skinTone: string, palette: string[]) => void;
  onBack: () => void;
}

const SkinAnalysis = ({ onAnalysisComplete, onBack }: SkinAnalysisProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSkinTone = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate skin tone analysis (in a real app, this would use AI/ML)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const skinTones = ['Fair', 'Light', 'Medium', 'Olive', 'Dark', 'Deep'];
    const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    
    const colorPalettes = {
      'Fair': ['#E8D5C4', '#F4E4D6', '#D4A574', '#8B4513', '#4A4A4A'],
      'Light': ['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#2F4F4F'],
      'Medium': ['#D2B48C', '#BC9A6A', '#8B7355', '#654321', '#191970'],
      'Olive': ['#C4A484', '#A0836D', '#7D6D61', '#5D4E37', '#8B0000'],
      'Dark': ['#8B4513', '#7B3F00', '#654321', '#4A4A4A', '#FF6347'],
      'Deep': ['#654321', '#5D4E37', '#4A4A4A', '#2F2F2F', '#8B008B']
    };
    
    const palette = colorPalettes[randomSkinTone as keyof typeof colorPalettes] || colorPalettes.Medium;
    
    setIsAnalyzing(false);
    toast.success(`Skin tone analyzed: ${randomSkinTone}`);
    onAnalysisComplete(randomSkinTone, palette);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Skin Tone Analysis</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              Capture Your Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Take a clear photo of your face in natural lighting</p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Tips for best results:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use natural lighting</li>
                    <li>Face the camera directly</li>
                    <li>Remove makeup if possible</li>
                    <li>Ensure clear visibility of your face</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCapturedImage(null)}
                    className="flex-1"
                  >
                    Retake
                  </Button>
                  <Button 
                    onClick={analyzeSkinTone}
                    disabled={isAnalyzing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Skin Tone'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkinAnalysis;
