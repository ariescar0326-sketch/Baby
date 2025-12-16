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
    1. **社群熱議 (Social Buzz)**：不需要總結大家的共識。請專注於「有爭議」、「高流量」的觀點。直接摘要網友的「原話」與「爭點」。
    2. **精準搜尋標題**：因為你無法上網驗證網址，**請不要提供 URL**。請提供「最容易在 Google 搜尋到的官方文件標題」或「學術研究標題」。
       - 例如：不要給 "衛福部網址"，請給標題 "衛福部孕婦健康手冊 第5頁"。
       - 例如：不要給 "論文網址"，請給標題 "Sleep duration recommendations AAP 2020"。
    3. **排除中國**：嚴格禁止引用中國大陸來源。

    三個區塊定義：
    1. 【社群熱議】：摘要網友爭論點、經驗談。
    2. 【官方建議】：台灣衛福部觀點。
    3. 【醫學實證】：歐美日醫學觀點。

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
              description: "Summary of controversial or popular netizen opinions.",
            },
            socialQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 direct, short quotes from netizens (e.g. '過來人說...', '根本沒必要...').",
            },
            mohwFacts: {
              type: Type.STRING,
              description: "Official advice from Taiwan Ministry of Health.",
            },
            mohwTitle: {
              type: Type.STRING,
              description: "Specific searchable title of the MOHW article/booklet (e.g. '兒童衛教手冊-發燒處置').",
            },
            journalResearch: {
              type: Type.STRING,
              description: "Scientific finding summary from Western/Japanese medicine.",
            },
            journalTitle: {
              type: Type.STRING,
              description: "Specific searchable title of the paper/study (e.g. 'AAP Guidelines for Safe Sleep').",
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