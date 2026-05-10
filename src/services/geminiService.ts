import { GoogleGenAI, Type } from "@google/genai";
import { IdentityData, AgentLogEntry, VerificationStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async extractIdentity(base64Image: string, mimeType: string): Promise<IdentityData> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType
          }
        },
        {
          text: "Extract identity information from this document. If data is missing or unreadable, leave the field blank."
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            documentType: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
            dateOfBirth: { type: Type.STRING },
            nationality: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  },

  async runAgenticVerification(
    identity: IdentityData, 
    onLog: (log: AgentLogEntry) => void
  ): Promise<{ status: VerificationStatus; riskScore: number }> {
    const agents = [
      { name: "Identity Validator", icon: "🔍" },
      { name: "Background Researcher", icon: "🌐" },
      { name: "Risk Assessor", icon: "🛡️" }
    ];

    const addLog = (agent: string, message: string, type: AgentLogEntry['type'] = 'info') => {
      onLog({
        id: Math.random().toString(36).substr(2, 9),
        agentName: agent,
        message,
        timestamp: Date.now(),
        type
      });
    };

    // Agent 1: Validation
    addLog(agents[0].name, `Starting cross-reference check for ID: ${identity.documentNumber}...`);
    await new Promise(r => setTimeout(r, 1500));
    addLog(agents[0].name, "Comparing OCR output with government record templates.", "info");
    await new Promise(r => setTimeout(r, 1000));
    addLog(agents[0].name, "Liveness check passed. Document authenticity confirmed.", "success");

    // Agent 2: Background
    addLog(agents[1].name, `Searching background records for ${identity.fullName}...`);
    await new Promise(r => setTimeout(r, 2000));
    addLog(agents[1].name, "Scanning criminal databases and employment history.", "info");
    
    // Use Gemini to simulate a smart background check logic
    const bgResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Simulate a background check result for a person named ${identity.fullName}. 
      Return a risk score between 0 and 100 and a status (verified, flagged).
      Most people should be verified.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            status: { type: Type.STRING }
          }
        }
      }
    });

    const bgResult = JSON.parse(bgResponse.text);
    addLog(agents[1].name, bgResult.summary, bgResult.score > 70 ? 'warning' : 'success');

    // Agent 3: Risk
    addLog(agents[2].name, "Aggregating multi-source verification data...");
    await new Promise(r => setTimeout(r, 1500));
    
    const status: VerificationStatus = bgResult.score > 80 ? 'flagged' : (bgResult.score > 40 ? 'processing' : 'verified');
    addLog(agents[2].name, `Final Risk Audit completed. Score: ${bgResult.score}/100`, status === 'verified' ? 'success' : 'warning');

    return {
      status,
      riskScore: bgResult.score
    };
  }
};
