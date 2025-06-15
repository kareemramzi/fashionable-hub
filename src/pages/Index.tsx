
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Palette, ShoppingBag, User, ShoppingCart } from "lucide-react";
import SkinAnalysis from "@/components/SkinAnalysis";
import OutfitSelector from "@/components/OutfitSelector";
import WardrobeManager from "@/components/WardrobeManager";
import ShoppingRecommendations from "@/components/ShoppingRecommendations";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import UserProfile from "@/components/profile/UserProfile";
import ShoppingCartComponent from "@/components/cart/ShoppingCart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AppScreen = 'home' | 'skin-analysis' | 'outfit-selector' | 'wardrobe' | 'shopping' | 'signin' | 'signup' | 'profile' | 'cart';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    skinTone: '',
    colorPalette: [] as string[],
    selectedOutfitType: '',
    wardrobe: [] as any[]
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuthState();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        setCurrentScreen('home');
        setUserProfile({
          skinTone: '',
          colorPalette: [],
          selectedOutfitType: '',
          wardrobe: []
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthRequired = (targetScreen: AppScreen) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access this feature",
      });
      setCurrentScreen('signin');
      return false;
    }
    setCurrentScreen(targetScreen);
    return true;
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'signin':
        return (
          <SignIn 
            onBack={() => setCurrentScreen('home')}
            onSignUpClick={() => setCurrentScreen('signup')}
            onSignInSuccess={() => setCurrentScreen('home')}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onBack={() => setCurrentScreen('home')}
            onSignInClick={() => setCurrentScreen('signin')}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            onBack={() => setCurrentScreen('home')}
            onSignOut={() => {
              setIsAuthenticated(false);
              setCurrentScreen('home');
            }}
          />
        );
      case 'cart':
        return (
          <ShoppingCartComponent 
            onBack={() => setCurrentScreen('home')}
            onCheckout={(items, total) => {
              toast({
                title: "Checkout initiated",
                description: `Total: $${total.toFixed(2)}. Redirecting to payment...`,
              });
              // Here you would implement actual checkout logic
            }}
          />
        );
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
              {/* Header with auth buttons */}
              <div className="flex justify-between items-center py-4">
                <div className="text-center flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">FashionAI</h1>
                  <p className="text-gray-600">Your personal fashion stylist powered by AI</p>
                </div>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCurrentScreen('cart')}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCurrentScreen('profile')}
                      >
                        <User className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentScreen('signin')}
                      className="text-purple-600 border-purple-600"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
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
                    onClick={() => {
                      if (isAuthenticated) {
                        setCurrentScreen('skin-analysis')
                      } else {
                        handleAuthRequired('skin-analysis');
                      }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                    size="lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Analyze Your Skin Tone
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAuthRequired('wardrobe')}
                >
                  <CardContent className="p-4 text-center">
                    <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-sm">My Wardrobe</h3>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAuthRequired('shopping')}
                >
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-sm">Shop Now</h3>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center text-sm text-gray-500 mt-8">
                <p>
                  {isAuthenticated ? 
                    "Welcome back! Ready to discover new styles?" : 
                    "Sign in to save your preferences and wardrobe"
                  }
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
};

export default Index;
