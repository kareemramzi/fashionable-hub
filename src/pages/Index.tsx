
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Palette, ShoppingBag, User, ShoppingCart, Sparkles, Zap, Heart } from "lucide-react";
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
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-pink-500 border-r-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your style journey...</p>
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
          <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-md mx-auto space-y-6 p-4">
              {/* Header with auth buttons */}
              <div className="flex justify-between items-center py-6">
                <div className="text-center flex-1">
                  <div className="relative inline-block">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 mb-2 animate-pulse">
                      GRWMe
                    </h1>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    ✨ Your AI-Powered Style Revolution ✨
                  </p>
                </div>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCurrentScreen('cart')}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCurrentScreen('profile')}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        <User className="w-5 h-5 text-purple-600" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentScreen('signin')}
                        className="bg-white/20 backdrop-blur-sm border-purple-300 text-purple-700 hover:bg-purple-100 transition-all duration-300 hover:scale-105"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => setCurrentScreen('signup')}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main action card */}
              <Card className="shadow-2xl bg-white/70 backdrop-blur-lg border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <Palette className="w-8 h-8 text-purple-600" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Start Your Glow Up!
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Discover your perfect colors and unleash your style potential
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
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Camera className="w-6 h-6 mr-3" />
                    <Zap className="w-4 h-4 mr-1 animate-bounce" />
                    Analyze Your Glow
                  </Button>
                </CardContent>
              </Card>

              {/* Feature cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-md border border-white/30 group"
                  onClick={() => handleAuthRequired('wardrobe')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-3">
                      <User className="w-10 h-10 mx-auto text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                      <Heart className="w-4 h-4 absolute -top-1 -right-1 text-pink-500 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">My Wardrobe</h3>
                    <p className="text-xs text-gray-600 mt-1">Curate your style</p>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-md border border-white/30 group"
                  onClick={() => handleAuthRequired('shopping')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-3">
                      <ShoppingBag className="w-10 h-10 mx-auto text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                      <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-500 animate-spin" />
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">Shop Trends</h3>
                    <p className="text-xs text-gray-600 mt-1">Find your vibe</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom message */}
              <div className="text-center mt-8">
                <div className="bg-white/40 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg">
                  <p className="text-sm font-medium text-gray-700">
                    {isAuthenticated ? 
                      "🌟 Ready to level up your style game? 🌟" : 
                      "🚀 Join the style revolution - Sign up now! 🚀"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
};

export default Index;
