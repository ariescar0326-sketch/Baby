import { GoogleGenAI, Type } from "@google/genai";
import { AdviceResult, Topic, TopicTag } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchParentingAdvice = async (stageLabel: string, topicQuery: string): Promise<AdviceResult> => {
  const ai = getAiClient();

  // Updated Instructions: No summary, strict quotes, no URLs (we use search).
  const systemInstruction = `
    你是一個極簡主義的育兒資料整合助手。
    
    【規則】
    1. **社群熱議**：
       - **嚴禁總結** (不要寫「網友認為...」)。
       - 只提供 **2-3 則最具代表性、犀利的網友留言原文** (Quotes)。
       - 繁體中文。
    2. **官方與實證**：
       - **極度精簡**：各 50 字以內。
       - **不要** 嘗試生成網址 (URL)，這會導致錯誤。
    3. **排除中國來源**。
  `;

  const prompt = `階段：${stageLabel}。問題：${topicQuery}。請輸出JSON。`;

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
            socialQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 direct short quotes from netizens.",
            },
            mohwFacts: {
              type: Type.STRING,
              description: "Very concise (max 50 words) official advice.",
            },
            mohwTitle: {
              type: Type.STRING,
              description: "Keywords or title for searching MOHW data.",
            },
            journalResearch: {
              type: Type.STRING,
              description: "Very concise (max 50 words) scientific finding.",
            },
            journalTitle: {
              type: Type.STRING,
              description: "Keywords or title of the research paper.",
            },
          },
          required: ["socialQuotes", "mohwFacts", "journalResearch", "mohwTitle", "journalTitle"],
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
      socialQuotes: ["暫時無法取得留言"],
      mohwFacts: "資料讀取失敗",
      mohwTitle: topicQuery,
      journalResearch: "資料讀取失敗",
      journalTitle: topicQuery
    };
  }
};

// New function to fetch trending topics using Google Search
export const fetchTrendingTopics = async (stageLabel: string): Promise<Topic[]> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    你是一個育兒趨勢觀察家。
    請搜尋台灣論壇 (PTT, Dcard, Mobile01) 關於「${stageLabel}」的熱門話題。
    並嚴格依照以下邏輯判斷 Tag (勿只看關鍵字，要看問題本質)：

    【Tag 邏輯判斷】
    1. **檢查 (Checkup)**：
       - 關鍵：**進醫院**、**醫療檢驗**、**數據指標**。
       - 包含：產檢項目(高層次, 羊穿, 糖水)、疫苗接種、生長曲線(百分位)、黃疸指數、聽力篩檢。
    2. **健康 (Health)**：
       - 關鍵：**生病**、**居家症狀**、**身體不適**。
       - 包含：發燒、腸絞痛、感冒、紅屁股、孕吐、出血、水腫、胎動感覺、大便顏色。
    3. **衛教 (Health Edu)**：
       - 關鍵：**預防知識**、**名詞定義**、**科學常識**。
       - 包含：高齡產婦定義、排卵期計算、近視預防、安全睡眠環境。
    4. **發展 (Development)**：
       - 關鍵：**身體技能**、**里程碑**、**非疾病變化**。
       - 包含：翻身、長牙(非發燒部分)、學走、語言說話、頭型矯正、戒尿布。
    5. **商品 (Merchandise)**：
       - 關鍵：**花錢**、**買什麼**、**費用**。
       - 包含：試管費用、待產包清單、推車汽座推薦、保險。
    6. **價值觀 (Values)**：
       - 關鍵：**家庭糾紛**、**心理建設**、**選擇題**。
       - 包含：是否做試管、婆媳育兒觀念、月子中心錢誰出。

    【產出規則】
    - 優先抓取 **檢查** 與 **健康** 類的急迫話題 (權重 x2)。
    - 減少 商品 與 價值觀 話題。
    - 產出 8 個 Topic。
  `;

  const prompt = `
    搜尋並回傳 JSON Array。
    格式: [{"id": "...", "title": "...", "tag": "...", "queryPrompt": "..."}]
    
    Tag 選項: '檢查', '健康', '衛教', '心理', '營養', '發展', '價值觀', '商品'。
    id 使用隨機字串。
    title 要吸睛。
    queryPrompt 要精確 (用於 Google 搜尋)。
    不要使用 Markdown。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
        systemInstruction: systemInstruction,
        // responseMimeType: "application/json", // REMOVED: Not supported with tools
      }
    });

    let text = response.text || "[]";
    
    // Manual Cleanup for JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Find the array part if there is extra text
    const arrayStart = text.indexOf('[');
    const arrayEnd = text.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      text = text.substring(arrayStart, arrayEnd + 1);
    }

    const rawData = JSON.parse(text);
    
    // Validate tag casting
    return rawData.map((item: any) => ({
      ...item,
      tag: item.tag as TopicTag
    }));

  } catch (error) {
    console.error("Failed to fetch trending topics:", error);
    return []; 
  }
};