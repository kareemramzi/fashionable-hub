import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Palette, Search, Sparkles } from "lucide-react";

interface EnhancedStyleSelectorProps {
  skinTone: string;
  colorPalette: string[];
  onStyleSelected: (style: string, source: "wardrobe" | "shop", description?: string) => void;
  onBack: () => void;
}

const EnhancedStyleSelector = ({ 
  skinTone, 
  colorPalette, 
  onStyleSelected, 
  onBack 
}: EnhancedStyleSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<"wardrobe" | "shop" | null>(null);
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"style" | "source" | "description">("style");

  const styles = [
    { 
      id: 'casual-chic', 
      name: 'Casual Chic', 
      description: 'Effortlessly stylish for everyday wear',
      emoji: '✨'
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      description: 'Polished and confident for work',
      emoji: '💼'
    },
    { 
      id: 'romantic', 
      name: 'Romantic', 
      description: 'Soft and feminine with delicate touches',
      emoji: '🌸'
    },
    { 
      id: 'edgy-modern', 
      name: 'Edgy Modern', 
      description: 'Bold and contemporary statement pieces',
      emoji: '🖤'
    },
    { 
      id: 'bohemian', 
      name: 'Bohemian', 
      description: 'Free-spirited and artistic vibes',
      emoji: '🌿'
    }
  ];

  const handleStyleSelection = (styleId: string) => {
    setSelectedStyle(styleId);
    setTimeout(() => setStep("source"), 100);
  };

  const handleSourceSelection = (source: "wardrobe" | "shop") => {
    setSelectedSource(source);
    setTimeout(() => setStep("description"), 100);
  };

  const handleSearch = () => {
    if (selectedStyle && selectedSource) {
      onStyleSelected(selectedStyle, selectedSource, description);
    }
  };

  const handleBack = () => {
    if (step === "description") {
      setStep("source");
    } else if (step === "source") {
      setStep("style");
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {step === "style" && "What style are you in the mood for today?"}
            {step === "source" && "Choose Source"}
            {step === "description" && "Describe Your Look"}
          </h1>
        </div>

        {/* Color Palette Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Your Personalized Palette
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

        {/* Style Selection Step */}
        {step === "style" && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid gap-3">
                {styles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover-glow ${
                      selectedStyle === style.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-accent'
                    }`}
                    onClick={() => handleStyleSelection(style.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{style.emoji}</span>
                        <div>
                          <h3 className="font-medium text-foreground">{style.name}</h3>
                          <p className="text-sm text-muted-foreground">{style.description}</p>
                        </div>
                      </div>
                      {selectedStyle === style.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Source Selection Step */}
        {step === "source" && selectedStyle && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Choose Recommendation Source
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-semibold text-foreground">
                  {styles.find(s => s.id === selectedStyle)?.name}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover-glow ${
                    selectedSource === "wardrobe"
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-accent'
                  }`}
                  onClick={() => handleSourceSelection("wardrobe")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">My Wardrobe</h3>
                      <p className="text-sm text-muted-foreground">
                        Get outfit combinations from items you already own
                      </p>
                    </div>
                    {selectedSource === "wardrobe" && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover-glow ${
                    selectedSource === "shop"
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-accent'
                  }`}
                  onClick={() => handleSourceSelection("shop")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Shop Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Discover new items that match your style and colors
                      </p>
                    </div>
                    {selectedSource === "shop" && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description Step */}
        {step === "description" && selectedStyle && selectedSource && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Describe Your Look
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tell us more about what you're looking to wear today...
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., I want something comfortable for a coffee date, maybe a cozy sweater with jeans, or I need a professional outfit for an important meeting..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Style:</span> {styles.find(s => s.id === selectedStyle)?.name}
                  <br />
                  <span className="font-medium text-foreground">Source:</span> {selectedSource === "wardrobe" ? "My Wardrobe" : "Shop Recommendations"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Button */}
        {step === "description" && (
          <div className="pb-6">
            <Button
              onClick={handleSearch}
              disabled={!selectedStyle || !selectedSource}
              className="w-full py-6 text-lg btn-hover bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Outfits
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedStyleSelector;