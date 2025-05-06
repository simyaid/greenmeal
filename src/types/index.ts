export type DietType = 
  | "vegetarian" 
  | "vegan" 
  | "pescatarian" 
  | "keto" 
  | "paleo" 
  | "gluten-free" 
  | "dairy-free"
  | "low-carb"
  | "high-protein"
  | "fat-free"
  | "mediterranean"
  | "whole30"
  | "raw"
  | "other";

export interface Ingredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  carbonFootprint?: number; // in grams of CO2 equivalent
  preparation?: string; // how the ingredient should be prepared (e.g., "diced", "chopped", "minced")
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  dietaryTags: DietType[];
  totalCarbonFootprint: number; // in grams of CO2 equivalent
  nutritionFacts?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  dietPreferences: DietType[];
  allergies?: string[];
  favoriteRecipes?: string[];
  pantryIngredients?: Ingredient[];
  carbonFootprintSaved?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NutritionForm {
  dietType: DietType[];
  allergies: string[];
  preferences: {
    avoidIngredients: string[];
    favoriteIngredients: string[];
  };
  goals: string[];
  cookingTime: {
    preferred: number; // in minutes
    maximum: number; // in minutes
  };
}

export type CarbonImpact = "low" | "medium" | "high";

export interface CarbonFootprintData {
  total: number;
  byCategory: {
    [key: string]: number;
  };
  impact: CarbonImpact;
  suggestedAlternatives?: Array<{
    original: string;
    alternative: string;
    saving: number;
  }>;
}
