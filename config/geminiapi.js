import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();


const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const generateRecipe = async (prompt) => {
    try {

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        })

        return response.data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('Error generating recipe:', error.response?.data || error.message);
        throw new Error('Failed to generate recipe.');
    }
}

export default generateRecipe;