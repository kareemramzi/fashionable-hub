
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SkinAnalysis from "@/components/SkinAnalysis";
import OutfitSelector from "@/components/OutfitSelector";
import EnhancedStyleSelector from "@/components/style/EnhancedStyleSelector";
import OutfitRecommendations from "@/components/OutfitRecommendations";
import ShoppingRecommendations from "@/components/ShoppingRecommendations";
import WardrobeManager from "@/components/WardrobeManager";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import FavoritesList from "@/components/FavoritesList";
import ShoppingCart from "@/components/cart/ShoppingCart";
import UserProfile from "@/components/profile/UserProfile";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";
import { Session, User } from "@supabase/supabase-js";
import { getUserProfile, saveUserProfile } from "@/lib/userProfile";
import { getUserRole } from "@/lib/products";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);
  const [skinData, setSkinData] = useState<{skinTone: string; palette: string[]} | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<"wardrobe" | "shop" | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [guestSkinData, setGuestSkinData] = useState<{skinTone: string; palette: string[]} | null>(null);
  const [userHasSavedAnalysis, setUserHasSavedAnalysis] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const { toast } = useToast();

  // Function to handle view changes and track navigation history
  const changeView = (newView: string) => {
    if (newView !== currentView) {
      console.log('Index - Changing view from', currentView, 'to', newView);
      setNavigationHistory(prev => [...prev, newView]);
      setCurrentView(newView);
    }
  };

  // Function to go back through navigation history
  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1]; // Get the previous view
      
      setNavigationHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  // Function to reset navigation history (used for sign out and special cases)
  const resetNavigationHistory = (initialView: string = "home") => {
    setNavigationHistory([initialView]);
    setCurrentView(initialView);
  };

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
          setIsAdminPortal(false);
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
      console.log('Index - fetchUserProfile called for user:', userId);
      
      const [profileData, role] = await Promise.all([
        getUserProfile(userId),
        getUserRole(userId)
      ]);
      
      console.log('Index - fetchUserProfile results:', { profileData, role });
      
      setUserRole(role);
      
      // Set admin portal mode if user is admin
      if (role === 'admin') {
        setIsAdminPortal(true);
        resetNavigationHistory("admin");
      } else {
        setIsAdminPortal(false);
      }
      
      if (profileData && profileData.skin_tone) {
        console.log('Index - Setting skin data from profile:', profileData);
        setSkinData({
          skinTone: profileData.skin_tone,
          palette: Array.isArray(profileData.color_palette) 
            ? profileData.color_palette.filter((item): item is string => typeof item === 'string')
            : []
        });
        setUserHasSavedAnalysis(true);
      } else {
        console.log('Index - No skin analysis data found in profile');
        setUserHasSavedAnalysis(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const handleAnalysisComplete = async (skinTone: string, palette: string[]) => {
    const analysisData = { skinTone, palette };
    
    console.log('Index - handleAnalysisComplete called:', { skinTone, palette, user: user?.email });
    
    if (user) {
      // User is authenticated - save to database
      try {
        console.log('Index - Saving user profile for authenticated user:', user.id, user.email);
        const success = await saveUserProfile(user.id, skinTone, palette);
        
        if (success) {
          console.log('Index - Profile saved successfully, updating local state');
          setSkinData(analysisData);
          setUserHasSavedAnalysis(true);
          
          // Refresh the user profile data
          await fetchUserProfile(user.id);
          
          toast({
            title: "Analysis Saved! ✨",
            description: "Your skin tone analysis has been saved to your profile.",
          });
        } else {
          // Still set the data locally even if save failed
          console.log('Index - Profile save failed, setting local data only');
          setSkinData(analysisData);
          console.error('Failed to save user profile');
          toast({
            title: "Analysis Complete! ✨", 
            description: "Your skin tone analysis is ready. Please try again to save it to your profile.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in handleAnalysisComplete:', error);
        // Still set the data locally even if save failed
        setSkinData(analysisData);
        toast({
          title: "Analysis Complete! ✨",
          description: "Your skin tone analysis is ready. There was an error saving to your profile.",
          variant: "destructive",
        });
      }
    } else {
      // Guest user - save temporarily
      console.log('Index - Guest user analysis completed');
      setGuestSkinData(analysisData);
      setSkinData(analysisData);
      
      toast({
        title: "Analysis Complete! ✨",
        description: "Sign up to save your results and get personalized recommendations.",
      });
    }
    
    changeView("styleSelector");
  };

  const handleStyleSelected = (occasion: string, source: "wardrobe" | "shop") => {
    console.log('Index - handleStyleSelected called with:', occasion, source);
    console.log('Index - Current selectedStyle before update:', selectedStyle);
    setSelectedStyle(occasion);
    setSelectedSource(source);
    console.log('Index - Updated selectedStyle to:', occasion, 'and source to:', source);
    console.log('Index - About to navigate to outfitRecommendations');
    
    // Force a small delay to ensure state is updated
    setTimeout(() => {
      console.log('Index - Actually navigating to outfitRecommendations with style:', occasion, 'source:', source);
      changeView("outfitRecommendations");
    }, 100);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
  };

  const handleSignIn = () => {
    setShowSignUp(false);
  };

  const handleSuccessfulAuth = () => {
    resetNavigationHistory("home");
    setShowSignUp(false);
    
    // If guest had analysis data, save it for the new user
    if (guestSkinData && user) {
      saveUserProfile(user.id, guestSkinData.skinTone, guestSkinData.palette);
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
    setSelectedStyle(null);
    setIsAdminPortal(false);
    resetNavigationHistory("home");
  };

  const handleUpdateAnalysis = async () => {
    // Clear current analysis and navigate to skin analysis
    setSkinData(null);
    setUserHasSavedAnalysis(false);
    changeView("skinAnalysis");
  };

  const handleProfileNavigation = () => {
    if (!user) {
      setShowSignUp(false); // Show sign-in form
    } else {
      changeView("profile");
    }
  };

  // For guests or users without saved analysis
  const shouldShowAnalysisOption = !user || !userHasSavedAnalysis;
  
  // Current skin data (either user's saved data or guest data)
  const currentSkinData = skinData || guestSkinData;

  // If not authenticated, show auth screens
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

  // If user is admin, show admin portal only
  if (isAdminPortal && userRole === 'admin') {
    return (
      <div className="relative min-h-screen">
        <AdminDashboard
          onBack={() => {
            // Admin can sign out from the dashboard
            supabase.auth.signOut();
          }}
          onFavorites={() => {}} // Disabled for admin
          onCart={() => {}} // Disabled for admin
          onProfile={() => changeView("profile")}
        />
      </div>
    );
  }

  const handleAddToCart = (item: any) => {
    toast({
      title: "Added to Cart! 🛒",
      description: `${item.name} has been added to your cart`,
    });
  };

  const handleAddToFavorites = (item: any) => {
    toast({
      title: "Added to Favorites! ❤️",
      description: `${item.name} has been added to your favorites`,
    });
  };

  const renderCurrentView = () => {
    console.log('Index - renderCurrentView - Current view:', currentView);
    console.log('Index - renderCurrentView - Selected style:', selectedStyle);
    console.log('Index - renderCurrentView - Selected source:', selectedSource);
    console.log('Index - renderCurrentView - Current skin data:', currentSkinData);
    
    switch (currentView) {
      case "skinAnalysis":
        return (
          <SkinAnalysis
            onAnalysisComplete={handleAnalysisComplete}
            onBack={goBack}
            onFavorites={() => changeView("favorites")}
            onCart={() => changeView("cart")}
            onProfile={handleProfileNavigation}
          />
        );
      case "styleSelector":
        console.log('Index - Rendering styleSelector with skin data:', currentSkinData);
        return (
          <EnhancedStyleSelector
            skinTone={currentSkinData?.skinTone || ""}
            colorPalette={currentSkinData?.palette || []}
            onStyleSelected={handleStyleSelected}
            onBack={goBack}
          />
        );
      case "outfitRecommendations":
        console.log('Index - Rendering outfitRecommendations with style:', selectedStyle, 'source:', selectedSource);
        console.log('Index - Current skin data for recommendations:', currentSkinData);
        if (!selectedStyle || !selectedSource || !currentSkinData) {
          console.log('Index - Missing data - selectedStyle:', selectedStyle, 'selectedSource:', selectedSource, 'currentSkinData:', currentSkinData);
          console.log('Index - Redirecting back to styleSelector');
          changeView("styleSelector");
          return null;
        }
        console.log('Index - All data available, rendering OutfitRecommendations');
        return (
          <OutfitRecommendations
            occasion={selectedStyle}
            skinTone={currentSkinData.skinTone}
            colorPalette={currentSkinData.palette}
            recommendationSource={selectedSource}
            onBack={goBack}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            onShopNow={() => changeView("recommendations")}
          />
        );
      case "recommendations":
        return (
          <ShoppingRecommendations
            skinTone={currentSkinData?.skinTone || ""}
            colorPalette={currentSkinData?.palette || []}
            onBack={goBack}
            onFavorites={() => changeView("favorites")}
            onCart={() => changeView("cart")}
            onProfile={handleProfileNavigation}
          />
        );
      case "outfitSelector":
        return (
          <OutfitSelector
            skinTone={currentSkinData?.skinTone || ""}
            colorPalette={currentSkinData?.palette || []}
            onOutfitSelected={(outfitType: string) => changeView("wardrobeManager")}
            onBack={goBack}
            onFavorites={() => changeView("favorites")}
            onProfile={handleProfileNavigation}
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
            onProceedToShopping={() => changeView("recommendations")}
            onBack={goBack}
            onProfile={handleProfileNavigation}
          />
        );
      case "favorites":
        return (
          <FavoritesList
            onBack={goBack}
            onCart={() => changeView("cart")}
            onProfile={handleProfileNavigation}
            onShopping={() => changeView("recommendations")}
          />
        );
      case "cart":
        return (
          <ShoppingCart
            onBack={goBack}
            onCheckout={handleCheckout}
            onFavorites={() => changeView("favorites")}
            onProfile={handleProfileNavigation}
            onShopping={() => changeView("recommendations")}
          />
        );
      case "profile":
        return (
          <UserProfile
            onBack={goBack}
            onSignOut={handleSignOut}
            onUpdateAnalysis={handleUpdateAnalysis}
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
                    onClick={() => currentSkinData ? changeView("styleSelector") : changeView("skinAnalysis")}
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
                        onClick={() => changeView("styleSelector")}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Get Recommendations
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
                  onClick={() => changeView("outfitSelector")}
                  className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-purple-800 mb-2">👗 Style Assistant</h2>
                  <p className="text-gray-600">Get outfit recommendations based on your colors</p>
                </div>

                <div
                  onClick={() => changeView("wardrobeManager")}
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

  // Regular user interface with bottom navigation
  return (
    <div className="relative min-h-screen">
      {renderCurrentView()}
      <BottomNavBar
        currentPage={currentView}
        onHome={() => changeView("home")}
        onFavorites={() => changeView("favorites")}
        onCart={() => changeView("cart")}
        onProfile={handleProfileNavigation}
        onShopping={() => changeView("recommendations")}
      />
    </div>
  );
};

export default Index;
