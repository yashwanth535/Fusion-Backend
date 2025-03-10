import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { deleteRecipe, fetchRecipe, fetchUserRecipes, generateRecipeContent, getAllRecipes, saveRecipe, getCategoryStats } from '../controller/recipe.controller.js';


const recipeRouter = Router();

recipeRouter.post('/generate', authorize, generateRecipeContent );

recipeRouter.post('/save', authorize, saveRecipe );

recipeRouter.get('/fetch/:id', fetchRecipe );

recipeRouter.get('/fetch/user/:id',authorize, fetchUserRecipes );

recipeRouter.get('/fetch/', getAllRecipes );

recipeRouter.delete('/delete/:id', authorize, deleteRecipe );

recipeRouter.get('/categories/stats', getCategoryStats);

export default recipeRouter;