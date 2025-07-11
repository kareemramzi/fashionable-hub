import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ShoppingBag, Palette } from "lucide-react";

interface InitialActionChoiceProps {
  onUploadWardrobe: () => void;
  onDiscoverOutfits: () => void;
  colorPalette?: string[];
  skinTone?: string;
}

const InitialActionChoice = ({ 
  onUploadWardrobe, 
  onDiscoverOutfits, 
  colorPalette,
  skinTone 
}: InitialActionChoiceProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">What would you like to do?</h1>
          <p className="text-muted-foreground">
            Choose how you'd like to start your style journey
          </p>
        </div>

        {/* Color palette display if available */}
        {colorPalette && skinTone && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5 text-primary" />
                Your Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Skin Tone: <span className="font-semibold text-foreground">{skinTone}</span>
                </p>
                <div className="flex gap-2">
                  {colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action choices */}
        <div className="space-y-4">
          <Card className="hover-glow cursor-pointer transition-all" onClick={onUploadWardrobe}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Upload Wardrobe</h3>
                  <p className="text-sm text-muted-foreground">
                    Add items you already own and get outfit combinations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-glow cursor-pointer transition-all" onClick={onDiscoverOutfits}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Discover Outfits</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse curated outfits that match your color palette
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onUploadWardrobe}
            variant="outline"
            className="py-4 btn-hover"
          >
            <Upload className="w-4 h-4 mr-2" />
            My Wardrobe
          </Button>
          
          <Button
            onClick={onDiscoverOutfits}
            className="py-4 btn-hover bg-primary hover:bg-primary/90"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Discover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitialActionChoice;