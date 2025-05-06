import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipe from '@/pages/Recipe';

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeFinder from "./pages/RecipeFinder";
import RecipeDetail from "./pages/RecipeDetail";
import WeeklyPlan from "./pages/WeeklyPlan";
import NotFound from "./pages/NotFound";

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { RecipeProvider } from './contexts/RecipeContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RecipeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipe-finder" element={<RecipeFinder />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/recipe-detail/:id" element={<RecipeDetail />} />
              <Route path="/weekly-plan" element={<WeeklyPlan />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RecipeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
