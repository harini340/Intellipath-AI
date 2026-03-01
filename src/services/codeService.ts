import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getCodeFeedback(problem: string, code: string, language: string) {
  const prompt = `
    You are an expert coding mentor. Review the following code for the given problem.
    
    Problem: ${problem}
    Language: ${language}
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a JSON response with:
    {
      "feedback": "A brief overall feedback",
      "suggestions": ["list of specific improvements"],
      "complexity": {
        "time": "e.g. O(n)",
        "space": "e.g. O(1)"
      },
      "score": 85 // out of 100
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting code feedback:", error);
    return { feedback: "Could not generate feedback at this time.", suggestions: [], score: 0 };
  }
}
