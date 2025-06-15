
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Palette, ShoppingBag, User } from "lucide-react";
import SkinAnalysis from "@/components/SkinAnalysis";
import OutfitSelector from "@/components/OutfitSelector";
import WardrobeManager from "@/components/WardrobeManager";
import ShoppingRecommendations from "@/components/ShoppingRecommendations";

type AppScreen = 'home' | 'skin-analysis' | 'outfit-selector' | 'wardrobe' | 'shopping';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [userProfile, setUserProfile] = useState({
    skinTone: '',
    colorPalette: [] as string[],
    selectedOutfitType: '',
    wardrobe: [] as any[]
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case 'skin-analysis':
        return (
          <SkinAnalysis 
            onAnalysisComplete={(skinTone, palette) => {
              setUserProfile(prev => ({ ...prev, skinTone, colorPalette: palette }));
              setCurrentScreen('outfit-selector');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'outfit-selector':
        return (
          <OutfitSelector 
            skinTone={userProfile.skinTone}
            colorPalette={userProfile.colorPalette}
            onOutfitSelected={(outfitType) => {
              setUserProfile(prev => ({ ...prev, selectedOutfitType: outfitType }));
              setCurrentScreen('wardrobe');
            }}
            onBack={() => setCurrentScreen('skin-analysis')}
          />
        );
      case 'wardrobe':
        return (
          <WardrobeManager 
            userProfile={userProfile}
            onProceedToShopping={() => setCurrentScreen('shopping')}
            onBack={() => setCurrentScreen('outfit-selector')}
          />
        );
      case 'shopping':
        return (
          <ShoppingRecommendations 
            userProfile={userProfile}
            onBack={() => setCurrentScreen('wardrobe')}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">FashionAI</h1>
                <p className="text-gray-600">Your personal fashion stylist powered by AI</p>
              </div>

              <Card className="shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Palette className="w-6 h-6 text-purple-600" />
                    Get Started
                  </CardTitle>
                  <CardDescription>
                    Discover your perfect colors and style combinations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setCurrentScreen('skin-analysis')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Analyze Your Skin Tone
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-sm">My Wardrobe</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-sm">Shop Now</h3>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center text-sm text-gray-500 mt-8">
                <p>Take a photo to get personalized fashion recommendations</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
};

export default Index;
