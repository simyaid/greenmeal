
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { DietType } from '@/types';

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
  { label: "Whole30", value: "whole30" },
  { label: "Raw", value: "raw" },
  { label: "Other", value: "other" },
];

const allergens = [
  { label: "Milk", value: "milk" },
  { label: "Eggs", value: "eggs" },
  { label: "Fish", value: "fish" },
  { label: "Shellfish", value: "shellfish" },
  { label: "Tree Nuts", value: "tree_nuts" },
  { label: "Peanuts", value: "peanuts" },
  { label: "Wheat", value: "wheat" },
  { label: "Soybeans", value: "soybeans" },
  { label: "Sesame", value: "sesame" },
];

const goals = [
  { label: "Weight Loss", value: "weight_loss" },
  { label: "Muscle Gain", value: "muscle_gain" },
  { label: "Maintain Weight", value: "maintain_weight" },
  { label: "Improve Energy", value: "improve_energy" },
  { label: "Reduce Carbon Footprint", value: "reduce_carbon" },
  { label: "Eat More Plant-Based", value: "more_plant_based" },
  { label: "Improve Overall Health", value: "improve_health" },
];

const nutritionFormSchema = z.object({
  dietTypes: z.array(z.string()).min(1, {
    message: "Please select at least one diet type",
  }),
  allergies: z.array(z.string()).optional(),
  avoidIngredients: z.string().optional(),
  favoriteIngredients: z.string().optional(),
  selectedGoals: z.array(z.string()).min(1, {
    message: "Please select at least one goal",
  }),
  cookingTimePreferred: z.coerce.number().min(5).max(120),
  cookingTimeMaximum: z.coerce.number().min(5).max(180),
});

type NutritionFormValues = z.infer<typeof nutritionFormSchema>;

const NutritionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues: {
      dietTypes: [],
      allergies: [],
      avoidIngredients: "",
      favoriteIngredients: "",
      selectedGoals: [],
      cookingTimePreferred: 30,
      cookingTimeMaximum: 60,
    },
  });
  
  const onSubmit = (data: NutritionFormValues) => {
    console.log(data);
    // In a real app, this would be sent to a backend
    toast({
      title: "Preferences Saved",
      description: "Your nutrition preferences have been saved successfully!",
    });
    
    // Redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-eco-green-600 mb-2">Nutrition Preferences</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about your dietary preferences so we can provide personalized recipes and track your carbon footprint.
        </p>
        
        <Card className="mb-8 shadow-md border-eco-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-eco-green-600">Nutrition Profile</CardTitle>
            <CardDescription>
              Set up your nutrition profile to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="dietTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Diet Types</FormLabel>
                      <FormDescription>
                        Select all diet types that apply to you
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {dietTypes.map((diet) => (
                          <FormItem
                            key={diet.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(diet.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, diet.value]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (value) => value !== diet.value
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {diet.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Allergies</FormLabel>
                      <FormDescription>
                        Select any food allergies or sensitivities you have
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {allergens.map((allergen) => (
                          <FormItem
                            key={allergen.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(allergen.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value || [], allergen.value]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (value) => value !== allergen.value
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {allergen.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="avoidIngredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredients to Avoid</FormLabel>
                        <FormDescription>
                          List ingredients you don't like or want to avoid
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g. cilantro, mushrooms, olives"
                            {...field}
                            className="focus-ring"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="favoriteIngredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Ingredients</FormLabel>
                        <FormDescription>
                          List ingredients you love or prefer
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g. spinach, sweet potatoes, quinoa"
                            {...field}
                            className="focus-ring"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="selectedGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Goals</FormLabel>
                      <FormDescription>
                        Select your nutrition and lifestyle goals
                      </FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {goals.map((goal) => (
                          <FormItem
                            key={goal.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(goal.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, goal.value]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (value) => value !== goal.value
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {goal.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cookingTimePreferred"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Cooking Time (minutes)</FormLabel>
                        <FormDescription>
                          Your ideal time for meal preparation
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="focus-ring"
                            min={5}
                            max={120}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cookingTimeMaximum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Cooking Time (minutes)</FormLabel>
                        <FormDescription>
                          The longest you're willing to spend cooking
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="focus-ring"
                            min={5}
                            max={180}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-eco-green-500 hover:bg-eco-green-600 text-white">
                  Save Nutrition Preferences
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NutritionForm;
