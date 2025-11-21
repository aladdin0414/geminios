import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the Gemini API client
// We safely access process.env to avoid crashing in environments where process is undefined (like Vite default)
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey });

export interface GeminiChatSession {
  chat: Chat;
}

/**
 * Creates a new chat session with the Gemini 2.5 Flash model.
 */
export const createChatSession = (): GeminiChatSession => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are Gemini, a helpful and intelligent AI assistant running inside a web-based macOS simulation called GeminiOS. Keep your responses concise, helpful, and formatted nicely with Markdown when appropriate.",
    },
  });
  return { chat };
};

/**
 * Sends a message to the model and yields chunks of the response text.
 */
export async function* sendMessageStream(
  session: GeminiChatSession,
  message: string
): AsyncGenerator<string, void, unknown> {
  try {
    const result = await session.chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      // Access the text property directly as per guidelines
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "⚠️ I encountered an error connecting to the neural network. Please check your connection or API key.";
  }
}