import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client with correct parameters
// Always use gemini-3-flash-preview for basic text tasks
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateServiceReport = async (
  serviceType: string,
  rawNotes: string,
  duration: number
): Promise<string> => {
  try {
    const prompt = `
      Você é um assistente inteligente do aplicativo "Help-Me".
      Gere um relatório amigável e profissional para o cliente sobre o serviço realizado.
      
      Tipo de Serviço: ${serviceType}
      Duração: ${duration} minutos
      Notas do Prestador (brutas): ${rawNotes}
      
      O tom deve ser confiável e atencioso. Se for um serviço de Pet, mencione o bem-estar do animal. Se for fila, mencione a eficiência.
      Seja conciso (máximo 3 frases).
    `;

    // Use generateContent with gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access .text property (not a method)
    return response.text || "Relatório gerado automaticamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar o relatório detalhado no momento.";
  }
};

export const getAIAssistantAdvice = async (
  query: string,
  context: 'PET' | 'QUEUE'
): Promise<string> => {
  try {
    const systemInstruction = context === 'PET' 
      ? "Você é um especialista em cuidados animais do app Help-Me Pet Care. Ajude o dono a escolher o melhor passeio."
      : "Você é um especialista em gestão de tempo do app Help-Me Fila & Espera. Ajude o usuário a economizar tempo.";

    // Use generateContent with gemini-3-flash-preview and system instruction in config
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction
      }
    });

    // Directly access .text property
    return response.text || "Sem sugestões no momento.";
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "Desculpe, estou indisponível agora.";
  }
};