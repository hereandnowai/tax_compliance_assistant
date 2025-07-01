
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters, GroundingChunk, Chat } from "@google/genai";
import { GEMINI_MODEL_NAME, TAX_ASSISTANT_SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the process.env.API_KEY environment variable.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface GeminiResponse {
  text: string;
  references?: Array<{ title: string; uri: string }>;
}

export const askGemini = async (
  promptText: string, 
  useDefaultSystemInstruction: boolean = true, 
  useSearchGrounding: boolean = false,
  customSystemInstruction?: string | null 
): Promise<GeminiResponse> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. API_KEY might be missing.");
  }

  const requestPayload: GenerateContentParameters = {
    model: GEMINI_MODEL_NAME,
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    config: {},
  };

  if (requestPayload.config) {
    if (customSystemInstruction) {
      requestPayload.config.systemInstruction = customSystemInstruction;
    } else if (useDefaultSystemInstruction) {
      requestPayload.config.systemInstruction = TAX_ASSISTANT_SYSTEM_INSTRUCTION;
    }

    if (useSearchGrounding) {
      requestPayload.config.tools = [{googleSearch: {}}];
      delete requestPayload.config.responseMimeType; 
    }
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent(requestPayload);
    const text = response.text;
    
    let references: Array<{ title: string; uri: string }> | undefined = undefined;
    if (useSearchGrounding && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        references = response.candidates[0].groundingMetadata.groundingChunks
            .map((chunk: GroundingChunk) => chunk.web)
            .filter(webChunk => webChunk?.uri && webChunk?.title)
            .map(webChunk => ({ title: webChunk!.title!, uri: webChunk!.uri! }));
    }

    return { text, references };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("The provided API key is not valid. Please check your API_KEY environment variable.");
        }
         throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};


export const streamGeminiChat = async (
  promptText: string, 
  history: Array<{role: string, parts: Array<{text: string}>}>,
  onChunk: (chunkText: string, isFinal: boolean, references?: Array<{ title: string; uri: string }>) => void,
  onError: (errorMessage: string) => void,
  useDefaultSystemInstruction: boolean = true,
  useSearchGrounding: boolean = false,
  customSystemInstruction?: string | null
) => {
  if (!ai) {
    onError("Gemini API client is not initialized. API_KEY might be missing.");
    return;
  }
  
  const chatConfig: GenerateContentParameters['config'] = {};

  if (customSystemInstruction) {
    chatConfig.systemInstruction = customSystemInstruction;
  } else if (useDefaultSystemInstruction) {
    chatConfig.systemInstruction = TAX_ASSISTANT_SYSTEM_INSTRUCTION;
  }

  if (useSearchGrounding) {
    chatConfig.tools = [{googleSearch: {}}];
    delete chatConfig.responseMimeType; 
  }

  const chat: Chat = ai.chats.create({
    model: GEMINI_MODEL_NAME,
    config: chatConfig,
    history: history,
  });

  try {
    const stream = await chat.sendMessageStream({message: promptText});
    let finalReferences: Array<{ title: string; uri: string }> | undefined = undefined;

    for await (const chunk of stream) { 
      if (useSearchGrounding && chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        finalReferences = chunk.candidates[0].groundingMetadata.groundingChunks
            .map((gc: GroundingChunk) => gc.web)
            .filter(webChunk => webChunk?.uri && webChunk?.title)
            .map(webChunk => ({ title: webChunk!.title!, uri: webChunk!.uri! }));
      }
      onChunk(chunk.text, false, finalReferences); 
    }
    onChunk("", true, finalReferences); 
  } catch (error) {
     console.error("Error streaming Gemini API chat:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             onError("The provided API key is not valid. Please check your API_KEY environment variable.");
        } else {
            onError(`Gemini API stream request failed: ${error.message}`);
        }
    } else {
        onError("An unknown error occurred while streaming from the Gemini API.");
    }
  }
};