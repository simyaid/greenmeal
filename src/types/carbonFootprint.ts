export interface CarbonFootprintData {
    ingredient: string;
    carbonFootprint: number; // in kg CO2e per kg
    source: string;
    lastUpdated: Date;
  }
  
  export interface CarbonFootprintCalculation {
    total: number; // in kg CO2e
    breakdown: {
      ingredient: string;
      amount: number;
      unit: string;
      carbonFootprint: number;
    }[];
  }
  
  export const DEFAULT_CARBON_FOOTPRINTS: Record<string, number> = {
    // Meat and Fish
    'beef': 60.0,
    'lamb': 24.0,
    'pork': 7.0,
    'chicken': 6.0,
    'fish': 3.0,
    
    // Dairy
    'milk': 1.0,
    'cheese': 21.0,
    'butter': 12.0,
    'yogurt': 1.2,
    
    // Grains and Legumes
    'rice': 2.7,
    'wheat': 1.4,
    'beans': 2.0,
    'lentils': 0.9,
    
    // Vegetables
    'potatoes': 0.2,
    'tomatoes': 1.4,
    'onions': 0.4,
    'carrots': 0.4,
    
    // Fruits
    'apples': 0.4,
    'bananas': 0.7,
    'oranges': 0.3,
    
    // Nuts and Seeds
    'almonds': 2.3,
    'walnuts': 0.3,
    'peanuts': 2.5,
    
    // Oils
    'olive oil': 3.3,
    'sunflower oil': 3.5,
    
    // Default value for unknown ingredients
    'default': 2.0
  };
  
  export function calculateCarbonFootprint(
    ingredient: string,
    amount: number,
    unit: string
  ): number {
    const carbonFootprint = DEFAULT_CARBON_FOOTPRINTS[ingredient.toLowerCase()] || 
                           DEFAULT_CARBON_FOOTPRINTS['default'];
    
    // Convert amount to kg if needed
    let amountInKg = amount;
    if (unit.toLowerCase() === 'g') {
      amountInKg = amount / 1000;
    } else if (unit.toLowerCase() === 'ml') {
      amountInKg = amount / 1000;
    }
    
    return carbonFootprint * amountInKg;
  } 