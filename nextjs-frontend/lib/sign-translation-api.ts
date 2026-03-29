export type SignToTextResult = {
  label: string;
  confidence: number;
  scores: Record<string, number>;
};

export type SignToTextResponse = {
  success: boolean;
  result: SignToTextResult;
};

export type TextToSignResult = {
  input_text: string;
  normalized_text: string;
  spoken_language: string;
  signed_language: string;
  source: string;
  video_url: string;
  pose_url?: string | null;
};

export type TextToSignResponse = {
  success: boolean;
  result: TextToSignResult;
};

function getApiBaseUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:8000";

  return baseUrl.replace(/\/+$/, "");
}

async function requestJson<T>(path: string, init: RequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function predictSignToText(sequence: number[][]) {
  return requestJson<SignToTextResponse>("/v1/action-detection/sign-to-text", {
    method: "POST",
    body: JSON.stringify({ sequence }),
  });
}

export async function translateTextToSign(
  text: string,
  options?: { spokenLanguage?: string; signedLanguage?: string },
) {
  return requestJson<TextToSignResponse>("/v1/action-detection/text-to-sign", {
    method: "POST",
    body: JSON.stringify({
      text,
      spoken_language: options?.spokenLanguage,
      signed_language: options?.signedLanguage,
    }),
  });
}
