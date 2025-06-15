
// Skin tone analysis using computer vision techniques
export interface SkinToneResult {
  skinTone: string;
  colorPalette: string[];
  confidence: number;
  dominantColors: string[];
}

// Define skin tone categories with scientific backing
const SKIN_TONE_CATEGORIES = {
  'Fair Cool': {
    description: 'Light skin with pink/blue undertones',
    palette: ['#E8F4F8', '#D1E7DD', '#F3E5F5', '#E1F5FE', '#FFF3E0', '#E8EAF6']
  },
  'Fair Warm': {
    description: 'Light skin with yellow/golden undertones', 
    palette: ['#FFF8E1', '#FFECB3', '#FFE0B2', '#FFCC80', '#FFAB40', '#FF8F00']
  },
  'Fair Neutral': {
    description: 'Light skin with balanced undertones',
    palette: ['#F5F5DC', '#E6E6FA', '#FFF8DC', '#F0F8FF', '#FFFACD', '#F8F8FF']
  },
  'Light Cool': {
    description: 'Light-medium skin with cool undertones',
    palette: ['#E3F2FD', '#F3E5F5', '#E8F5E8', '#FFF3E0', '#FCE4EC', '#F1F8E9']
  },
  'Light Warm': {
    description: 'Light-medium skin with warm undertones',
    palette: ['#FFF3C4', '#FFCC02', '#FF8A65', '#FFAB40', '#FFB74D', '#FF9800']
  },
  'Light Neutral': {
    description: 'Light-medium skin with neutral undertones',
    palette: ['#F5DEB3', '#DDD8C7', '#E6D3A3', '#D2B48C', '#C19A6B', '#A0522D']
  },
  'Medium Cool': {
    description: 'Medium skin with cool undertones',
    palette: ['#90CAF9', '#CE93D8', '#A5D6A7', '#FFCC80', '#F8BBD9', '#DCEDC8']
  },
  'Medium Warm': {
    description: 'Medium skin with warm undertones',
    palette: ['#FFB74D', '#FF8A65', '#FFAB40', '#FF9800', '#FF7043', '#D84315']
  },
  'Medium Neutral': {
    description: 'Medium skin with neutral undertones',
    palette: ['#CD853F', '#D2691E', '#BC8F8F', '#8B4513', '#A0522D', '#8B4513']
  },
  'Deep Cool': {
    description: 'Deep skin with cool undertones',
    palette: ['#1976D2', '#7B1FA2', '#388E3C', '#F57C00', '#C2185B', '#5D4037']
  },
  'Deep Warm': {
    description: 'Deep skin with warm undertones',
    palette: ['#BF360C', '#E65100', '#FF6F00', '#F57F17', '#D84315', '#8D6E63']
  },
  'Deep Neutral': {
    description: 'Deep skin with neutral undertones',
    palette: ['#4A4A4A', '#8B4513', '#654321', '#2F1B14', '#3C241A', '#5D4037']
  }
};

