import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { mockRecipes } from '@/data/mockRecipes';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const featuredRecipes = mockRecipes.slice(0, 3);
  const { isAuthenticated, logout } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-eco-green-50 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-eco-green-500/70 to-eco-blue-500/60 z-0"></div>
        <div className="relative z-9 flex flex-col lg:flex-row items-center justify-between py-12 px-8 md:px-16">
          <div className="lg:w-1/2 mb-10 lg:mb-0 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              GreenMeal
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-lg drop-shadow-sm">
            Stop wasting food! Start saving the planet, one meal at a time. GreenMeal turns your kitchen into a hub of sustainability.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/recipe-finder">
                <Button size="lg" className="bg-white text-eco-green-600 hover:bg-eco-green-100 shadow-lg">
                  Find Recipes
                </Button>
              </Link>
              {!isAuthenticated && (<Link to="/register">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 shadow-lg">
                  Sign Up Free
                </Button>
              </Link>)}
              
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500"
                alt="Healthy Food"
                className="absolute w-48 h-48 object-cover rounded-lg shadow-xl top-0 right-0 z-20 border-4 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=500"
                alt="Vegetable Soup"
                className="absolute w-48 h-48 object-cover rounded-lg shadow-xl bottom-0 left-0 z-10 border-4 border-white"
              />
              <div className="absolute w-16 h-16 bg-eco-brown-300 rounded-full top-1/3 left-1/3 z-30 flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold">CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-green-600 mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform helps you make sustainable food choices that are good for both you and the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-eco-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-eco-green-600 mb-2">1. Set Your Preferences</h3>
            <p className="text-muted-foreground">
              Tell us about your dietary preferences, allergies, and sustainability goals so we can personalize your experience.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-eco-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-eco-green-600 mb-2">2. Add Your Ingredients</h3>
            <p className="text-muted-foreground">
              Input the ingredients you already have at home, and we'll find delicious recipes that minimize waste.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-eco-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-eco-green-600 mb-2">3. Track Your Impact</h3>
            <p className="text-muted-foreground">
              See how your food choices affect your carbon footprint and track your progress toward more sustainable eating.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 bg-eco-green-50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-green-600 mb-3">Featured Sustainable Recipes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Delicious recipes with low carbon footprints to help you eat sustainably
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden bg-white shadow-lg border-none">
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-eco-green-600 mb-1">{recipe.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{recipe.prepTime + recipe.cookTime} min</span>
                  <span className="mx-2">•</span>
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>{Math.round(recipe.totalCarbonFootprint * 10) / 10} CO₂e</span>
                </div>
                <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link to={`/recipe-detail/${recipe.id}`}>
                  <Button variant="outline" className="w-full border-eco-green-300 text-eco-green-600 hover:bg-eco-green-100">
                    View Recipe
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/recipe-finder">
            <Button className="bg-eco-green-500 hover:bg-eco-green-600 text-white">
              Explore More Recipes
            </Button>
          </Link>
        </div>
      </section>

      {/* Carbon Footprint Section */}
      <section className="py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-eco-green-600 mb-4">Reduce Your Carbon Foodprint</h2>
            <p className="text-muted-foreground mb-6">
              Food production is responsible for approximately 26% of global greenhouse gas emissions. By making informed choices about what you eat, you can significantly reduce your environmental impact.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-eco-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Track the carbon footprint of your meals</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-eco-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get recommendations for lower-impact alternatives</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-eco-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Visualize your progress and environmental impact</span>
              </li>
            </ul>
            <Link to="/register">
              <Button className="bg-eco-green-500 hover:bg-eco-green-600 text-white">
                Start Tracking Now
              </Button>
            </Link>
          </div>
          <div className="lg:w-1/2">
            <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500"
                alt="Sustainable Food"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-xl font-bold mb-2">Mediterranean Quinoa Bowl</p>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>1.65 kg CO₂e</span>
                    <span className="mx-2">•</span>
                    <span>80% less than beef alternatives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 bg-eco-blue-500 rounded-2xl text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Start Your Sustainable Cooking Journey Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who are reducing their environmental impact while enjoying delicious, healthy meals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 shadow-lg">
                      Sign Up Free
                    </Button>
                  </Link>
              <Link to="/recipe-finder">
                <Button size="lg" variant="outline" className="bg-tansparent border-white text-white hover:bg-white/20">
                  Find Recipes First
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
