
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
      const { data, error } = await supabase
        .from('user_profiles' as any)
        .select('skin_tone, color_palette')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data && data.skin_tone && data.color_palette) {
        setSkinData({
          skinTone: data.skin_tone,
          palette: data.color_palette
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const handleAnalysisComplete = async (skinTone: string, palette: string[]) => {
    setSkinData({ skinTone, palette });
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles' as any)
          .upsert({
            user_id: user.id,
            skin_tone: skinTone,
            color_palette: palette,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving skin analysis:', error);
          toast({
            title: "Warning",
            description: "Your analysis was completed but couldn't be saved for next time.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Analysis Saved! ✨",
            description: "Your skin tone analysis has been saved to your profile.",
          });
        }
      } catch (error) {
        console.error('Error in handleAnalysisComplete:', error);
      }
    }
    
    setCurrentView("recommendations");
  };

  const handleCheckout = (items: any[], total: number) => {
    toast({
      title: "Checkout",
      description: `Processing ${items.length} items for $${total.toFixed(2)}`,
    });
  };

  const handleSignOut = () => {
    setSkinData(null);
    setCurrentView("home");
  };

  if (!session) {
    return showSignUp ? (
      <SignUp 
        onSwitchToSignIn={() => setShowSignUp(false)} 
      />
    ) : (
      <SignIn 
        onSwitchToSignUp={() => setShowSignUp(true)} 
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
            skinTone={skinData?.skinTone || ""}
            colorPalette={skinData?.palette || []}
            onBack={() => setCurrentView("home")}
            onFavorites={() => setCurrentView("favorites")}
            onCart={() => setCurrentView("cart")}
            onProfile={() => setCurrentView("profile")}
          />
        );
      case "outfitSelector":
        return (
          <OutfitSelector
            skinTone={skinData?.skinTone || ""}
            colorPalette={skinData?.palette || []}
            onOutfitSelected={(outfitType: string) => setCurrentView("wardrobeManager")}
            onBack={() => setCurrentView("home")}
          />
        );
      case "wardrobeManager":
        return (
          <WardrobeManager
            userProfile={{
              skinTone: skinData?.skinTone || "",
              colorPalette: skinData?.palette || [],
              selectedOutfitType: "casual",
              wardrobe: []
            }}
            onProceedToShopping={() => setCurrentView("recommendations")}
            onBack={() => setCurrentView("home")}
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
                <div
                  onClick={() => skinData ? setCurrentView("recommendations") : setCurrentView("skinAnalysis")}
                  className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-purple-800 mb-2">
                    {skinData ? "🎨 Your Color Palette" : "✨ Discover Your Glow"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {skinData 
                      ? `${skinData.skinTone} tone with personalized colors` 
                      : "AI-powered skin tone analysis for perfect color matching"
                    }
                  </p>
                  {skinData && (
                    <div className="flex gap-2 mb-4">
                      {skinData.palette.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

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
