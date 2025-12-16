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

  // No tools used, strict text generation
  const systemInstruction = `
    你是一個極簡主義的育兒資料整合助手。
    
    【任務目標】
    請針對問題「${topicQuery}」進行綜合回答。
    
    【資料來源模擬】
    請運用你的知識庫，模擬以下三類觀點：
    1. **社群熱議 (Social)**：模擬 PTT BabyMother, Dcard 親子板的常見網友經驗與留言。
    2. **官方衛教 (Official)**：依據 衛福部 (mohw), 國健署 (hpa) 的標準衛教資訊。
    3. **醫學實證 (Journal)**：依據 兒科醫學會、實證醫學的普遍共識。

    【輸出格式規則】
    請直接回傳一個純 JSON 物件，不要使用 Markdown。
    {
      "socialQuotes": ["網友經驗1", "網友經驗2"],
      "mohwFacts": "官方/醫生建議 (80字內)",
      "journalResearch": "研究/學術觀點 (80字內)"
    }

    - **社群熱議**：請列出 2-3 句具體的「網友經驗談」或「崩潰心聲」，口語化。
    - **內容長度**：精簡扼要，讓忙碌的爸媽一眼看完。
    - **排除中國用語**。
  `;

  const prompt = `階段：${stageLabel}。問題：${topicQuery}。請回傳 JSON 格式。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);

    return {
      socialQuotes: parsedData.socialQuotes || ["無相關討論"],
      mohwFacts: parsedData.mohwFacts || "無官方資料",
      journalResearch: parsedData.journalResearch || "無研究資料",
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      socialQuotes: ["資料讀取失敗"],
      mohwFacts: "資料讀取失敗",
      journalResearch: "資料讀取失敗"
    };
  }
};

export const fetchTrendingTopics = async (stageLabel: string, existingTitles: string[] = []): Promise<Topic[]> => {
  const ai = getAiClient();
  
  // Create a list of excluded titles to prevent duplicates
  const excludeList = existingTitles.slice(-20).join(", "); // Check against recent ones

  const systemInstruction = `
    你是一個育兒趨勢觀察家。
    請為「${stageLabel}」階段產生 **新的** 熱門話題。

    【排除清單】
    請 **絕對不要** 重複以下標題：
    ${excludeList}

    【標題規則】
    - **簡短**：**15個字以內**。
    - **口語化**：像是在問問題 (例：「這真的很重要嗎？」)。
    - **多樣性**：請包含「教育」、「心理」、「商品」等不同面向，不要只侷限於健康。

    【Tag 選項】
    '檢查', '健康', '衛教', '心理', '營養', '發展', '價值觀', '商品', '教育'

    【產出規則】
    - 產出 5 個 **不重複** 的新話題。
  `;

  const prompt = `
    請回傳 JSON Array。
    格式: [{"id": "...", "title": "...", "tag": "...", "queryPrompt": "..."}]
    
    id 使用隨機字串。
    queryPrompt 要精確。
    不要使用 Markdown。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    let text = response.text || "[]";
    const rawData = JSON.parse(text);
    return rawData.map((item: any) => ({
      ...item,
      tag: item.tag as TopicTag
    }));

  } catch (error) {
    console.error("Failed to fetch trending topics:", error);
    return []; 
  }
};