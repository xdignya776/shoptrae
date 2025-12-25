import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVibeCheck = async (productTitle: string, baseDesc: string): Promise<string> => {
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