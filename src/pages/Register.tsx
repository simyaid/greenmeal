
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
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
];

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  dietPreferences: z.array(z.string()).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      dietPreferences: [],
    },
  });
  
  const onSubmit = async (values: RegisterFormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    await registerUser(
      values.name, 
      values.email, 
      values.password, 
      values.dietPreferences as DietType[] || []
    );
  };
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md shadow-lg border-eco-green-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-eco-green-600">
              {step === 1 ? "Create an Account" : "Dietary Preferences"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Enter your details to create your account" 
                : "Tell us about your dietary preferences (optional)"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 ? (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="yourname@example.com" 
                              type="email" 
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              {...field} 
                              className="focus-ring"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="dietPreferences"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Select all that apply to you</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {dietTypes.map((item) => (
                            <FormField
                              key={item.value}
                              control={form.control}
                              name="dietPreferences"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], item.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-eco-green-500 hover:bg-eco-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? "Processing..." 
                    : step === 1 
                      ? "Continue" 
                      : "Create Account"
                  }
                </Button>
                
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              <span>Already have an account? </span>
              <Link to="/login" className="text-eco-green-600 hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
