
// Color matching utility with advanced color theory
export interface ColorHSL {
  h: number; // hue (0-360)
  s: number; // saturation (0-100)
  l: number; // lightness (0-100)
}

export interface OutfitCombination {
  id: string;
  items: any[];
  matchScore: number;
  colorHarmony: string;
  occasion: string;
  styleDescription: string;
}

// Convert hex color to HSL
export const hexToHsl = (hex: string): ColorHSL => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Calculate color harmony score based on color theory
export const calculateColorHarmony = (color1: string, color2: string): { score: number; harmony: string } => {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);
  
  const hueDiff = Math.abs(hsl1.h - hsl2.h);
  const satDiff = Math.abs(hsl1.s - hsl2.s);
  const lightDiff = Math.abs(hsl1.l - hsl2.l);

  // Complementary colors (opposite on color wheel)
  if (hueDiff >= 150 && hueDiff <= 210) {
    return { score: 95, harmony: 'Complementary' };
  }
  
  // Analogous colors (adjacent on color wheel)
  if (hueDiff <= 30) {
    return { score: 88, harmony: 'Analogous' };
  }
  
  // Triadic colors (120 degrees apart)
  if ((hueDiff >= 100 && hueDiff <= 140) || (hueDiff >= 220 && hueDiff <= 260)) {
    return { score: 85, harmony: 'Triadic' };
  }
  
  // Monochromatic (same hue, different saturation/lightness)
  if (hueDiff <= 15 && (satDiff > 20 || lightDiff > 20)) {
    return { score: 82, harmony: 'Monochromatic' };
  }
  
  // Split complementary
  if ((hueDiff >= 120 && hueDiff <= 180) || (hueDiff >= 180 && hueDiff <= 240)) {
    return { score: 78, harmony: 'Split Complementary' };
  }
  
  // Neutral combinations
  if (hsl1.s <= 20 || hsl2.s <= 20) {
    return { score: 75, harmony: 'Neutral' };
  }
  
  return { score: 60, harmony: 'Custom' };
};

// Advanced product matching based on user's color palette
export const calculateAdvancedProductMatch = (
  product: any, 
  userPalette: string[], 
  occasion: string = 'casual'
): number => {
  let baseScore = 50;

  // Color matching with user's palette
  let bestColorMatch = 0;
  let bestHarmony = '';
  
  for (const paletteColor of userPalette) {
    const colorMatch = calculateColorHarmony(product.color, paletteColor);
    if (colorMatch.score > bestColorMatch) {
      bestColorMatch = colorMatch.score;
      bestHarmony = colorMatch.harmony;
    }
  }
  
  baseScore += (bestColorMatch - 50) * 0.4; // 40% weight for color matching

  // Occasion appropriateness
  const occasionBonus = getOccasionBonus(product.category, occasion);
  baseScore += occasionBonus;

  // Product quality factors
  if (product.rating && product.rating > 4.0) {
    baseScore += (product.rating - 4.0) * 10; // Up to 10 points for rating
  }

  // Brand reputation (simplified)
  const premiumBrands = ['zara', 'h&m', 'mango', 'nike', 'adidas'];
  if (premiumBrands.some(brand => product.brand.toLowerCase().includes(brand))) {
    baseScore += 5;
  }

  // Price reasonableness (not too expensive, not too cheap)
  if (product.price >= 50 && product.price <= 500) {
    baseScore += 3;
  }

  // Stock availability
  if (product.stock_quantity && product.stock_quantity > 5) {
    baseScore += 2;
  }

  return Math.min(Math.round(baseScore), 98);
};

// Get bonus points based on occasion appropriateness
const getOccasionBonus = (category: string, occasion: string): number => {
  const occasionMap: Record<string, Record<string, number>> = {
    formal: {
      'dresses': 15,
      'tops': 12,
      'bottoms': 12,
      'outerwear': 10,
      'shoes': 8
    },
    casual: {
      'tops': 15,
      'bottoms': 12,
      'dresses': 10,
      'outerwear': 8,
      'shoes': 10
    },
    party: {
      'dresses': 18,
      'tops': 12,
      'shoes': 15,
      'outerwear': 8,
      'bottoms': 10
    },
    business: {
      'tops': 15,
      'bottoms': 15,
      'outerwear': 12,
      'dresses': 10,
      'shoes': 8
    },
    workout: {
      'tops': 18,
      'bottoms': 18,
      'shoes': 15,
      'outerwear': 10,
      'dresses': 2
    }
  };

  return occasionMap[occasion]?.[category] || 5;
};

