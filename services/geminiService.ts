
import { GoogleGenAI, Type } from "@google/genai";
import { Appointment } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const parseNaturalLanguageAppointment = async (text: string): Promise<Partial<Appointment> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this CLINIC intake request: "${text}". 
      Current Date: ${new Date().toLocaleDateString()}. 
      Available Categories: General Practice, Cardiology, Dermatology, Pediatrics, Diagnostics.
      Map to the closest category. Map 'tests' or 'labs' to 'Diagnostics'.
      Return ONLY JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patientName: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            category: { type: Type.STRING },
            room: { type: Type.STRING },
            reports: { type: Type.STRING, description: "Extract any medical symptoms or reason for visit as a report" }
          },
          required: ["patientName", "date", "time"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    return null;
  }
};

// Fix: Added missing getSmartSummary function to provide operational insights
export const getSmartSummary = async (appointments: Appointment[]): Promise<string> => {
  try {
    if (appointments.length === 0) return 'Registry is currently empty.';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a brief (max 20 words) operational clinical summary based on these patient appointments: ${JSON.stringify(appointments)}`,
    });

    return response.text || 'Analysis complete.';
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    return 'Summary temporarily unavailable.';
  }
};
