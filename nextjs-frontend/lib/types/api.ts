/* Sign Translation API Types */
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
