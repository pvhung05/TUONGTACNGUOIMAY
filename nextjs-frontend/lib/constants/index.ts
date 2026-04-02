/* API Endpoints */
export const API_ENDPOINTS = {
  SIGN_TO_TEXT: "/v1/action-detection/sign-to-text",
  TEXT_TO_SIGN: "/v1/action-detection/text-to-sign",
};

/* Environment Variables Keys */
export const ENV_VARS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8000",
};

/* Re-export all constants from sub-modules */
export * from "./holistic";
export * from "./legacy-sequences";
