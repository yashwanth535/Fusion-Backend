import generateRecipe from "../config/geminiapi.js";
import Recipe from "../models/recipe.scheme.js";

export const generateRecipeContent = async (req, res) => {
    const { topic, cuisine, wordCount, cookingTime, servings, difficulty } = req.body;

    // Fixed property names to match client-side (wordCount instead of wordcount)
    if (!topic || !cuisine || !wordCount || !cookingTime || !servings || !difficulty) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `Generate a detailed recipe for "${topic}", a dish from "${cuisine}" cuisine. The recipe should be approximately ${wordCount} words long, with a total cooking time of ${cookingTime}. It should serve ${servings} people and have a difficulty level of "${difficulty}".

Ensure the response follows this **exact JSON format**:
{
  "title": "<Dish Name>",
  "description": "<A well-written introduction that highlights the dish's flavors, significance, and why it's special.>",
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "mealType": "<Categorize Type of meal, e.g., breakfast, lunch, dinner>",
  "category": "<Categorise this recipe into Main course, dessert, etc.>",
  "prepTime": "<Time required for preparation, in minutes>",
  "cookTime": "<Time required for cooking, in minutes>",
  "servings": <Number of people this recipe serves>,
  "ingredients": [
    "<List of ingredients with precise measurements, e.g., '2 cups all-purpose flour'>",
    "<Each ingredient should be in string format>"
  ],
  "instructions": [
    "<Step-by-step cooking instructions, clearly written in string format>",
    "<Each step should be a separate string>"
  ]
}

Guidelines:
- **Do not include additional text or explanations** outside the JSON.
- **Use natural language** for the description and instructions.
- Ensure the **ingredients have proper measurements**.
- Steps should be **concise, clear, and numbered sequentially**.
- The recipe should **maintain logical flow** from preparation to completion.

Return only the structured JSON response as specified above.
`;

    try {

        console.log(`Generating recipe for: ${topic} (${cuisine})`);
        
        const rawResponse = await generateRecipe(prompt);
        
        let jsonString = rawResponse;
        
        const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }
        
        // Try to clean the string before parsing
        jsonString = jsonString.trim();
        
        let recipe;
        try {
            recipe = JSON.parse(jsonString);
            
            if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
                throw new Error("Missing required fields in recipe response");
            }

            return res.status(200).json(recipe);
            
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.log("Raw response:", rawResponse);
            console.log("Attempted to parse:", jsonString);
            
            return res.status(500).json({ 
                message: "Invalid JSON response from Gemini API", 
                error: parseError.message,
                rawResponse: rawResponse.substring(0, 200) + "..."
            });
        }
    } catch (error) {
        console.error("API call error:", error);
        return res.status(500).json({ 
            message: "Error generating recipe", 
            error: error.message 
        });
    }
};

export const saveRecipe = async (req, res) => {
    try {

        const { title, description, difficulty, cuisine, mealType, category, prepTime, cookTime, servings, ingredients, instructions, imageURL, isPublished } = req.body;

        if (!title || !description || !difficulty || !cuisine || !mealType || !category || !prepTime || !cookTime || !servings || !ingredients || !instructions || !isPublished) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        if(!req.user){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newRecipe = new Recipe({
            title,
            description,
            difficulty,
            cuisine,
            mealType,
            category,
            prepTime,
            cookTime,
            servings,
            ingredients,
            instructions,
            imageURL,
            uploadedBy: req.user.id,
            isPublished: isPublished || false,
          });

          await newRecipe.save();

          res.status(201).json({
            sucess: true,
            data: newRecipe
          });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const fetchRecipe = async (req, res) => {
    try {

        const id = req.params.id;

        const recipe = await Recipe.findById(id);

        if(!recipe){
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(200).json({
            success: true,
            data: recipe
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}