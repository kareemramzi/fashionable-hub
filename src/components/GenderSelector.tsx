
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";

interface GenderSelectorProps {
  onGenderSelected: (gender: 'male' | 'female') => void;
  selectedGender?: 'male' | 'female';
}

const GenderSelector = ({ onGenderSelected, selectedGender }: GenderSelectorProps) => {
  const [selected, setSelected] = useState<'male' | 'female' | null>(selectedGender || null);

  const handleSelection = (gender: 'male' | 'female') => {
    setSelected(gender);
    onGenderSelected(gender);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Select Your Gender
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help us show you products that match your style preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={selected === 'female' ? "default" : "outline"}
            className={`h-24 flex flex-col items-center gap-2 ${
              selected === 'female' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'hover:bg-purple-50'
            }`}
            onClick={() => handleSelection('female')}
          >
            <User className="w-8 h-8" />
            <span>Female</span>
          </Button>
          <Button
            variant={selected === 'male' ? "default" : "outline"}
            className={`h-24 flex flex-col items-center gap-2 ${
              selected === 'male' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'hover:bg-purple-50'
            }`}
            onClick={() => handleSelection('male')}
          >
            <User className="w-8 h-8" />
            <span>Male</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderSelector;