// Generate outfit combinations from available products
export const generateOutfitCombinations = (
  products: any[],
  userPalette: string[],
  occasion: string = 'casual',
  maxCombinations: number = 6
): OutfitCombination[] => {
  const tops = products.filter(p => p.category === 'tops');
  const bottoms = products.filter(p => p.category === 'bottoms');
  const dresses = products.filter(p => p.category === 'dresses');
  const shoes = products.filter(p => p.category === 'shoes');
  const outerwear = products.filter(p => p.category === 'outerwear');

  const combinations: OutfitCombination[] = [];

  // Generate top + bottom + shoes combinations
  for (let i = 0; i < Math.min(tops.length, 3); i++) {
    for (let j = 0; j < Math.min(bottoms.length, 3); j++) {
      for (let k = 0; k < Math.min(shoes.length, 2); k++) {
        const items = [tops[i], bottoms[j], shoes[k]];
        
        // Add outerwear for formal occasions or randomly
        if (outerwear.length > 0 && (occasion === 'formal' || occasion === 'business' || Math.random() > 0.6)) {
          items.push(outerwear[0]);
        }

        const matchScore = calculateOutfitMatchScore(items, userPalette, occasion);
        const colorHarmony = getOutfitColorHarmony(items);

        combinations.push({
          id: `combo-${i}-${j}-${k}`,
          items,
          matchScore,
          colorHarmony,
          occasion,
          styleDescription: generateStyleDescription(items, occasion)
        });
      }
    }
  }

  // Generate dress + shoes combinations
  for (let i = 0; i < Math.min(dresses.length, 2); i++) {
    for (let j = 0; j < Math.min(shoes.length, 2); j++) {
      const items = [dresses[i], shoes[j]];
      
      // Add outerwear occasionally
      if (outerwear.length > 0 && Math.random() > 0.7) {
        items.push(outerwear[0]);
      }

      const matchScore = calculateOutfitMatchScore(items, userPalette, occasion);
      const colorHarmony = getOutfitColorHarmony(items);

      combinations.push({
        id: `dress-combo-${i}-${j}`,
        items,
        matchScore,
        colorHarmony,
        occasion,
        styleDescription: generateStyleDescription(items, occasion)
      });
    }
  }

  // Sort by match score and return top combinations
  return combinations
    .filter(combo => combo.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxCombinations);
};

// Calculate overall outfit match score
const calculateOutfitMatchScore = (items: any[], userPalette: string[], occasion: string): number => {
  let totalScore = 0;
  let colorHarmonyBonus = 0;

  // Individual item scores
  items.forEach(item => {
    totalScore += calculateAdvancedProductMatch(item, userPalette, occasion);
  });

  // Color harmony between items
  for (let i = 0; i < items.length - 1; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const harmony = calculateColorHarmony(items[i].color, items[j].color);
      colorHarmonyBonus += harmony.score * 0.1;
    }
  }

  const averageScore = totalScore / items.length;
  const finalScore = averageScore + colorHarmonyBonus;

  return Math.min(Math.round(finalScore), 98);
};

// Determine the overall color harmony of an outfit
const getOutfitColorHarmony = (items: any[]): string => {
  const harmonies: string[] = [];
  
  for (let i = 0; i < items.length - 1; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const harmony = calculateColorHarmony(items[i].color, items[j].color);
      harmonies.push(harmony.harmony);
    }
  }

  // Return the most common harmony type
  const harmonyCount = harmonies.reduce((acc, harmony) => {
    acc[harmony] = (acc[harmony] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(harmonyCount).reduce((a, b) => 
    harmonyCount[a] > harmonyCount[b] ? a : b
  ) || 'Mixed';
};

// Generate style description for outfit
const generateStyleDescription = (items: any[], occasion: string): string => {
  const descriptions = {
    formal: ['Professional elegance', 'Sophisticated charm', 'Executive style', 'Polished look'],
    casual: ['Effortless chic', 'Relaxed comfort', 'Everyday elegance', 'Casual sophistication'],
    party: ['Glamorous night out', 'Party ready', 'Evening elegance', 'Festive style'],
    business: ['Business professional', 'Office appropriate', 'Corporate chic', 'Work ready'],
    workout: ['Athletic performance', 'Gym ready', 'Active lifestyle', 'Sport chic']
  };

  const occasionDescriptions = descriptions[occasion as keyof typeof descriptions] || descriptions.casual;
  return occasionDescriptions[Math.floor(Math.random() * occasionDescriptions.length)];
};
