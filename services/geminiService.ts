import { GoogleGenAI } from "@google/genai";

// Lazy initialization - only create client when API key is available
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key not found. AI features will be disabled.");
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
}

export const generateVibeCheck = async (productTitle: string, baseDesc: string): Promise<string> => {
  const ai = getAIClient();
  
  // If no API key, return a default description
  if (!ai) {
    return "The ultimate protection for your daily driver. Sleek, durable, and ready for anything. 📱✨";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a trendy Gen-Z copywriter for a high-end dropshipping phone case brand called "CaseDrop". 
      
      Write a short, punchy, and "hype" product description (max 2 sentences) for a phone case named "${productTitle}". 
      Base details: ${baseDesc}. 
      
      Use emojis. Make it sound like a "must-have" fashion accessory. Avoid being cringey, keep it cool and minimal.`,
    });

    return response.text || "This case is just built different. Protect your tech in style. 📱✨";
  } catch (error) {
    console.error("Failed to generate vibe check:", error);
    return "The ultimate protection for your daily driver. Sleek, durable, and ready for anything.";
  }
};