import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  // In Vercel/Build environments, process.env.API_KEY is replaced by the string value.
  // We use a safe accessor to prevent ReferenceErrors if process is missing (though polyfilled in index.tsx).
  let apiKey = '';
  
  try {
    // Check purely for the variable replacement
    if (process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    // Fallback: If process.env access fails, we might be in a very strict env.
    // In most builds, the above line is compiled to "if ('xyz') ..." so it works.
    console.warn("API Key access warning:", e);
  }
  
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION_COACH = `
당신은 '리블룸(ReBloom)'이라는 앱의 AI 코치입니다. 
주 사용자는 '쉬었음' 기간이 길거나 은둔형 외톨이 경향이 있는, 다시 사회로 나가거나 공부를 시작하고 싶어하는 사람들입니다.
당신의 역할:
1. 사용자의 감정에 깊이 공감하고 비판하지 않습니다.
2. 무리한 조언보다는 '아주 작은 실천(Micro-step)'을 격려합니다.
3. 따뜻하고 부드러운 말투(존댓말)를 사용하세요.
4. 사용자가 공부 의지를 보이면 칭찬하고, 아주 쉬운 5분 공부법 등을 제안하세요.
`;

export const getAICoachingResponse = async (message: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text || "죄송해요, 지금은 잠시 생각이 정리되지 않네요. 잠시 후 다시 말을 걸어주세요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "연결이 불안정해요. 잠시 쉬었다가 다시 이야기 나눠요.";
  }
};

export const generateMicroTasks = async (category: string, mood: string): Promise<Array<{text: string, difficulty: string}>> => {
  try {
    const ai = getAIClient();
    const prompt = `
    사용자의 현재 기분: ${mood}
    관심 카테고리: ${category}
    
    무기력함을 느끼거나 공부/사회생활을 다시 시작하려는 사람을 위해, 
    해당 카테고리에서 실행 가능한 '아주 작은 미션(Micro-habit)' 3가지를 추천해주세요.
    실패에 대한 두려움이 없도록 매우 쉬워야 합니다.
    
    JSON 형식으로 반환하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "Task description" },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
            },
            required: ["text", "difficulty"]
          }
        }
      }
    });
    
    let jsonText = response.text || "[]";
    // Strip markdown code blocks if present (prevents runtime crashes)
    jsonText = jsonText.replace(/^```json\s*/, "").replace(/^```/, "").replace(/```$/, "").trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Task Gen Error:", error);
    return [
      { text: "창문 열고 심호흡 3번 하기", difficulty: "easy" },
      { text: "책상 정리 1분만 하기", difficulty: "easy" },
      { text: "물 한 잔 마시기", difficulty: "easy" }
    ];
  }
};