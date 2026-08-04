export function getStoredGeminiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("gemini_api_key") || "";
}

export function saveStoredGeminiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("gemini_api_key", key.trim());
}

export interface AIResponse {
  text?: string;
  error?: string;
  message?: string;
}

export async function requestGeminiAI(payload: {
  action: "explain_mistake" | "get_hint" | "ask_tutor" | "read_sentence";
  gujarati?: string;
  userAnswer?: string;
  correctAnswers?: string[];
  topic?: string;
  userPrompt?: string;
}): Promise<AIResponse> {
  const customKey = getStoredGeminiKey();

  try {
    const res = await fetch("/api/ai/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        apiKey: customKey || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        error: data.error || "GEMINI_ERROR",
        message: data.message || "Failed to get response from Gemini AI.",
      };
    }

    return { text: data.text };
  } catch (err: any) {
    return {
      error: "NETWORK_ERROR",
      message: err.message || "Could not connect to AI service.",
    };
  }
}
