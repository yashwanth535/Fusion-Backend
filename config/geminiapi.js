import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';


dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log(GEMINI_API_KEY);

if(!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generateRecipe = async (prompt) => {
    try {

        const response = await model.generateContent(prompt);

        return response.response.text();
        
    } catch (error) {
        console.error('Error generating recipe:', error.response?.data || error.message);
        throw new Error('Failed to generate recipe.');
    }
}

export default generateRecipe;