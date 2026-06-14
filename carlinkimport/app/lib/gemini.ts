// Google Gemini analysis of vehicle data → Georgian buyer report. Server-side only.
import { GoogleGenAI } from "@google/genai";
import type { VehicleData } from "./vin";

// Plain "gemini-3.1-flash" is not exposed for text generateContent — the 3.1
// flash text model ships as "gemini-3.1-flash-lite".
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export type AnalysisSection = { title: string; body: string };

export type VinAnalysis = {
  riskScore: number; // 0-100 (higher = riskier)
  riskLabel: string; // "დაბალი" | "საშუალო" | "მაღალი"
  summary: string; // short headline
  narrative: string; // full readable analysis
  sections: AnalysisSection[];
  checklist: string[];
};

const SYSTEM = `შენ ხარ გამოცდილი ავტო-ექსპერტი, რომელიც ემსახურება ქართველ მყიდველებს, ვინც
მანქანებს ამერიკის აუქციონებიდან (Copart/IAAI) იღებს. მოგეცემა მანქანის ტექნიკური მონაცემები
(VIN-ის დეშიფრაცია), გაწვევები (recalls) და აუქციონის ისტორია (თუ არსებობს). შენი ამოცანაა
დაწერო გულწრფელი, კონკრეტული რისკის ანალიზი და ყიდვის რჩევები ქართულ ენაზე.

წესები:
- დაწერე მხოლოდ ქართულად, მარტივი და გასაგები ენით.
- იყავი კონკრეტული ამ მოდელის/წლის/ძრავის მიხედვით: ცნობილი ხარვეზები, საიმედოობა, რა უნდა
  შემოწმდეს ყიდვამდე.
- ახსენი გაწვევები (recalls) მარტივ ქართულად — რას ნიშნავს და რამდენად სერიოზულია.
- თუ history მონაცემი არსებობს (history.available=true), აუცილებლად გააანალიზე ეს კონკრეტული
  მანქანის ისტორია: title-ის ბრენდები (salvage/flood/junk) "brands"-დან, აუქციონის დაზიანება
  "salvage"-დან (primaryDamage/secondaryDamage = რა დაზიანება ჰქონდა), გარბენის ისტორია
  "titles[].meter"-დან (შეამოწმე გარბენის თანმიმდევრობა — თუ ერთ თარიღზე მეტი გარბენი აქვს,
  ეჭვი გარბენის გადახვევაზე). ცალკე სექციად აჩვენე "წარსული დაზიანება" და "title/გარბენი".
  რისკის ქულა ამ ისტორიის მიხედვით დააკორექტირე.
- თუ history.available=false — აღნიშნე, რომ ამ მანქანის დეტალური ისტორია (დაზიანება/title)
  ვერ მოიძებნა და ანალიზი ეფუძნება მოდელის ზოგად მონაცემებსა და გაწვევებს.
- არ ახსენო მონაცემების წყარო ან რომელიმე სერვისის სახელი.
- დააბრუნე მხოლოდ სუფთა JSON, ყოველგვარი markdown-ის ან ტექსტის გარეშე, ამ ფორმით:
{
  "riskScore": <0-100 რიცხვი>,
  "riskLabel": "დაბალი" | "საშუალო" | "მაღალი",
  "summary": "<1-2 წინადადება მთავარი დასკვნა>",
  "narrative": "<სრული ანალიზი აბზაცებად>",
  "sections": [{"title": "<სათაური>", "body": "<ტექსტი>"}],
  "checklist": ["<შესამოწმებელი პუნქტი>", "..."]
}`;

function extractJson(text: string): VinAnalysis {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
  const parsed = JSON.parse(slice) as Partial<VinAnalysis>;
  return {
    riskScore: typeof parsed.riskScore === "number" ? parsed.riskScore : 50,
    riskLabel: parsed.riskLabel || "საშუალო",
    summary: parsed.summary || "",
    narrative: parsed.narrative || "",
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
  };
}

export async function generateAnalysis(data: VehicleData): Promise<VinAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `მანქანის მონაცემები:\n${JSON.stringify(
    {
      decoded: data.decoded,
      recalls: data.recalls,
      history: data.history ?? { available: false },
      checkDigitValid: data.checkDigitValid,
    },
    null,
    2,
  )}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const text = response.text ?? "";
  return extractJson(text);
}
