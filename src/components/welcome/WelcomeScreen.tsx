import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Palette, Wand2 } from "lucide-react";

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const WelcomeScreen = ({ onSignIn, onSignUp }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/30 rounded-full animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary/20 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-accent/20 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md mx-auto space-y-8 relative z-10">
        {/* Logo/Icon */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Palette className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">StyleWise</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover outfits tailored to your unique style and color palette
          </p>
        </div>

        {/* Features preview */}
        <div className="grid gap-4">
          <Card className="hover-glow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">AI Color Analysis</h3>
                <p className="text-sm text-muted-foreground">Get your personal color palette</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-glow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">Outfits that match your style</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onSignUp}
            className="w-full py-6 text-lg btn-hover bg-primary hover:bg-primary/90"
            size="lg"
          >
            Get Started
          </Button>
          
          <Button 
            onClick={onSignIn}
            variant="outline"
            className="w-full py-6 text-lg btn-hover"
            size="lg"
          >
            Sign In
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Join thousands who found their perfect style
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;