import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  prepTime: {
    type: Number, // Time in minutes
    required: true,
  },
  cookTime: {
    type: Number, // Time in minutes
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [String], // Array of ingredient strings
    required: true,
  },
  instructions: {
    type: [String], // Array of step-by-step instructions
    required: true,
  },
  imageURL: {
    type: String, // URL of the recipe image
    required: false,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
