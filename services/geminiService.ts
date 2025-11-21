import { Message, Attachment, ModuleType, ChatResponse } from "../types";
import { monitor, retrieveContext } from "./systemCore"; // Using local simulation core for fallback
import { GoogleGenAI } from "@google/genai";

// L5: System Configuration
const BACKEND_URL = 'http://localhost:8000/api/v1/chat';

/**
 * GATEWAY SERVICE
 * Acting as the interface between the Frontend User Interface and the Backend System.
 * Implements client-side Resilience (Fallback) and Telemetry.
 */

export const generateResponse = async (
  currentHistory: Message[], 
  newMessage: string, 
  attachments: Attachment[],
  currentModule: ModuleType
): Promise<{ text: string, latency: number, usedRAG: boolean }> => {
  
  const startTime = Date.now();

  try {
    // 1. Construct Payload for Backend (L5 Contract)
    const payload = {
        message: newMessage,
        history: currentHistory.map(m => ({ role: m.role, text: m.text })),
        module: currentModule,
        attachments: attachments.map(a => ({
            name: a.name,
            mime_type: a.mimeType,
            data: a.data
        }))
    };

    let data: ChatResponse;

    // 2. Attempt Connection to Python Backend (Flow)
    try {
        // We use a timeout to fail fast and switch to simulation if backend is absent
        const controller = new AbortController();
        // Increased timeout to 5000ms to allow for cold starts on local backend
        const id = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }
        data = await response.json();

    } catch (e) {
        console.warn("Backend unreachable, activating Client-Side Simulation (Systems Thinking Mode).");
        
        // --- FALLBACK SIMULATION (Resilience Strategy) ---
        // This ensures the app remains functional for the user even without the Python backend running.
        
        // 1. Local RAG (Flow)
        const context = retrieveContext(newMessage);
        
        // 2. Local LLM Call (Flow)
        if (!process.env.API_KEY) {
           throw new Error("Missing API Key for Simulation");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemPrompt = `You are an expert AI Tutor teaching ${currentModule === ModuleType.PYTHON ? 'Python' : 'Prompt Engineering'}.
        
        [SYSTEMS THINKING CONTEXT]
        ${context}
        
        [INSTRUCTIONS]
        - Explain concepts using Systems Thinking analogies (Stocks, Flows, Loops).
        - If RAG context is present, explicitly reference it.
        - Be concise and educational.
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: newMessage,
            config: {
                systemInstruction: systemPrompt
            }
        });

        data = {
            text: result.text || "No response generated.",
            latency_ms: Date.now() - startTime,
            used_rag: !!context,
            system_status: "DEGRADED (Simulation Mode)"
        };
    }

    // 3. Telemetry (Client Side View)
    monitor.recordTransaction(data.latency_ms, true);

    return { 
        text: data.text, 
        latency: Math.round(data.latency_ms), 
        usedRAG: data.used_rag 
    };

  } catch (error: any) {
    const latency = Date.now() - startTime;
    monitor.recordTransaction(latency, false, error.message);
    
    return { 
      text: `❌ **System Failure**: ${error.message || "Unknown error"}. \n\nPlease check your API Key and network connection.`, 
      latency, 
      usedRAG: false 
    };
  }
};