// RGB color space utilities
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = max === 0 ? 0 : diff / max;
  let v = max;

  if (diff !== 0) {
    switch (max) {
      case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / diff + 2) / 6; break;
      case b: h = ((r - g) / diff + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function isSkinLikeColor(r: number, g: number, b: number): boolean {
  // Enhanced skin detection algorithm
  const hsv = rgbToHsv(r, g, b);
  
  // Skin hue range (more inclusive)
  const validHue = (hsv.h >= 0 && hsv.h <= 50) || (hsv.h >= 340 && hsv.h <= 360);
  
  // Saturation and brightness constraints for skin
  const validSaturation = hsv.s >= 10 && hsv.s <= 85;
  const validBrightness = hsv.v >= 20 && hsv.v <= 95;
  
  // Additional RGB-based skin detection
  const rg = r - g;
  const rb = r - b;
  const validRatios = rg > 15 && rb > 15 && r > 95 && g > 40 && b > 20;
  
  return validHue && validSaturation && validBrightness && validRatios;
}

function extractSkinPixels(imageData: ImageData): RGB[] {
  const skinPixels: RGB[] = [];
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Only process opaque pixels
    if (alpha > 200 && isSkinLikeColor(r, g, b)) {
      skinPixels.push({ r, g, b });
    }
  }
  
  return skinPixels;
}

function calculateAverageColor(pixels: RGB[]): RGB {
  if (pixels.length === 0) {
    return { r: 200, g: 180, b: 160 }; // Default fallback
  }
  
  const sum = pixels.reduce(
    (acc, pixel) => ({
      r: acc.r + pixel.r,
      g: acc.g + pixel.g,
      b: acc.b + pixel.b
    }),
    { r: 0, g: 0, b: 0 }
  );
  
  return {
    r: Math.round(sum.r / pixels.length),
    g: Math.round(sum.g / pixels.length),
    b: Math.round(sum.b / pixels.length)
  };
}

function classifySkinTone(avgColor: RGB, skinPixels: RGB[]): { category: string; confidence: number } {
  const { r, g, b } = avgColor;
  const hsv = rgbToHsv(r, g, b);
  
  // Calculate luminance (brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Determine undertone based on color analysis
  let undertone = 'Neutral';
  const yellowish = (r + g) / 2 > b + 10;
  const pinkish = r > g + 5 && r > b + 5;
  const coolish = b > r - 10 && hsv.h > 180 && hsv.h < 300;
  
  if (yellowish && !pinkish) {
    undertone = 'Warm';
  } else if (pinkish || coolish) {
    undertone = 'Cool';
  }
  
  // Determine lightness level
  let lightness = 'Medium';
  if (luminance > 0.7) {
    lightness = 'Fair';
  } else if (luminance > 0.5) {
    lightness = 'Light';
  } else if (luminance < 0.3) {
    lightness = 'Deep';
  }
  
  const category = `${lightness} ${undertone}`;
  
  // Calculate confidence based on sample size and color consistency
  const sampleSize = Math.min(skinPixels.length / 1000, 1);
  const colorVariance = calculateColorVariance(skinPixels);
  const consistency = Math.max(0, 1 - colorVariance / 100);
  const confidence = (sampleSize * 0.6 + consistency * 0.4) * 100;
  
  return { category, confidence: Math.round(confidence) };
}

function calculateColorVariance(pixels: RGB[]): number {
  if (pixels.length < 2) return 0;
  
  const avg = calculateAverageColor(pixels);
  const variance = pixels.reduce((sum, pixel) => {
    const rDiff = pixel.r - avg.r;
    const gDiff = pixel.g - avg.g;
    const bDiff = pixel.b - avg.b;
    return sum + (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }, 0) / pixels.length;
  
  return Math.sqrt(variance);
}

function getDominantColors(pixels: RGB[], count: number = 3): string[] {
  // K-means clustering to find dominant colors
  if (pixels.length === 0) return [];
  
  // Sample pixels for performance
  const sampleSize = Math.min(pixels.length, 1000);
  const sampledPixels = pixels
    .sort(() => Math.random() - 0.5)
    .slice(0, sampleSize);
  
  // Simple clustering by grouping similar colors
  const clusters: RGB[][] = [];
  const threshold = 40;
  
  sampledPixels.forEach(pixel => {
    let addedToCluster = false;
    
    for (const cluster of clusters) {
      const clusterAvg = calculateAverageColor(cluster);
      const distance = Math.sqrt(
        Math.pow(pixel.r - clusterAvg.r, 2) +
        Math.pow(pixel.g - clusterAvg.g, 2) +
        Math.pow(pixel.b - clusterAvg.b, 2)
      );
      
      if (distance < threshold) {
        cluster.push(pixel);
        addedToCluster = true;
        break;
      }
    }
    
    if (!addedToCluster) {
      clusters.push([pixel]);
    }
  });
  
  // Sort clusters by size and get dominant colors
  return clusters
    .sort((a, b) => b.length - a.length)
    .slice(0, count)
    .map(cluster => {
      const avg = calculateAverageColor(cluster);
      return `#${avg.r.toString(16).padStart(2, '0')}${avg.g.toString(16).padStart(2, '0')}${avg.b.toString(16).padStart(2, '0')}`;
    });
}

export async function analyzeSkinTone(imageUrl: string): Promise<SkinToneResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas and get image data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Resize image for processing (performance optimization)
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Extract skin pixels
        const skinPixels = extractSkinPixels(imageData);
        
        if (skinPixels.length < 100) {
          // Fallback for insufficient skin detection
          console.warn('Insufficient skin pixels detected, using fallback analysis');
          resolve({
            skinTone: 'Medium Neutral',
            colorPalette: SKIN_TONE_CATEGORIES['Medium Neutral'].palette,
            confidence: 50,
            dominantColors: ['#D2B48C', '#C19A6B', '#A0522D']
          });
          return;
        }
        
        // Analyze skin tone
        const avgColor = calculateAverageColor(skinPixels);
        const { category, confidence } = classifySkinTone(avgColor, skinPixels);
        const dominantColors = getDominantColors(skinPixels);
        
        // Get color palette for the determined skin tone
        const skinToneData = SKIN_TONE_CATEGORIES[category as keyof typeof SKIN_TONE_CATEGORIES] || 
                           SKIN_TONE_CATEGORIES['Medium Neutral'];
        
        resolve({
          skinTone: category,
          colorPalette: skinToneData.palette,
          confidence,
          dominantColors
        });
        
      } catch (error) {
        console.error('Error analyzing skin tone:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for analysis'));
    };
    
    img.src = imageUrl;
  });
}
