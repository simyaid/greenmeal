import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { getRecipeById } from '@/contexts/RecipeContext';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [apiRecipe, setApiRecipe] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (id) {
      setLoading(true);
      getRecipeById(id)
        .then((data) => {
          if (data) {
            console.log('Spoonacular API response:', data);
            setApiRecipe(mapSpoonacularRecipe(data));
          } else {
            setError('Recipe not found from API.');
          }
        })
        .catch(() => setError('Recipe not found from API.'))
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-eco-green-600 mb-4">Loading recipe...</h2>
        </div>
      </Layout>
    );
  }
  
  if (!apiRecipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-eco-green-600 mb-4">Recipe not found</h2>
          <p className="text-muted-foreground mb-8">Sorry, the recipe you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/recipe-finder')} className="bg-eco-green-500 hover:bg-eco-green-600">
            Back to Recipe Finder
          </Button>
        </div>
      </Layout>
    );
  }
  
  const displayRecipe = apiRecipe;
  
  const handleSaveRecipe = () => {
    toast({
      title: "Recipe Saved",
      description: "This recipe has been added to your favorites.",
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <Link to="/recipe-finder" className="text-eco-green-600 hover:text-eco-green-500 mb-4 inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Recipe Finder
            </Link>
            <h1 className="text-3xl font-bold text-eco-green-600 mb-2">{displayRecipe.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {displayRecipe.dietaryTags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-eco-green-50 text-eco-green-600 border-eco-green-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button 
              className="bg-eco-green-500 hover:bg-eco-green-600"
              onClick={handleSaveRecipe}
            >
              Save Recipe
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={displayRecipe.imageUrl} 
                alt={displayRecipe.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <Card className="mb-8 shadow-md border-eco-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-eco-green-600">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{displayRecipe.description}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-eco-green-200">
              <Tabs defaultValue="ingredients">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ingredients" className="p-6">
                  <ul className="space-y-2">
                    {displayRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 mr-2 text-eco-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                          <strong>{ingredient.quantity} {ingredient.unit}</strong> {ingredient.name}
                          {ingredient.preparation && <span className="text-muted-foreground"> ({ingredient.preparation})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="instructions" className="p-6">
                  <ol className="space-y-4">
                    {displayRecipe.instructions.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-eco-green-100 text-eco-green-600 flex items-center justify-center mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <p>{step}</p>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="nutrition" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Calories: {displayRecipe.nutritionFacts.calories} kcal</span>
                        <span>{Math.round((displayRecipe.nutritionFacts.calories / 2000) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(displayRecipe.nutritionFacts.calories / 2000) * 100} 
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Protein: {displayRecipe.nutritionFacts.protein}g</span>
                        <span>{Math.round((displayRecipe.nutritionFacts.protein / 50) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(displayRecipe.nutritionFacts.protein / 50) * 100}
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Carbs: {displayRecipe.nutritionFacts.carbs}g</span>
                        <span>{Math.round((displayRecipe.nutritionFacts.carbs / 300) * 100)}%</span>
                      </div>
                      <Progress
                        value={(displayRecipe.nutritionFacts.carbs / 300) * 100}
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Fat: {displayRecipe.nutritionFacts.fat}g</span>
                        <span>{Math.round((displayRecipe.nutritionFacts.fat / 70) * 100)}%</span>
                      </div>
                      <Progress
                        value={(displayRecipe.nutritionFacts.fat / 70) * 100}
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Fiber: {displayRecipe.nutritionFacts.fiber}g</span>
                        <span>{Math.round((displayRecipe.nutritionFacts.fiber / 30) * 100)}%</span>
                      </div>
                      <Progress
                        value={(displayRecipe.nutritionFacts.fiber / 30) * 100}
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">* Percent Daily Values are based on a 2,000 calorie diet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6 shadow-md border-eco-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-eco-green-600">Recipe Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-eco-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-muted-foreground">Prep Time: {displayRecipe.prepTime} min</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-eco-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-muted-foreground">Cook Time: {displayRecipe.cookTime} min</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-eco-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-muted-foreground">Servings: {displayRecipe.servings}</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-eco-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-muted-foreground">Carbon Footprint: {displayRecipe.totalCarbonFootprint} CO₂e</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6 shadow-md border-eco-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-eco-green-600">Environmental Impact</CardTitle>
                <CardDescription>How this recipe affects the environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Carbon Footprint</span>
                    <span>{categorizeFootprint(displayRecipe.totalCarbonFootprint)}</span>
                  </div>
                  <Progress 
                    value={100 - ((displayRecipe.totalCarbonFootprint / 20) * 100)}
                    className={cn(
                      "h-2",
                      displayRecipe.totalCarbonFootprint <= 3 ? "bg-green-100" : 
                      displayRecipe.totalCarbonFootprint <= 7 ? "bg-yellow-100" : "bg-red-100"
                    )}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Water Usage</span>
                    <span>Medium</span>
                  </div>
                  <Progress 
                    value={50} 
                    className="h-2 bg-blue-100"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Land Use</span>
                    <span>Low</span>
                  </div>
                  <Progress 
                    value={25}
                    className="h-2 bg-green-100"
                  />
                </div>
                
                <p className="text-sm text-eco-green-600 mt-2">
                  By choosing this recipe, you're saving approximately {Math.round(displayRecipe.totalCarbonFootprint * 0.7 * 10) / 10} kg of CO₂e compared to a meat-based alternative.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function to categorize carbon footprint
function categorizeFootprint(value: number): string {
  if (value <= 3) return "Low";
  if (value <= 7) return "Medium";
  return "High";
}

function mapSpoonacularRecipe(apiRecipe: any) {
  return {
    id: apiRecipe.id?.toString(),
    name: apiRecipe.title || 'No name',
    imageUrl: apiRecipe.image || '',
    description: apiRecipe.summary ? apiRecipe.summary.replace(/<[^>]+>/g, '') : '',
    dietaryTags: apiRecipe.diets || [],
    prepTime: apiRecipe.readyInMinutes || 0,
    cookTime: apiRecipe.cookingMinutes || 0,
    servings: apiRecipe.servings || 1,
    ingredients: Array.isArray(apiRecipe.extendedIngredients)
      ? apiRecipe.extendedIngredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.amount,
          unit: ing.unit,
          preparation: ing.original,
        }))
      : [],
    instructions: Array.isArray(apiRecipe.analyzedInstructions) && apiRecipe.analyzedInstructions[0]?.steps
      ? apiRecipe.analyzedInstructions[0].steps.map((step: any) => step.step)
      : (apiRecipe.instructions ? [apiRecipe.instructions] : []),
    nutritionFacts: {
      calories: apiRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
      protein: apiRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
      carbs: apiRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
      fat: apiRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
      fiber: apiRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0,
    },
    totalCarbonFootprint: 5,
  };
}

export default RecipeDetail;
