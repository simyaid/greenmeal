import { Recipe } from "@/types";

export const mockRecipes: Recipe[] = [
  {
    id: "recipe-001",
    name: "Vegetable Stir-Fry",
    description: "A quick and healthy vegetable stir-fry that's perfect for using up leftover vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500",
    ingredients: [
      { id: "ing-001", name: "broccoli", quantity: 1, unit: "cup", carbonFootprint: 0.3 },
      { id: "ing-002", name: "carrot", quantity: 1, unit: "medium", carbonFootprint: 0.1 },
      { id: "ing-003", name: "bell pepper", quantity: 1, unit: "medium", carbonFootprint: 0.2 },
      { id: "ing-004", name: "onion", quantity: 0.5, unit: "medium", carbonFootprint: 0.1 },
      { id: "ing-005", name: "garlic", quantity: 2, unit: "cloves", carbonFootprint: 0.05 },
      { id: "ing-006", name: "soy sauce", quantity: 2, unit: "tablespoon", carbonFootprint: 0.1 },
      { id: "ing-007", name: "vegetable oil", quantity: 1, unit: "tablespoon", carbonFootprint: 0.2 },
      { id: "ing-008", name: "ginger", quantity: 1, unit: "teaspoon", carbonFootprint: 0.05 },
    ],
    instructions: [
      "Heat oil in a large wok or pan over medium-high heat.",
      "Add garlic and ginger, stir for 30 seconds until fragrant.",
      "Add onion and cook for 1 minute.",
      "Add harder vegetables (carrots, broccoli) and cook for 2-3 minutes.",
      "Add bell pepper and cook for another 1-2 minutes.",
      "Add soy sauce and stir to combine.",
      "Cook until vegetables are tender but still crisp.",
      "Serve hot over rice or noodles if desired."
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    dietaryTags: ["vegetarian", "vegan", "dairy-free"],
    totalCarbonFootprint: 1.1,
    nutritionFacts: {
      calories: 180,
      protein: 5,
      carbs: 15,
      fat: 10,
      fiber: 5,
      sugar: 6
    }
  },
  {
    id: "recipe-002",
    name: "Mediterranean Quinoa Bowl",
    description: "A nutritious and filling quinoa bowl with Mediterranean flavors.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500",
    ingredients: [
      { id: "ing-011", name: "quinoa", quantity: 0.5, unit: "cup", carbonFootprint: 0.3 },
      { id: "ing-012", name: "cucumber", quantity: 0.5, unit: "medium", carbonFootprint: 0.1 },
      { id: "ing-013", name: "cherry tomatoes", quantity: 0.5, unit: "cup", carbonFootprint: 0.2 },
      { id: "ing-014", name: "olives", quantity: 0.25, unit: "cup", carbonFootprint: 0.2 },
      { id: "ing-015", name: "feta cheese", quantity: 0.25, unit: "cup", carbonFootprint: 0.5 },
      { id: "ing-016", name: "olive oil", quantity: 1, unit: "tablespoon", carbonFootprint: 0.2 },
      { id: "ing-017", name: "lemon juice", quantity: 1, unit: "tablespoon", carbonFootprint: 0.1 },
      { id: "ing-018", name: "herbs", quantity: 1, unit: "tablespoon", carbonFootprint: 0.05 },
    ],
    instructions: [
      "Rinse quinoa and cook according to package instructions.",
      "While quinoa cooks, chop cucumber and halve cherry tomatoes.",
      "Mix olive oil, lemon juice, and herbs to create dressing.",
      "Once quinoa is cooked and cooled slightly, combine with vegetables.",
      "Add olives and feta cheese.",
      "Drizzle dressing over the bowl and gently toss.",
      "Season with salt and pepper to taste.",
      "Serve immediately or refrigerate for later."
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    dietaryTags: ["vegetarian", "gluten-free"],
    totalCarbonFootprint: 1.65,
    nutritionFacts: {
      calories: 320,
      protein: 12,
      carbs: 35,
      fat: 15,
      fiber: 6,
      sugar: 3
    }
  },
  {
    id: "recipe-003",
    name: "Simple Avocado Toast",
    description: "Quick, easy and nutritious breakfast or snack option.",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=500",
    ingredients: [
      { id: "ing-021", name: "bread", quantity: 2, unit: "slices", carbonFootprint: 0.3 },
      { id: "ing-022", name: "avocado", quantity: 1, unit: "medium", carbonFootprint: 0.6 },
      { id: "ing-023", name: "lemon juice", quantity: 0.5, unit: "teaspoon", carbonFootprint: 0.05 },
      { id: "ing-024", name: "salt", quantity: 0.25, unit: "teaspoon", carbonFootprint: 0.01 },
      { id: "ing-025", name: "pepper", quantity: 0.25, unit: "teaspoon", carbonFootprint: 0.01 },
      { id: "ing-026", name: "red pepper flakes", quantity: 0.25, unit: "teaspoon", carbonFootprint: 0.01 },
    ],
    instructions: [
      "Toast the bread to desired crispness.",
      "Cut avocado in half, remove pit, and scoop flesh into a bowl.",
      "Mash avocado with a fork and add lemon juice, salt, and pepper.",
      "Spread the avocado mixture onto the toast.",
      "Sprinkle with red pepper flakes if desired.",
      "Serve immediately."
    ],
    prepTime: 5,
    cookTime: 3,
    servings: 2,
    dietaryTags: ["vegetarian", "vegan", "dairy-free"],
    totalCarbonFootprint: 0.98,
    nutritionFacts: {
      calories: 220,
      protein: 5,
      carbs: 25,
      fat: 12,
      fiber: 7,
      sugar: 1
    }
  },
  {
    id: "recipe-004",
    name: "Lentil Soup",
    description: "Hearty and nutritious lentil soup that's perfect for cold days.",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=500",
    ingredients: [
      { id: "ing-031", name: "lentils", quantity: 1, unit: "cup", carbonFootprint: 0.2 },
      { id: "ing-032", name: "onion", quantity: 1, unit: "medium", carbonFootprint: 0.1 },
      { id: "ing-033", name: "carrot", quantity: 2, unit: "medium", carbonFootprint: 0.2 },
      { id: "ing-034", name: "celery", quantity: 2, unit: "stalks", carbonFootprint: 0.1 },
      { id: "ing-035", name: "garlic", quantity: 2, unit: "cloves", carbonFootprint: 0.05 },
      { id: "ing-036", name: "vegetable broth", quantity: 4, unit: "cups", carbonFootprint: 0.3 },
      { id: "ing-037", name: "cumin", quantity: 1, unit: "teaspoon", carbonFootprint: 0.02 },
      { id: "ing-038", name: "olive oil", quantity: 2, unit: "tablespoons", carbonFootprint: 0.4 },
    ],
    instructions: [
      "Heat olive oil in a large pot over medium heat.",
      "Add onion, carrot, and celery. Cook for 5 minutes until softened.",
      "Add garlic and cumin, stir for 30 seconds until fragrant.",
      "Add lentils and vegetable broth, bring to a boil.",
      "Reduce heat and simmer for 25-30 minutes until lentils are tender.",
      "Season with salt and pepper to taste.",
      "Optionally, blend part of the soup for a creamier texture.",
      "Serve hot with bread or a side salad."
    ],
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "dairy-free"],
    totalCarbonFootprint: 1.37,
    nutritionFacts: {
      calories: 280,
      protein: 16,
      carbs: 40,
      fat: 5,
      fiber: 16,
      sugar: 4
    }
  },
  {
    id: "recipe-005",
    name: "Banana Oatmeal Pancakes",
    description: "Healthy, gluten-free pancakes made with oats and bananas.",
    imageUrl: "https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&q=80&w=500",
    ingredients: [
      { id: "ing-041", name: "oats", quantity: 1, unit: "cup", carbonFootprint: 0.2 },
      { id: "ing-042", name: "banana", quantity: 2, unit: "medium", carbonFootprint: 0.3 },
      { id: "ing-043", name: "eggs", quantity: 2, unit: "large", carbonFootprint: 0.6 },
      { id: "ing-044", name: "milk", quantity: 0.25, unit: "cup", carbonFootprint: 0.3 },
      { id: "ing-045", name: "cinnamon", quantity: 0.5, unit: "teaspoon", carbonFootprint: 0.01 },
      { id: "ing-046", name: "vanilla extract", quantity: 0.5, unit: "teaspoon", carbonFootprint: 0.05 },
      { id: "ing-047", name: "baking powder", quantity: 1, unit: "teaspoon", carbonFootprint: 0.01 },
    ],
    instructions: [
      "Blend oats in a blender until they reach a flour-like consistency.",
      "Add bananas, eggs, milk, cinnamon, vanilla, and baking powder to the blender.",
      "Blend until smooth and well combined.",
      "Heat a non-stick pan over medium heat and lightly grease if needed.",
      "Pour about 1/4 cup of batter for each pancake.",
      "Cook for 2-3 minutes until bubbles form, then flip and cook for another 1-2 minutes.",
      "Serve with fresh fruit, maple syrup, or yogurt."
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    dietaryTags: ["vegetarian", "gluten-free"],
    totalCarbonFootprint: 1.47,
    nutritionFacts: {
      calories: 230,
      protein: 9,
      carbs: 35,
      fat: 6,
      fiber: 5,
      sugar: 10
    }
  }
];

export const commonIngredients = [
  "apple", "avocado", "banana", "beef", "bell pepper", "bread", "broccoli", "butter", 
  "carrot", "cheese", "chicken", "chickpeas", "chocolate", "cinnamon", "cucumber", 
  "eggs", "flour", "garlic", "ginger", "honey", "kale", "lemon", "lettuce", 
  "milk", "mushroom", "oats", "olive oil", "onion", "orange", "pasta", "potato", 
  "quinoa", "rice", "salmon", "salt", "spinach", "strawberry", "sugar", "sweet potato", 
  "tomato", "tuna", "vanilla", "yogurt", "zucchini"
];
