import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

async function generateContent(ai: GoogleGenAI, prompt: string): Promise<string> {
  let availableModels: string[] = [];

  try {
    const listPager = await ai.models.list();
    // Retrieve model names from pager
    for await (const m of listPager) {
      const name = (m.name || "").replace(/^models\//, "");
      if (name && (name.includes("flash") || name.includes("pro"))) {
        availableModels.push(name);
      }
    }
    console.log("Discovered available Gemini models:", availableModels);
  } catch (err) {
    console.warn("Failed to list models, using defaults:", err);
    availableModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
  }

  let lastError: any = null;

  for (const model of availableModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      if (response && response.text) {
        console.log(`Gemini API succeeded with model: [${model}]`);
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Gemini model [${model}] failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All discovered Gemini models failed.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, gujarati, userAnswer, correctAnswers, topic, userPrompt, apiKey: clientApiKey } = body;

    const cleanKey = (k?: string) => (k || "").trim().replace(/^["']|["']$/g, "");

    const apiKey =
      cleanKey(clientApiKey) ||
      cleanKey(process.env.GEMINI_API_KEY) ||
      cleanKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API_KEY_MISSING",
          message:
            "No Gemini API key found. Please add your free GEMINI_API_KEY in .env.local or enter it in App Settings.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    if (action === "explain_mistake") {
      const prompt = `You are a supportive, friendly English Learning AI Tutor helping a Gujarati speaker learn English grammar.
      
Sentence in Gujarati: "${gujarati}"
User's Submission in English: "${userAnswer}"
Correct/Target English Translation(s): ${JSON.stringify(correctAnswers)}
Grammar Topic: "${topic}"

Provide a concise, encouraging explanation covering:
1. What was wrong with the user's answer (e.g. tense, missing verb, wrong preposition, word order).
2. A simple rule or memory tip in clear English and simple Gujarati terms.
3. 1 or 2 correct example sentences.

Keep your response under 150 words, formatted nicely with bullet points.`;

      const text = await generateContent(ai, prompt);
      return NextResponse.json({ text });
    }

    if (action === "get_hint") {
      const prompt = `You are an English Learning Assistant.
Give a subtle, helpful hint for translating this Gujarati sentence into English:
Gujarati: "${gujarati}"
Grammar Topic: "${topic}"

Give a 1-2 sentence hint focusing on sentence structure or key vocabulary without giving away the exact full answer immediately.`;

      const text = await generateContent(ai, prompt);
      return NextResponse.json({ text });
    }

    if (action === "ask_tutor") {
      const prompt = `You are a helpful, expert AI English Tutor for Gujarati native speakers.
User Question: "${userPrompt}"

Give a clear, polite, and helpful explanation using examples. Keep formatting easy to read.`;

      const text = await generateContent(ai, prompt);
      return NextResponse.json({ text });
    }

    if (action === "read_sentence") {
      const targetSentence = gujarati || userPrompt || "";
      const prompt = `You are a world-class Gujarati-English Phonetic & Grammar AI Tutor.
Analyze the following sentence to help a learner understand how to read, pronounce, and translate it effortlessly.

Target Sentence: "${targetSentence}"

Provide a clean, beautifully formatted Markdown analysis containing:

### 🗣️ Phonetic Pronunciation Guide
- **Gujarati Sentence**: ${targetSentence}
- **Romanized Phonetics (Gujlish)**: Write exact phonetic pronunciation in Roman English letters so anyone can pronounce it correctly.
- **English Translation**: Clear English meaning.

### 🧩 Word-by-Word Breakdown
Provide a markdown table:
| Gujarati Word | Romanized Phonetic | English Meaning | Grammar Role |
| --- | --- | --- | --- |

### 💡 Sentence Structure & Grammar Rule
- **Word Order**: Explain Gujarati structure vs English translation.
- **Key Tip**: Quick rule to easily build this sentence next time.

### 🌟 2 Practical Conversation Variations
1. Gujarati | Phonetic | English
2. Gujarati | Phonetic | English`;

      const text = await generateContent(ai, prompt);
      return NextResponse.json({ text });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Gemini API Error:", err);

    const isQuotaExceeded =
      err?.status === 429 ||
      err?.message?.includes("RESOURCE_EXHAUSTED") ||
      err?.message?.includes("Quota exceeded");

    const message = err?.message || (isQuotaExceeded
      ? "Gemini API rate limit reached. Please wait a few seconds and try again."
      : "Failed to communicate with Gemini AI.");

    return NextResponse.json(
      {
        error: isQuotaExceeded ? "QUOTA_EXCEEDED" : "GEMINI_ERROR",
        message,
      },
      { status: isQuotaExceeded ? 429 : 500 }
    );
  }
}
