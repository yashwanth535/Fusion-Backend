import generateRecipe from "../config/geminiapi.js";

export const generateRecipeContent = async (req, res) => {
    const { topic, cuisine, wordCount, cookingTime, servings,image, difficulty } = req.body;

    // Fixed property names to match client-side (wordCount instead of wordcount)
    if (!topic || !cuisine || !wordCount || !cookingTime || !servings || !difficulty) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `Generate a detailed recipe for "${topic}", a dish from "${cuisine}" cuisine. The recipe should be approximately ${wordCount} words long, with a total cooking time of ${cookingTime}. It should serve ${servings} people and have a difficulty level of "${difficulty}".

Ensure the response follows this **exact JSON format**:
{
  "title": "<Dish Name>",
  "description": "<A well-written introduction that highlights the dish's flavors, significance, and why it's special.>",
  "image": "${image}",
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
        // Log the request to help with debugging
        console.log(`Generating recipe for: ${topic} (${cuisine})`);
        
        const rawResponse = await generateRecipe(prompt);
        
        // Improved JSON extraction with better error handling
        let jsonString = rawResponse;
        
        // Check if response is wrapped in code blocks
        const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }
        
        // Try to clean the string before parsing
        jsonString = jsonString.trim();
        
        let recipe;
        try {
            recipe = JSON.parse(jsonString);
            
            // Validate that the parsed object has the required fields
            if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
                throw new Error("Missing required fields in recipe response");
            }
            
            // Return the recipe with success status
            return res.status(200).json(recipe);
            
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.log("Raw response:", rawResponse);
            console.log("Attempted to parse:", jsonString);
            
            return res.status(500).json({ 
                message: "Invalid JSON response from Gemini API", 
                error: parseError.message,
                rawResponse: rawResponse.substring(0, 200) + "..." // First 200 chars for debugging
            });
        }
    } catch (error) {
        console.error("API call error:", error);
        
        // Use return to prevent multiple responses
        return res.status(500).json({ 
            message: "Error generating recipe", 
            error: error.message 
        });
    }
};