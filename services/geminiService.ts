import { GoogleGenAI, Type } from "@google/genai";
import { AdviceResult } from '../types';

export const fetchParentingAdvice = async (stageLabel: string, topicQuery: string): Promise<AdviceResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    你是一個極簡主義的育兒資料整合助手。
    針對使用者的問題，請提供三個獨立的資訊來源區塊。
    
    【重要規則】
    1. **社群熱議 (Social Buzz)**：
       - **不要做總結**，不要說「網友普遍認為...」。
       - **不要使用斜體**，不要使用「」符號。
       - 直接呈現觀點，越直白越好。
       - 如果可能，請提供一個代表性的討論串網址 (如 PTT 或 Dcard)。
    2. **官方與實證摘要 (MOHW/Journal)**：
       - **極度精簡**：內容請縮減至 **50字以內** 的重點摘要。
       - **直接連結**：請盡最大努力提供 **具體的網址 (URL)**。
         - 如果是衛福部，嘗試提供 PDF 或頁面連結。
         - 如果是論文，提供 DOI 連結或 PubMed 連結。
         - 如果真的找不到 URL，才留空。
    3. **排除中國**：嚴格禁止引用中國大陸來源。

    請使用繁體中文 (Traditional Chinese, Taiwan) 回答。
  `;

  const prompt = `階段：${stageLabel}。
  問題：${topicQuery}。
  請輸出JSON。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            socialBuzz: {
              type: Type.STRING,
              description: "Raw opinion summary without conclusion words.",
            },
            socialQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 direct short quotes.",
            },
            socialUrl: {
               type: Type.STRING,
               description: "A specific URL to a PTT/Dcard/Facebook discussion thread if found. Or empty.",
            },
            mohwFacts: {
              type: Type.STRING,
              description: "Very concise (max 50 words) official advice.",
            },
            mohwTitle: {
              type: Type.STRING,
              description: "Title of the MOHW source.",
            },
            mohwUrl: {
              type: Type.STRING,
              description: "Direct URL to the MOHW page/PDF if possible.",
            },
            journalResearch: {
              type: Type.STRING,
              description: "Very concise (max 50 words) scientific finding.",
            },
            journalTitle: {
              type: Type.STRING,
              description: "Title of the paper.",
            },
            journalUrl: {
              type: Type.STRING,
              description: "Direct URL (DOI/PubMed) to the paper if possible.",
            },
          },
          required: ["socialBuzz", "socialQuotes", "mohwFacts", "journalResearch", "mohwTitle", "journalTitle"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    return JSON.parse(text) as AdviceResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      socialBuzz: "讀取社群資料失敗。",
      socialQuotes: ["無法取得網友留言"],
      mohwFacts: "讀取官方資料失敗。",
      journalResearch: "讀取期刊資料失敗。"
    };
  }
};