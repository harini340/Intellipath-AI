import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateLearningPath(assessmentData: any, profile: any) {
  const prompt = `
    Analyze the following assessment results and user profile to generate a personalized holistic learning path.
    
    User Profile:
    - Education: ${profile.education_level}
    - Career Goal: ${profile.career_goal}
    - Learning Preference: ${profile.learning_preference}
    - Weekly Commitment: ${profile.weekly_study_time} hours
    
    Assessment Results:
    ${JSON.stringify(assessmentData, null, 2)}
    
    Please provide a JSON response with the following structure:
    {
      "roadmap": [
        {
          "title": "Module Title",
          "description": "What they will learn",
          "category": "coding | aptitude | communication | soft-skills",
          "difficulty": "Beginner | Intermediate | Advanced",
          "resources": ["URL or resource name"],
          "estimated_hours": 5
        }
      ],
      "strengths": ["list of identified strengths"],
      "weaknesses": ["list of areas for improvement"],
      "difficulty_level": "Overall path difficulty",
      "summary": "A brief encouraging summary of the path"
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
    console.error("Error generating learning path:", error);
    throw error;
  }
}
