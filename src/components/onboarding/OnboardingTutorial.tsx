import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Palette, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Camera,
      title: "Upload Your Photo",
      description: "Take a clear photo of your face with good lighting and a neutral background. This helps our AI analyze your unique features.",
      tips: [
        "Face clearly visible",
        "Natural lighting preferred", 
        "Neutral background",
        "No heavy makeup or filters"
      ]
    },
    {
      icon: Palette,
      title: "Get Your Color Palette",
      description: "Our AI analyzes your skin tone, eye color, and hair to create a personalized color palette that enhances your natural beauty.",
      tips: [
        "Skin tone analysis",
        "Eye color detection",
        "Hair tone matching",
        "Seasonal color palette"
      ]
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description: "Choose to get outfit suggestions from our curated collection or mix and match items from your own wardrobe.",
      tips: [
        "Shop recommendations",
        "Wardrobe combinations", 
        "Style-based filtering",
        "Color-matched outfits"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto space-y-8">
        {/* Progress indicators */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-primary'
                  : index < currentStep
                  ? 'bg-accent'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="space-y-3">
              {currentStepData.tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 py-4 btn-hover"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className={`py-4 btn-hover bg-primary hover:bg-primary/90 ${
              currentStep === 0 ? 'flex-1' : 'flex-1'
            }`}
          >
            {currentStep === steps.length - 1 ? (
              "Let's Start!"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;