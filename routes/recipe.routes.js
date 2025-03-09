import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { generateRecipeContent } from '../controller/recipe.controller.js';


const recipeRouter = Router();

recipeRouter.post('/generate', authorize, generateRecipeContent );

export default recipeRouter;