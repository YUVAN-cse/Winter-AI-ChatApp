import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';

async function main(prop) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const model = 'gemini-3-flash-preview';

    const contents = [
        {
            role: 'user',
            parts: [{ text: prop }],
        },
    ];

    const result = await ai.models.generateContent({ model, contents });
    const text = result.candidates[0].content.parts[0].text;
    return text;
}

export default main;
