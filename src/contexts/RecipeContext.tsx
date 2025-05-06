import React, { createContext, useContext, useState } from 'react';
import { Ingredient, Recipe, DietType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { mockRecipes } from '@/data/mockRecipes';
import { calculateCarbonFootprint } from '@/services/geminiConfig';

interface RecipeContextType {
  ingredients: Ingredient[];
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  loading: boolean;
  error: string | null;
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  removeIngredient: (id: string) => void;
  clearIngredients: () => void;
  findRecipes: (
    dietTypes: DietType[],
    maxPrepTime?: number,
    maxCarbonFootprint?: number
  ) => void;
}

const RecipeContext = createContext<RecipeContextType | null>(null);

// Spoonacular API configuration
const SPOONACULAR_API_KEY = "5b4c9a5d5ec14a52b484f32919c8f1fa";
const SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";
const SPOONACULAR_RECIPE_INFO_URL = "https://api.spoonacular.com/recipes";

// Map our diet types to Spoonacular diet types
const dietTypeMapping: Record<DietType, string> = {
  "vegetarian": "vegetarian",
  "vegan": "vegan",
  "pescatarian": "pescatarian",
  "keto": "ketogenic",
  "paleo": "paleo",
  "gluten-free": "gluten-free",
  "dairy-free": "dairy-free",
  "low-carb": "low-carb",
  "high-protein": "high-protein",
  "fat-free": "fat-free",
  "mediterranean": "mediterranean",
  "whole30": "whole30",
  "raw": "raw",
  "other": "other"
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    const newIngredient = { 
      ...ingredient, 
      id: `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    };
    
    setIngredients((prev) => [...prev, newIngredient]);
    toast({
      title: "Ingredient Added",
      description: `${ingredient.name} has been added to your ingredients list.`,
    });
  };

  const removeIngredient = (id: string) => {
    const ingredientToRemove = ingredients.find(ing => ing.id === id);
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    
    if (ingredientToRemove) {
      toast({
        title: "Ingredient Removed",
        description: `${ingredientToRemove.name} has been removed from your ingredients list.`,
      });
    }
  };

  const clearIngredients = () => {
    setIngredients([]);
    toast({
      title: "Ingredients Cleared",
      description: "All ingredients have been removed from your list.",
    });
  };

  const findRecipes = async (
    dietTypes: DietType[] = [],
    maxPrepTime: number = 120,
    maxCarbonFootprint: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      if (ingredients.length === 0) {
        throw new Error("Please add at least one ingredient");
      }

      // Prepare ingredients for API request
      const ingredientNames = ingredients.map(ing => ing.name).join(',');
      
      // Build API URL with parameters
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredientNames,
        number: "5",
        ranking: "1", // Maximize used ingredients
        ignorePantry: "true"
      });

      // Add diet type if specified
      if (dietTypes.length > 0) {
        params.append("diet", dietTypes.map(diet => dietTypeMapping[diet]).join(','));
      }

      // Make API request
      const response = await fetch(`${SPOONACULAR_API_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform Spoonacular API response to our Recipe format
      let allRecipes: Recipe[] = data.map((recipe: any) => ({
        id: recipe.id.toString(),
        name: recipe.title,
        imageUrl: recipe.image,
        prepTime: recipe.readyInMinutes || 30,
        cookTime: 0, // Not provided by the API
        servings: recipe.servings || 4,
        ingredients: [
          ...recipe.usedIngredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit
          })),
          ...recipe.missedIngredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit
          }))
        ],
        instructions: recipe.instructions || "No instructions provided",
        dietaryTags: recipe.diets || [],
        totalCarbonFootprint: 5, // Will be updated below
        source: "Spoonacular API"
      }));

      // Calculate carbon footprint for each recipe using Gemini AI
      allRecipes = await Promise.all(
        allRecipes.map(async (recipe) => {
          try {
            const carbon = await calculateCarbonFootprint({
              name: recipe.name,
              ingredients: recipe.ingredients
            });
            return { ...recipe, totalCarbonFootprint: carbon };
          } catch (e) {
            return recipe;
          }
        })
      );

      setRecipes(allRecipes);

      // Filter recipes based on preparation time
      let filtered = allRecipes.filter(
        (recipe) => recipe.prepTime <= maxPrepTime
      );
      
      // Filter by carbon footprint
      filtered = filtered.filter(
        (recipe) => recipe.totalCarbonFootprint <= maxCarbonFootprint
      );
      
      setFilteredRecipes(filtered);
      
      if (filtered.length === 0) {
        toast({
          title: "No Matching Recipes Found",
          description: "Try adjusting your filters or adding more ingredients.",
        });
      } else {
        toast({
          title: "Recipes Found!",
          description: `Found ${filtered.length} recipes that match your criteria.`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to find recipes';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Finding Recipes",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ingredients,
    recipes,
    filteredRecipes,
    loading,
    error,
    addIngredient,
    removeIngredient,
    clearIngredients,
    findRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

// Fetch detailed recipe information by ID
export const getRecipeById = async (id: string) => {
  try {
    const response = await fetch(`${SPOONACULAR_RECIPE_INFO_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recipe information: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
