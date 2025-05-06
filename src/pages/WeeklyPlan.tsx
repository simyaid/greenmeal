import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useRecipes } from '@/contexts/RecipeContext';
import { commonIngredients } from '@/data/mockRecipes';
import { generateMealPlan } from '@/services/geminiConfig';

// Mock data for weekly meal plan
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface MealPlan {
  day: string;
  breakfast: {
    name: string;
    carbonFootprint: number;
    ingredients: string[];
    recipeId: string;
  };
  lunch: {
    name: string;
    carbonFootprint: number;
    ingredients: string[];
    recipeId: string;
  };
  dinner: {
    name: string;
    carbonFootprint: number;
    ingredients: string[];
    recipeId: string;
  };
}

// Mock meal plan data
const mockMealPlan: MealPlan[] = weekDays.map((day) => ({
  day,
  breakfast: {
    name: `${day} Breakfast: Overnight Oats with Berries`,
    carbonFootprint: 1.2,
    ingredients: ['oats', 'almond milk', 'berries', 'honey'],
    recipeId: `breakfast-${day.toLowerCase()}`,
  },
  lunch: {
    name: `${day} Lunch: Mediterranean Salad`,
    carbonFootprint: 2.1,
    ingredients: ['cucumber', 'tomatoes', 'olives', 'feta cheese', 'olive oil'],
    recipeId: `lunch-${day.toLowerCase()}`,
  },
  dinner: {
    name: `${day} Dinner: Vegetable Curry with Rice`,
    carbonFootprint: 3.5,
    ingredients: ['rice', 'mixed vegetables', 'coconut milk', 'curry paste', 'tofu'],
    recipeId: `dinner-${day.toLowerCase()}`,
  },
}));

interface ShoppingList {
  produce: string[];
  pantry: string[];
  dairy: string[];
  other: string[];
}

interface AIResponse {
  mealPlan: MealPlan[];
  shoppingList: ShoppingList;
}

