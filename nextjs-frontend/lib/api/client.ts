import { client } from "@/app/openapi-client/client.gen";
import { ENV_VARS } from "@/lib/constants";

/**
 * Initialize API client with base URL from environment or localhost
 */
export function initializeApiClient(): void {
  client.setConfig({
    baseURL: ENV_VARS.API_BASE_URL,
  });
}

/**
 * Get the API base URL from environment or return default
 */
export function getApiBaseUrl(): string {
  const baseUrl = ENV_VARS.API_BASE_URL;
  return baseUrl.replace(/\/+$/, "");
}

// Initialize on module load
initializeApiClient();

export default client;
