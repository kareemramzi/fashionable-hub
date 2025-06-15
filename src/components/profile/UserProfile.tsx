import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Edit, Save, LogOut, Palette, AlertCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserProfile, saveUserProfile, GenderType } from "@/lib/userProfile";
import GenderSelector from "@/components/GenderSelector";

interface UserProfileProps {
  onBack: () => void;
  onSignOut: () => void;
  onUpdateAnalysis?: () => void;
}

const UserProfile = ({ onBack, onSignOut, onUpdateAnalysis }: UserProfileProps) => {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [skinData, setSkinData] = useState<{
    skin_tone: string;
    color_palette: string[];
    gender?: GenderType;
  } | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingGender, setIsUpdatingGender] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('UserProfile - fetchProfile for user:', user.email, user.id);

      setProfile({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      });

      // Fetch skin analysis data and gender
      const skinAnalysis = await getUserProfile(user.id);
      console.log('UserProfile - skin analysis result:', skinAnalysis);
      
      if (skinAnalysis) {
        setSkinData({
          skin_tone: skinAnalysis.skin_tone || "",
          color_palette: Array.isArray(skinAnalysis.color_palette) 
            ? skinAnalysis.color_palette.filter((item): item is string => typeof item === 'string')
            : [],
          gender: skinAnalysis.gender
        });
        
        if (skinAnalysis.gender && (skinAnalysis.gender === 'male' || skinAnalysis.gender === 'female')) {
          setSelectedGender(skinAnalysis.gender);
        }
      } else {
        console.log('UserProfile - No skin analysis found for user');
        setSkinData(null);
      }
    } catch (error: any) {
      console.error('UserProfile - Error in fetchProfile:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenderSelected = async (gender: 'male' | 'female') => {
    setIsUpdatingGender(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save gender to user profile
      const success = await saveUserProfile(
        user.id, 
        skinData?.skin_tone || "", 
        skinData?.color_palette || [], 
        gender
      );

      if (success) {
        setSelectedGender(gender);
        setSkinData(prev => prev ? { ...prev, gender } : { skin_tone: "", color_palette: [], gender });
        toast({
          title: "Gender updated",
          description: "Your gender preference has been saved",
        });
      } else {
        toast({
          title: "Error updating gender",
          description: "Could not save your gender preference",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating gender",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingGender(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      onSignOut();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        </div>

        {/* Gender Selection Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Gender Preference
            </CardTitle>
            <p className="text-sm text-gray-600">
              Help us personalize your shopping experience
            </p>
          </CardHeader>
          <CardContent>
            {isUpdatingGender ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2">Updating...</span>
              </div>
            ) : (
              <GenderSelector
                onGenderSelected={handleGenderSelected}
                selectedGender={selectedGender}
              />
            )}
          </CardContent>
        </Card>

        {skinData && skinData.skin_tone ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Your Skin Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Skin Tone: <span className="font-semibold">{skinData.skin_tone}</span>
                </p>
                <div className="flex gap-2 mb-4">
                  {skinData.color_palette.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              {onUpdateAnalysis && (
                <Button
                  onClick={onUpdateAnalysis}
                  variant="outline"
                  className="w-full"
                >
                  Update Analysis
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-5 h-5" />
                No Skin Analysis Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You haven't completed a skin tone analysis yet. Complete an analysis to get personalized color recommendations.
              </p>
              {onUpdateAnalysis && (
                <Button
                  onClick={onUpdateAnalysis}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Start Skin Analysis
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              My Profile
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
              disabled={isSaving}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.full_name}
                onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
