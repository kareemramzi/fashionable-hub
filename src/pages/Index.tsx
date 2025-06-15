import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SkinAnalysis from "@/components/SkinAnalysis";
import OutfitSelector from "@/components/OutfitSelector";
import ShoppingRecommendations from "@/components/ShoppingRecommendations";
import WardrobeManager from "@/components/WardrobeManager";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import FavoritesList from "@/components/FavoritesList";
import ShoppingCart from "@/components/cart/ShoppingCart";
import UserProfile from "@/components/profile/UserProfile";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import { Session, User } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [skinData, setSkinData] = useState<{skinTone: string; palette: string[]} | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [guestSkinData, setGuestSkinData] = useState<{skinTone: string; palette: string[]} | null>(null);
  const [userHasSavedAnalysis, setUserHasSavedAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          // User logged out, clear their saved data but keep guest data
          setSkinData(null);
          setUserHasSavedAnalysis(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // For now, we'll simulate checking if user has saved analysis
      // This will be replaced with actual database query later
      console.log('Checking if user has saved skin analysis:', userId);
      
      // Simulate user has saved analysis (this will be from database later)
      const localStorageKey = `skinAnalysis_${userId}`;
      const savedData = localStorage.getItem(localStorageKey);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSkinData(parsedData);
        setUserHasSavedAnalysis(true);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const handleAnalysisComplete = async (skinTone: string, palette: string[]) => {
    const analysisData = { skinTone, palette };
    
    if (user) {
      // User is authenticated - save to their profile
      try {
        // For now, save to localStorage with user ID
        const localStorageKey = `skinAnalysis_${user.id}`;
        localStorage.setItem(localStorageKey, JSON.stringify(analysisData));
        
        setSkinData(analysisData);
        setUserHasSavedAnalysis(true);
        
        toast({
          title: "Analysis Saved! ✨",
          description: "Your skin tone analysis has been saved to your profile.",
        });
      } catch (error) {
        console.error('Error in handleAnalysisComplete:', error);
        setSkinData(analysisData);
        toast({
          title: "Analysis Complete! ✨",
          description: "Your skin tone analysis is ready.",
        });
      }
    } else {
      // Guest user - save temporarily
      setGuestSkinData(analysisData);
      setSkinData(analysisData);
      
      toast({
        title: "Analysis Complete! ✨",
        description: "Sign up to save your results and get personalized recommendations.",
      });
    }
    
    setCurrentView("recommendations");
  };

  const handleSignUp = () => {
    // If guest has analysis data, we'll prompt them to save it after signup
    setShowSignUp(true);
  };

  const handleSignIn = () => {
    setShowSignUp(false);
  };

  const handleSuccessfulAuth = () => {
    setCurrentView("home");
    setShowSignUp(false);
    
    // If guest had analysis data, save it for the new user
    if (guestSkinData && user) {
      const localStorageKey = `skinAnalysis_${user.id}`;
      localStorage.setItem(localStorageKey, JSON.stringify(guestSkinData));
      setSkinData(guestSkinData);
      setUserHasSavedAnalysis(true);
      setGuestSkinData(null);
      
      toast({
        title: "Welcome to GRWMe! ✨",
        description: "Your skin analysis has been saved to your profile.",
      });
    }
  };

  const handleCheckout = (items: any[], total: number) => {
    toast({
      title: "Checkout",
      description: `Processing ${items.length} items for $${total.toFixed(2)}`,
    });
  };

  const handleSignOut = () => {
    setSkinData(null);
    setUserHasSavedAnalysis(false);
    setGuestSkinData(null);
    setCurrentView("home");
  };

  const handleUpdateAnalysis = () => {
    setCurrentView("skinAnalysis");
  };

  // For guests or users without saved analysis
  const shouldShowAnalysisOption = !user || !userHasSavedAnalysis;
  
  // Current skin data (either user's saved data or guest data)
  const currentSkinData = skinData || guestSkinData;

  if (!session) {
    return showSignUp ? (
      <SignUp 
        onBack={() => setShowSignUp(false)}
        onSignInClick={handleSignIn}
      />
    ) : (
      <SignIn 
        onBack={() => setShowSignUp(false)}
        onSignUpClick={handleSignUp}
        onSignInSuccess={handleSuccessfulAuth}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "skinAnalysis":
        return (
          <SkinAnalysis
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setCurrentView("home")}
            onFavorites={() => setCurrentView("favorites")}
            onCart={() => setCurrentView("cart")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "recommendations":
        return (
          <ShoppingRecommendations
            skinTone={currentSkinData?.skinTone || ""}
            colorPalette={currentSkinData?.palette || []}
            onBack={() => setCurrentView("home")}
            onFavorites={() => setCurrentView("favorites")}
            onCart={() => setCurrentView("cart")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "outfitSelector":
        return (
          <OutfitSelector
            skinTone={currentSkinData?.skinTone || ""}
            colorPalette={currentSkinData?.palette || []}
            onOutfitSelected={(outfitType: string) => setCurrentView("wardrobeManager")}
            onBack={() => setCurrentView("home")}
            onFavorites={() => setCurrentView("favorites")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "wardrobeManager":
        return (
          <WardrobeManager
            userProfile={{
              skinTone: currentSkinData?.skinTone || "",
              colorPalette: currentSkinData?.palette || [],
              selectedOutfitType: "casual",
              wardrobe: []
            }}
            onProceedToShopping={() => setCurrentView("recommendations")}
            onBack={() => setCurrentView("home")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "favorites":
        return (
          <FavoritesList
            onBack={() => setCurrentView("home")}
            onCart={() => setCurrentView("cart")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "cart":
        return (
          <ShoppingCart
            onBack={() => setCurrentView("home")}
            onCheckout={handleCheckout}
            onFavorites={() => setCurrentView("favorites")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "profile":
        return (
          <UserProfile
            onBack={() => setCurrentView("home")}
            onSignOut={handleSignOut}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
            <div className="max-w-md mx-auto p-4 space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  GRWMe
                </h1>
                <p className="text-gray-600">Discover your perfect colors & style</p>
              </div>

              <div className="grid gap-4">
                {shouldShowAnalysisOption ? (
                  <div
                    onClick={() => currentSkinData ? setCurrentView("recommendations") : setCurrentView("skinAnalysis")}
                    className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    <h2 className="text-xl font-bold text-purple-800 mb-2">
                      {currentSkinData ? "🎨 Your Color Palette" : "✨ Discover Your Glow"}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {currentSkinData 
                        ? `${currentSkinData.skinTone} tone with personalized colors` 
                        : "AI-powered skin tone analysis for perfect color matching"
                      }
                    </p>
                    {currentSkinData && (
                      <div className="flex gap-2 mb-4">
                        {currentSkinData.palette.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                    {!user && currentSkinData && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">
                          💡 Sign up to save your analysis and get personalized shopping recommendations!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30">
                    <h2 className="text-xl font-bold text-purple-800 mb-2">🎨 Your Saved Analysis</h2>
                    <p className="text-gray-600 mb-4">
                      {currentSkinData?.skinTone} tone with your personalized palette
                    </p>
                    {currentSkinData && (
                      <div className="flex gap-2 mb-4">
                        {currentSkinData.palette.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentView("recommendations")}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Recommendations
                      </button>
                      <button
                        onClick={handleUpdateAnalysis}
                        className="bg-purple-100 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        Update Analysis
                      </button>
                    </div>
                  </div>
                )}

                <div
                  onClick={() => setCurrentView("outfitSelector")}
                  className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-purple-800 mb-2">👗 Style Assistant</h2>
                  <p className="text-gray-600">Get outfit recommendations based on your colors</p>
                </div>

                <div
                  onClick={() => setCurrentView("wardrobeManager")}
                  className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-purple-800 mb-2">👚 My Wardrobe</h2>
                  <p className="text-gray-600">Organize and manage your clothing collection</p>
                </div>

                {!user && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-2">🌟 Ready to save your style?</h3>
                    <p className="text-purple-700 text-sm mb-3">
                      Create an account to save your analysis, build your wardrobe, and get personalized recommendations.
                    </p>
                    <button
                      onClick={handleSignUp}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Sign Up Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderCurrentView()}
      <BottomNavBar
        currentPage={currentView}
        onHome={() => setCurrentView("home")}
        onFavorites={() => setCurrentView("favorites")}
        onCart={() => setCurrentView("cart")}
        onProfile={() => setCurrentView("profile")}
        onShopping={() => setCurrentView("recommendations")}
      />
    </div>
  );
};

export default Index;
