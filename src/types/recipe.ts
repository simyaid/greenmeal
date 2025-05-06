import { DietType } from './dietType';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  carbonFootprint: number; // in kg CO2e
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  dietaryTags: DietType[];
  totalCarbonFootprint: number; // in kg CO2e
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFormData {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  dietaryTags: DietType[];
  imageUrl?: string;
} 