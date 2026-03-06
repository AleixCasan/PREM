
import { GoogleGenAI } from "@google/genai";

export const getPerformanceAdvice = async (userName: string, prems: number, retryCount = 0): Promise<string> => {
  // SAFETY CHECK: Si no hay API KEY, devolvemos fallback inmediatamente.
  if (!process.env.API_KEY) {
    return '"El fútbol siempre debe ser un espectáculo." - Johan Cruyff';
  }

  try {
    // Siempre inicializamos dentro de la función para asegurar el uso de la API KEY más reciente si fuera necesario.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un sistema de inspiración para PREM ACADEMY. 
      Proporciona una frase célebre y motivadora de una leyenda del fútbol (jugador o entrenador histórico). 
      Debe ser corta, potente y estar en español. 
      Incluye siempre el nombre del autor. 
      Máximo 2 frases en total.`,
    });

    return response.text || '"El fútbol siempre debe ser un espectáculo." - Johan Cruyff';
  } catch (error: any) {
    console.error("Gemini Error (getPerformanceAdvice):", error);
    
    // Verificar si es un error de cuota (429)
    const errorStr = error.toString();
    const isQuotaError = errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || error.status === 429;

    if (isQuotaError && retryCount < 2) {
      // Backoff exponencial: 2s, 4s...
      const delay = Math.pow(2, retryCount) * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return getPerformanceAdvice(userName, prems, retryCount + 1);
    }

    return '"El fútbol no es una cuestión de vida o muerte, es mucho más que eso." - Bill Shankly';
  }
};
