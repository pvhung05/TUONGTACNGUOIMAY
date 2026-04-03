import { getApiBaseUrl } from "./client";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthUser = {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  score?: number;
  streak?: number;
};

export type Lesson = {
  _id: string;
  title: string;
  content: string;
  type: "lesson" | "practice";
  scoreReward: number;
  order: number;
  resources?: Array<{
    title: string;
    url: string;
  }>;
  practiceQuestions?: Array<{
    url: string;
    A: string;
    B: string;
    C: string;
    D: string;
    correct: "A" | "B" | "C" | "D";
  }>;
};

export type LearningHistoryItem = {
  _id: string;
  userId: string;
  lessonId: Lesson | string;
  date: string;
};

export type DashboardData = {
  user: AuthUser;
  stats: {
    totalLessonsCompleted: number;
    totalScore: number;
    streak: number;
    recentActivities: number;
  };
  recentLearning: LearningHistoryItem[];
};

export type LeaderboardUser = {
  _id: string;
  username: string;
  score: number;
  streak: number;
};

export type UserRankData = {
  rank: number;
  totalUsers: number;
  user: LeaderboardUser;
};

export type TranslatorWord = {
  _id: string;
  text: string;
  videoUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedWords = {
  words: TranslatorWord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

const TOKEN_STORAGE_KEY = "auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function requestApi<T>(
  path: string,
  init: RequestInit = {},
  options?: { auth?: boolean },
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  if (options?.auth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn chưa đăng nhập.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response.json()) as ApiEnvelope<T> | { message?: string };

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload as ApiEnvelope<T>;
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  const response = await requestApi<{ user: AuthUser; token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  const response = await requestApi<{ user: AuthUser; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await requestApi<AuthUser>("/api/auth/profile", { method: "GET" }, { auth: true });
  return response.data;
}

export async function getLessons(type?: "lesson" | "practice"): Promise<Lesson[]> {
  const query = type ? `?type=${type}` : "";
  const response = await requestApi<Lesson[]>(`/api/learn/lessons${query}`, { method: "GET" });
  return response.data;
}

export async function getLessonById(lessonId: string): Promise<Lesson> {
  const response = await requestApi<Lesson>(`/api/learn/lessons/${lessonId}`, { method: "GET" });
  return response.data;
}

export async function completeLesson(lessonId: string): Promise<{ user: AuthUser; history: LearningHistoryItem }> {
  const response = await requestApi<{ user: AuthUser; history: LearningHistoryItem }>(
    "/api/learn/complete",
    {
      method: "POST",
      body: JSON.stringify({ lessonId }),
    },
    { auth: true },
  );
  return response.data;
}

export async function getLearningHistory(): Promise<LearningHistoryItem[]> {
  const response = await requestApi<LearningHistoryItem[]>("/api/learn/history", { method: "GET" }, { auth: true });
  return response.data;
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await requestApi<DashboardData>("/api/dashboard", { method: "GET" }, { auth: true });
  return response.data;
}

export async function getLeaderboardTop10(): Promise<LeaderboardUser[]> {
  const response = await requestApi<LeaderboardUser[]>("/api/leaderboard/top10", { method: "GET" });
  return response.data;
}

export async function getMyRank(): Promise<UserRankData> {
  const response = await requestApi<UserRankData>("/api/leaderboard/rank", { method: "GET" }, { auth: true });
  return response.data;
}

export async function addTranslatorWord(input: { text: string; videoUrl: string }): Promise<TranslatorWord> {
  const response = await requestApi<TranslatorWord>("/api/translator/words", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function getTranslatorWords(page = 1, limit = 20): Promise<PaginatedWords> {
  const response = await requestApi<PaginatedWords>(
    `/api/translator/words?page=${page}&limit=${limit}`,
    { method: "GET" },
  );
  return response.data;
}

export async function searchTranslatorWords(search: string): Promise<TranslatorWord[]> {
  const response = await requestApi<TranslatorWord[]>(
    `/api/translator/search?search=${encodeURIComponent(search)}`,
    { method: "GET" },
  );
  return response.data;
}

export async function getTranslatorWordById(wordId: string): Promise<TranslatorWord> {
  const response = await requestApi<TranslatorWord>(`/api/translator/words/${wordId}`, { method: "GET" });
  return response.data;
}
