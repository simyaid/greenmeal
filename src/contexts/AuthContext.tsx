import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, DietType } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, dietPreferences: DietType[]) => Promise<void>;
  logout: () => void;
  updateDietPreferences: (dietPreferences: DietType[]) => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check if token exists and verify it
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, this would validate the token with an API
      // For now, we'll simulate authentication with local data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User;
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            ...initialState,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          ...initialState,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      const mockUser: User = {
        id: email,
        email,
        name: email.split('@')[0],
        dietPreferences: [],
        pantryIngredients: [],
        carbonFootprintSaved: 0
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      toast({ variant: "destructive", title: "Login Failed", description: errorMessage });
    }
  };

  const register = async (name: string, email: string, password: string, dietPreferences: DietType[] = []) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      const mockUser: User = {
        id: email,
        email,
        name,
        dietPreferences,
        pantryIngredients: [],
        carbonFootprintSaved: 0
      };
      localStorage.setItem('token', data.token || 'registered');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        token: data.token || 'registered',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      toast({ title: "Registration Successful", description: "Welcome to Culinary Carbon Compass!" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      toast({ variant: "destructive", title: "Registration Failed", description: errorMessage });
    }
  };

  const updateDietPreferences = (dietPreferences: DietType[]) => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      dietPreferences
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
    
    toast({
      title: "Preferences Updated",
      description: "Your dietary preferences have been updated successfully.",
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateDietPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
