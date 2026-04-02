/* Environment Variables Type Definitions */

interface ProcessEnv {
  NEXT_PUBLIC_API_BASE_URL?: string;
  API_BASE_URL?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}

export {};
