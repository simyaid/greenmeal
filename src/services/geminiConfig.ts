import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API key
const GEMINI_API_KEY = "YOUR_API_KEY";

// Create the Gemini instance
const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);

// Test the API connection
const testApiConnection = async () => {
  try {
    console.log("Testing API connection...");
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
    });
    
    const response = await result.response;
    console.log("API Connection Test Response:", response.text());
    return true;
  } catch (error) {
    console.error("API Connection Test Failed:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return false;
  }
};

// Function to generate a weekly meal plan
export const generateMealPlan = async (dietPreferences: string[], ingredients: string[]) => {
  try {
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `You are a sustainable meal planning assistant. Create a weekly meal plan following these requirements:

    Diet preferences: ${dietPreferences.join(', ') || 'No specific preferences'}
    Available ingredients: ${ingredients.join(', ')}
    
    Please provide a JSON response in the following format:
    {
      "mealPlan": [
        {
          "day": "Monday",
          "breakfast": {
            "name": "Meal name",
            "carbonFootprint": number,
            "ingredients": ["ingredient1", "ingredient2"],
            "recipeId": "unique-id"
          },
          "lunch": {
            "name": "Meal name",
            "carbonFootprint": number,
            "ingredients": ["ingredient1", "ingredient2"],
            "recipeId": "unique-id"
          },
          "dinner": {
            "name": "Meal name",
            "carbonFootprint": number,
            "ingredients": ["ingredient1", "ingredient2"],
            "recipeId": "unique-id"
          }
        }
        // Repeat for all days of the week
      ],
      "shoppingList": {
        "produce": ["item1", "item2"],
        "pantry": ["item1", "item2"],
        "dairy": ["item1", "item2"],
        "other": ["item1", "item2"]
      }
    }

    Ensure the response is valid JSON and includes all 7 days of the week.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan. Please try again.");
  }
};

// Function to generate a recipe
export const generateRecipe = async (ingredients: string[], preferences: string[]) => {
  try {
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Create a sustainable recipe using these ingredients:
    ${ingredients.join(', ')}
    
    Additional preferences: ${preferences.join(', ') || 'None'}
    
    Please provide:
    1. Recipe name
    2. Ingredients list with quantities
    3. Step-by-step instructions
    4. Estimated preparation and cooking time
    5. Tips for reducing food waste
    6. Estimated carbon footprint
    
    Format the response in a clear, easy-to-read way.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Failed to generate recipe. Please try again.";
  }
};

// Function to analyze a recipe
export const analyzeRecipe = async (recipe: string) => {
  try {
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Analyze this recipe for sustainability and provide recommendations:
    ${recipe}
    
    Please provide:
    1. Environmental impact assessment
    2. Suggestions for more sustainable alternatives
    3. Tips for reducing food waste
    4. Estimated carbon footprint
    5. Ways to make the recipe more eco-friendly
    
    Format the response in a clear, easy-to-read way.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing recipe:", error);
    return "Failed to analyze recipe. Please try again.";
  }
};

// Function to generate a shopping list
export const generateShoppingList = async (mealPlan: string) => {
  try {
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Create an optimized shopping list for this meal plan:
    ${mealPlan}
    
    Please provide:
    1. A categorized shopping list
    2. Tips for buying sustainable ingredients
    3. Suggestions for reducing packaging waste
    4. Estimated total cost
    5. Storage recommendations
    
    Format the response in a clear, easy-to-read way.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return "Failed to generate shopping list. Please try again.";
  }
};

// Function to generate sustainability tips
export const generateSustainabilityTips = async (context: string) => {
  try {
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Provide sustainability tips for:
    ${context}
    
    Please provide:
    1. General sustainability practices
    2. Specific tips for the given context
    3. Ways to reduce environmental impact
    4. Resources for learning more
    
    Format the response in a clear, easy-to-read way.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating sustainability tips:", error);
    return "Failed to generate sustainability tips. Please try again.";
  }
};

// Function to calculate carbon footprint for a recipe
export const calculateCarbonFootprint = async (recipe: { name: string; ingredients: { name: string }[] }) => {
  try {
    console.log("Starting carbon footprint calculation for recipe:", recipe.name);
    
    // Test API connection first
    const isConnected = await testApiConnection();
    if (!isConnected) {
      console.error("Failed to connect to Gemini API");
      return 0;
    }

    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
    
    // Prepare the prompt for Gemini
    const prompt = `      Calculate the approximate carbon footprint for the following recipe:
      
      Recipe: ${recipe.name}
      Ingredients: ${recipe.ingredients.map(ing => ing.name).join(', ')}
      
      Please provide a single number representing the total carbon footprint in kg CO2e.
      Consider the following factors:
      1. Production and transportation of ingredients
      2. Processing and packaging
      3. Cooking method and energy usage
      4. Food waste potential
      
      Return only the number, no explanation or units.
    `;

    console.log("Sending prompt to Gemini:", prompt);
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini response:", text);
    
    // Extract the number from the response using a more robust regex
    const match = text.match(/\d+\.?\d*/);
    console.log("Extracted number:", match?.[0]);
    
    const carbonFootprint = match ? parseFloat(match[0]) : 0;
    console.log("Final carbon footprint:", carbonFootprint);
    
    if (isNaN(carbonFootprint)) {
      console.error("Failed to parse carbon footprint from response:", text);
      return 0;
    }
    
    // Ensure the value is within the expected range
    if (carbonFootprint < 0.1 || carbonFootprint > 10.0) {
      console.error("Carbon footprint value out of expected range:", carbonFootprint);
      return 0;
    }
    
    return carbonFootprint;
  } catch (error) {
    console.error("Error calculating carbon footprint:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return 0;
  }
};

const sustainableAdvicePrompt = (dietType: string, ingredients: string[]) => `
Given the user's diet type (${dietType}) and these ingredients: ${ingredients.join(", ")}, 
return ONE concise, actionable tip that helps reduce carbon footprint and food waste.
Focus on exactly ONE of these themes: seasonality, proper storage, energy-efficient cooking, or creative use of scraps.
Return ONLY the single tip as a clear, practical sentence. No explanations, no additional text.
Example format: "Store leftover vegetables in airtight containers in the freezer to extend their shelf life and reduce food waste."
`;

export const getSustainableAdvice = async (dietType: string, ingredients: string[]): Promise<string> => {
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = sustainableAdvicePrompt(dietType, ingredients);
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const response = await result.response;
  return response.text().trim();
};

export default gemini; 