const WeeklyPlan = () => {
  const { user, isAuthenticated } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>(() => {
    const savedMealPlan = localStorage.getItem('savedMealPlan');
    return savedMealPlan ? JSON.parse(savedMealPlan) : mockMealPlan;
  });
  const [shoppingList, setShoppingList] = useState<ShoppingList>(() => {
    const savedShoppingList = localStorage.getItem('savedShoppingList');
    return savedShoppingList ? JSON.parse(savedShoppingList) : {
      produce: [],
      pantry: [],
      dairy: [],
      other: []
    };
  });
  const { toast } = useToast();

  const { addIngredient, ingredients, removeIngredient, clearIngredients, findRecipes, filteredRecipes, loading } = useRecipes();
  const [newIngredient, setNewIngredient] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      // Check if the ingredient exists in commonIngredients
      const isValidIngredient = commonIngredients.some(
        (ing) => ing.toLowerCase() === newIngredient.toLowerCase()
      );

      if (!isValidIngredient) {
        toast({
          variant: "destructive",
          title: "Invalid ingredient",
          description: "Please select an ingredient from the suggestions list.",
        });
        return;
      }

      const exists = ingredients.some(
        (ing) => ing.name.toLowerCase() === newIngredient.toLowerCase()
      );

      if (exists) {
        toast({
          variant: "destructive",
          title: "Ingredient already added",
          description: `${newIngredient} is already in your list.`,
        });
      } else {
        addIngredient({ name: newIngredient.trim() });
        setNewIngredient("");
        setSuggestions([]);
      }
    }
  };

  const handleFindRecipes = () => {
    if (ingredients.length === 0) {
      toast({
        variant: "destructive",
        title: "No ingredients added",
        description: "Please add at least one ingredient to find recipes.",
      });
      return;
    }
  };

  const generateMealPlanWithAI = async () => {
    if (!user) return;

    if (ingredients.length === 0) {
      toast({
        variant: "destructive",
        title: "No ingredients added",
        description: "Please add at least one ingredient to generate a meal plan.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generateMealPlan(
        user.dietPreferences || [],
        ingredients.map(i => i.name)
      );

      console.log('Received response from Gemini:', response);

      try {
        // Clean the response string to ensure it's valid JSON
        const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
        const parsedResponse: AIResponse = JSON.parse(cleanedResponse);
        
        // Validate response structure
        if (!parsedResponse.mealPlan || !Array.isArray(parsedResponse.mealPlan) || parsedResponse.mealPlan.length !== 7) {
          throw new Error('Invalid meal plan structure');
        }

        if (!parsedResponse.shoppingList || typeof parsedResponse.shoppingList !== 'object') {
          throw new Error('Invalid shopping list structure');
        }

        // Save to localStorage
        localStorage.setItem('savedMealPlan', JSON.stringify(parsedResponse.mealPlan));
        localStorage.setItem('savedShoppingList', JSON.stringify(parsedResponse.shoppingList));

        // Update state
        setMealPlan(parsedResponse.mealPlan);
        setShoppingList(parsedResponse.shoppingList);

        toast({
          title: "Success!",
          description: "Your weekly meal plan has been generated.",
        });
      } catch (error) {
        console.error('Error parsing AI response:', error);
        console.error('Raw response:', response);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to parse the meal plan. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const totalCarbonFootprint = mealPlan.reduce(
    (acc, day) =>
      acc + day.breakfast.carbonFootprint + day.lunch.carbonFootprint + day.dinner.carbonFootprint,
    0
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-eco-green-600">Your Weekly Meal Plan</h1>
          </div>
        </div>

        {/* Weekly Overview Card - Sol taraf */}
        <Card className="mb-8 shadow-md border-eco-green-200 flex-1">
          <CardHeader>
            <CardTitle className="text-xl text-eco-green-600">Weekly Overview</CardTitle>
            <CardDescription>
              Your personalized sustainable meal plan based on your preferences and pantry ingredients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-eco-green-600">
                    {Math.round(totalCarbonFootprint * 10) / 10} kg CO₂e weekly footprint
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-eco-green-600">
                    Optimized for your diet: {user?.dietPreferences?.join(', ') || 'No preferences set'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Pantry Ingredients Card - Sağ taraf */}
        <Card className="h-full shadow-md border-eco-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-eco-green-600">Your Ingredients</CardTitle>
            <CardDescription>Add ingredients you have at home</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    value={newIngredient}
                    onChange={handleIngredientChange}
                    placeholder="Type to search ingredients..."
                    className="w-full focus-ring"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-eco-green-200 rounded-md shadow-lg">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion}
                          className="px-3 py-2 hover:bg-eco-green-100 cursor-pointer"
                          onClick={() => {
                            setNewIngredient(suggestion);
                            setSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddIngredient} className="bg-eco-green-500 hover:bg-eco-green-600">
                  Add
                </Button>
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
        </Card>
        {/* Meal Plan Generation */}
        <div className="flex justify-center items-center mt-8">
          <Button
            className="bg-eco-green-500 hover:bg-eco-green-600 text-white"
            onClick={generateMealPlanWithAI}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate My Meal Plan'}
          </Button>
        </div>

        <Tabs defaultValue={weekDays[0].toLowerCase()} className="mb-6">
          <TabsList className="mb-4 w-full flex overflow-x-auto justify-start sm:justify-center mt-8">
            {weekDays.map((day) => (
              <TabsTrigger
                key={day}
                value={day.toLowerCase()}
                className="px-4 md:px-8"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {mealPlan.map((day) => (
            <TabsContent key={day.day} value={day.day.toLowerCase()}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Breakfast */}
                <Card className="shadow-md border-eco-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-eco-green-600">Breakfast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-lg mb-2 text-eco-green-600">
                      {day.breakfast.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <svg className="h-4 w-4 mr-1 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      <span>{day.breakfast.carbonFootprint} kg CO₂e</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {day.breakfast.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/recipe/${day.breakfast.recipeId}`} className="w-full">
                      <Button variant="outline" className="w-full border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100">
                        View Recipe
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Lunch */}
                <Card className="shadow-md border-eco-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-eco-green-600">Lunch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-lg mb-2 text-eco-green-600">
                      {day.lunch.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <svg className="h-4 w-4 mr-1 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      <span>{day.lunch.carbonFootprint} kg CO₂e</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {day.lunch.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/recipe/${day.lunch.recipeId}`} className="w-full">
                      <Button variant="outline" className="w-full border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100">
                        View Recipe
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                {/* Dinner */}
                <Card className="shadow-md border-eco-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-eco-green-600">Dinner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-lg mb-2 text-eco-green-600">
                      {day.dinner.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <svg className="h-4 w-4 mr-1 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      <span>{day.dinner.carbonFootprint} kg CO₂e</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {day.dinner.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/recipe/${day.dinner.recipeId}`} className="w-full">
                      <Button variant="outline" className="w-full border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100">
                        View Recipe
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Card className="shadow-md border-eco-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-eco-green-600">Shopping List</CardTitle>
            <CardDescription>Generated based on your weekly meal plan and pantry ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-eco-green-600 mb-3">Produce</h3>
                <ul className="space-y-2">
                  {shoppingList.produce.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full border border-eco-green-200 mt-0.5"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-eco-green-600 mb-3">Pantry</h3>
                <ul className="space-y-2">
                  {shoppingList.pantry.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full border border-eco-green-200 mt-0.5"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-eco-green-600 mb-3">Dairy & Other</h3>
                <ul className="space-y-2">
                  {[...shoppingList.dairy, ...shoppingList.other].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full border border-eco-green-200 mt-0.5"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeeklyPlan;
