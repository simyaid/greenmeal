import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Layout from '@/components/Layout';
import { useRecipes } from '@/contexts/RecipeContext';
import { DietType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { getSustainableAdvice } from '@/services/geminiConfig';

// List of common food ingredients for validation
const commonIngredients = [
  // Vegetables
  "tomato", "onion", "garlic", "potato", "carrot", "bell pepper", "broccoli", "spinach", "lettuce", "cucumber",
  "zucchini", "eggplant", "mushroom", "celery", "green beans", "peas", "corn", "asparagus", "cauliflower",
  
  // Fruits
  "apple", "banana", "orange", "lemon", "lime", "strawberry", "blueberry", "raspberry", "grape", "peach",
  "pear", "plum", "cherry", "pineapple", "mango", "kiwi", "melon", "watermelon",
  
  // Herbs and Spices
  "basil", "oregano", "thyme", "rosemary", "parsley", "cilantro", "mint", "dill", "sage", "cumin",
  "coriander", "paprika", "turmeric", "ginger", "cinnamon", "nutmeg", "cloves", "cardamom",
  
  // Proteins
  "chicken", "beef", "pork", "fish", "salmon", "tuna", "shrimp", "egg", "tofu", "tempeh",
  "lentils", "beans", "chickpeas", "quinoa", "rice", "pasta", "bread", "flour",
  
  // Dairy and Alternatives
  "milk", "cheese", "yogurt", "butter", "cream", "sour cream", "cottage cheese", "almond milk", "soy milk",
  
  // Nuts and Seeds
  "almond", "walnut", "cashew", "peanut", "sunflower seeds", "pumpkin seeds", "chia seeds", "flax seeds",
  
  // Oils and Condiments
  "olive oil", "vegetable oil", "coconut oil", "vinegar", "soy sauce", "mustard", "ketchup", "mayonnaise",
  
  // Grains and Legumes
  "rice", "quinoa", "oats", "barley", "lentils", "beans", "chickpeas", "black beans", "kidney beans",
  
  // Other Common Ingredients
  "salt", "pepper", "sugar", "honey", "maple syrup", "chocolate", "cocoa powder", "vanilla extract"
];

const dietTypes: { label: string; value: DietType }[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" },
  { label: "Keto", value: "keto" },
  { label: "Paleo", value: "paleo" },
  { label: "Gluten-Free", value: "gluten-free" },
  { label: "Dairy-Free", value: "dairy-free" },
  { label: "Low-Carb", value: "low-carb" },
  { label: "High-Protein", value: "high-protein" },
  { label: "Fat-Free", value: "fat-free" },
  { label: "Mediterranean", value: "mediterranean" },
];

const RecipeFinder = () => {
  const { addIngredient, ingredients, removeIngredient, clearIngredients, findRecipes, filteredRecipes, loading } = useRecipes();
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredientError, setIngredientError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<DietType | "any">("any");
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [maxCarbonFootprint, setMaxCarbonFootprint] = useState<number>(10);
  const [sustainabilityTip, setSustainabilityTip] = useState<string>("");
  const [showTip, setShowTip] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewIngredient(value);
    
    if (value.length > 1) {
      // Filter suggestions based on input
      const filtered = commonIngredients.filter(
        (ing) => ing.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const validateIngredient = async (ingredient: string): Promise<{ isValid: boolean; error?: string }> => {
    const trimmedIngredient = ingredient.trim().toLowerCase();
    
    if (!trimmedIngredient) {
      return { isValid: false, error: "Please enter an ingredient" };
    }

    // Check if ingredient contains only letters, spaces, and hyphens
    if (!/^[a-zA-Z\s-]+$/.test(trimmedIngredient)) {
      return { isValid: false, error: "Please enter only valid ingredients (letters and spaces only)" };
    }

    // Check if ingredient is too short or too long
    if (trimmedIngredient.length < 2) {
      return { isValid: false, error: "Ingredient name is too short" };
    }
    if (trimmedIngredient.length > 50) {
      return { isValid: false, error: "Ingredient name is too long" };
    }

    // Check if ingredient is already in the list
    if (ingredients.some(ing => ing.name.toLowerCase() === trimmedIngredient)) {
      return { isValid: false, error: "This ingredient is already in the list" };
    }

    // Check if ingredient is in the common ingredients list
    const isCommonIngredient = commonIngredients.some(common => 
      common.toLowerCase() === trimmedIngredient
    );

    // If it's not a common ingredient, check if it's a real word
    if (!isCommonIngredient) {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedIngredient}`);
        const data = await response.json();
        
        // If the word is not found in the dictionary
        if (response.status === 404) {
          return { 
            isValid: false, 
            error: "Please enter a valid food ingredient" 
          };
        }

        // If the word is found but not a food-related term
        const isFoodRelated = data.some((entry: any) => 
          entry.meanings.some((meaning: any) => 
            meaning.definitions.some((def: any) => 
              def.definition.toLowerCase().includes('food') || 
              def.definition.toLowerCase().includes('ingredient') ||
              def.definition.toLowerCase().includes('cooking') ||
              def.definition.toLowerCase().includes('recipe')
            )
          )
        );

        if (!isFoodRelated) {
          return { 
            isValid: false, 
            error: "Please enter a valid food ingredient" 
          };
        }
      } catch (error) {
        console.error('Error checking word validity:', error);
        return { 
          isValid: false, 
          error: "Unable to verify ingredient. Please try again." 
        };
      }
    }

    return { isValid: true };
  };
  
  const handleAddIngredient = async () => {
    const validation = await validateIngredient(newIngredient);
    
    if (!validation.isValid) {
      setIngredientError(validation.error || "");
      return;
    }

    // Add the ingredient
    addIngredient({
      name: newIngredient.trim()
    });
    
    setNewIngredient("");
    setIngredientError("");
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setNewIngredient(suggestion);
    setSuggestions([]);
  };
  
  const handleFindRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        variant: "destructive",
        title: "No ingredients added",
        description: "Please add at least one ingredient to find recipes.",
      });
      return;
    }
    
    findRecipes(
      selectedDiet !== "any" ? [selectedDiet] : [],
      maxPrepTime,
      maxCarbonFootprint
    );

    // Get sustainability tip
    try {
      const tip = await getSustainableAdvice(
        selectedDiet !== "any" ? selectedDiet : "any",
        ingredients.map(ing => ing.name)
      );
      setSustainabilityTip(tip);
      setShowTip(true);
    } catch (error) {
      console.error("Failed to get sustainability tip:", error);
    }
  };
  
  const handleViewRecipe = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-eco-green-600 mb-6">Recipe Finder</h1>
        
        {showTip && sustainabilityTip && (
          <Card className="mb-6 bg-eco-green-50 border-eco-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-eco-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-eco-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-eco-green-700 mb-1">Sustainability Tip</h3>
                  <p className="text-eco-green-600">{sustainabilityTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-md border-eco-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-eco-green-600">Your Ingredients</CardTitle>
                <CardDescription>Add ingredients you have at home</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredient">Add Ingredients</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ingredient"
                        placeholder="e.g., tomato, onion, garlic"
                        value={newIngredient}
                        onChange={(e) => {
                          setNewIngredient(e.target.value);
                          setIngredientError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddIngredient();
                          }
                        }}
                      />
                      <Button onClick={handleAddIngredient}>Add</Button>
                    </div>
                    {ingredientError && (
                      <p className="text-sm text-red-500">{ingredientError}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Diet Type (optional)</p>
                    <Select value={selectedDiet} onValueChange={(value) => setSelectedDiet(value as DietType | "any")}>
                      <SelectTrigger className="w-full focus-ring">
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any diet</SelectItem>
                        {dietTypes.map((diet) => (
                          <SelectItem key={diet.value} value={diet.value}>
                            {diet.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Max Preparation Time: {maxPrepTime} minutes</p>
                    <Slider 
                      value={[maxPrepTime]} 
                      onValueChange={(value) => setMaxPrepTime(value[0])}
                      max={120}
                      step={5}
                      className="py-4"
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Max Carbon Footprint: {maxCarbonFootprint} CO₂e</p>
                    <Slider 
                      value={[maxCarbonFootprint]} 
                      onValueChange={(value) => setMaxCarbonFootprint(value[0])}
                      max={20}
                      step={0.5}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ingredients.map((ingredient) => (
                      <Badge
                        key={ingredient.id}
                        variant="secondary"
                        className="bg-eco-green-100 text-eco-green-600 hover:bg-eco-green-200 flex items-center gap-1 py-1 px-2"
                      >
                        {ingredient.name}
                        <button
                          onClick={() => removeIngredient(ingredient.id)}
                          className="ml-1 rounded-full hover:bg-eco-green-200 h-4 w-4 inline-flex items-center justify-center"
                          aria-label={`Remove ${ingredient.name}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    
                    {ingredients.length > 0 && (
                      <button
                        onClick={clearIngredients}
                        className="text-xs text-eco-green-600 hover:text-eco-green-500 underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleFindRecipes} 
                  className="w-full bg-eco-green-500 hover:bg-eco-green-600"
                  disabled={loading || ingredients.length === 0}
                >
                  {loading ? "Finding Recipes..." : "Find Recipes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-eco-green-600">
                {filteredRecipes.length > 0 
                  ? `Found ${filteredRecipes.length} Recipe${filteredRecipes.length !== 1 ? 's' : ''}`
                  : 'Recipe Results'
                }
              </h2>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="h-12 w-12 border-4 border-t-eco-green-500 border-eco-green-200 rounded-full animate-spin"></div>
                  <p className="mt-4 text-eco-green-600">Searching for recipes...</p>
                </div>
              ) : filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecipes.map((recipe) => (
                    <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow border-eco-green-200">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg text-eco-green-600">{recipe.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.dietaryTags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-eco-green-50 text-eco-green-600 border-eco-green-200">
                              {tag}
                            </Badge>
                          ))}
                          {recipe.dietaryTags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recipe.dietaryTags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {recipe.prepTime + recipe.cookTime} min
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            {recipe.servings} servings
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {recipe.nutritionFacts?.calories} cal
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 pb-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-1 text-sm text-eco-green-600">
                            {Math.round(recipe.totalCarbonFootprint * 10) / 10} CO₂e
                          </span>
                        </div>
                        <Button 
                          onClick={() => handleViewRecipe(recipe.id)} 
                          variant="outline" 
                          className="border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100"
                        >
                          View Recipe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : ingredients.length > 0 ? (
                <div className="bg-eco-green-50 border border-eco-green-200 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                  <svg className="h-16 w-16 text-eco-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-eco-green-600">No recipes found</p>
                  <p className="text-sm text-eco-green-500 text-center mt-1">
                    Try adding more ingredients or changing your dietary preferences
                  </p>
                </div>
              ) : (
                <div className="bg-eco-green-50 border border-eco-green-200 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                  <svg className="h-16 w-16 text-eco-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-eco-green-600">No ingredients added</p>
                  <p className="text-sm text-eco-green-500 text-center mt-1">
                    Add ingredients from your pantry to find matching recipes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeFinder;
