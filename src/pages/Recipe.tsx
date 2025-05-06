import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  dietaryTags: string[];
  totalCarbonFootprint: number;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (id) {
      const savedRecipes = localStorage.getItem('savedRecipes');
      if (savedRecipes) {
        const recipes = JSON.parse(savedRecipes);
        setRecipe(recipes[id]);
      }
    }
  }, [id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-eco-green-600 mb-4">Recipe Not Found</h2>
              <p>The recipe you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-eco-green-600">Recipe Details</h1>
          <Link to="/recipe-finder">
            <Button className="bg-eco-green-500 hover:bg-eco-green-600 text-white">
              Find More Recipes
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-eco-green-200">
          <CardHeader className="bg-eco-green-50 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-eco-green-600">{recipe.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.dietaryTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-eco-green-100 text-eco-green-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-eco-green-100">
                  <h3 className="text-xl font-semibold text-eco-green-600 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full border-2 border-eco-green-200 mt-0.5 flex items-center justify-center">
                          <span className="text-eco-green-600 text-sm">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-eco-green-100">
                  <h3 className="text-xl font-semibold text-eco-green-600 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Instructions
                  </h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="font-bold text-eco-green-600 bg-eco-green-50 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-eco-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prep Time
                </h4>
                <p className="text-lg font-semibold mt-1">{recipe.prepTime} mins</p>
              </div>
              <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-eco-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cook Time
                </h4>
                <p className="text-lg font-semibold mt-1">{recipe.cookTime} mins</p>
              </div>
              <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-eco-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Servings
                </h4>
                <p className="text-lg font-semibold mt-1">{recipe.servings}</p>
              </div>
              <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-eco-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Carbon Footprint
                </h4>
                <p className="text-lg font-semibold mt-1">{recipe.totalCarbonFootprint} kg CO₂e</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-eco-green-600 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Nutrition Facts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Calories</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.calories} kcal</p>
                </div>
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Protein</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.protein}g</p>
                </div>
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Carbs</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.carbs}g</p>
                </div>
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Fat</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.fat}g</p>
                </div>
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Fiber</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.fiber}g</p>
                </div>
                <div className="bg-eco-green-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-eco-green-600">Sugar</h4>
                  <p className="text-lg font-semibold mt-1">{recipe.nutritionFacts.sugar}g</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Recipe; 