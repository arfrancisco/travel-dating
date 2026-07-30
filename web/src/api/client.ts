const BASE_URL = "http://localhost:3000/api/v1";

export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: string;
  interested_in: string;
  bio: string;
}

export interface ExplorationSession {
  id: number;
  user_id: number;
  location_id: number;
  started_at: string;
  ended_at: string | null;
}

export interface SessionStats {
  location: string;
  eligible_remaining: number;
  viewed: number;
  liked: number;
  passed: number;
}

export type Decision = "like" | "pass";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${options?.method ?? "GET"} ${path} failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchLocations(): Promise<CityLocation[]> {
  return request<CityLocation[]>("/locations");
}

export function createExplorationSession(locationId: number): Promise<ExplorationSession> {
  return request<ExplorationSession>("/exploration_sessions", {
    method: "POST",
    body: JSON.stringify({ location_id: locationId }),
  });
}

export function fetchProfiles(sessionId: number): Promise<Profile[]> {
  return request<Profile[]>(`/exploration_sessions/${sessionId}/profiles`);
}

export function fetchStats(sessionId: number): Promise<SessionStats> {
  return request<SessionStats>(`/exploration_sessions/${sessionId}/stats`);
}

export function recordDecision(
  sessionId: number,
  viewedUserId: number,
  action: Decision
): Promise<void> {
  return request(`/profile_decisions`, {
    method: "POST",
    body: JSON.stringify({
      profile_decision: {
        exploration_session_id: sessionId,
        viewed_user_id: viewedUserId,
        action,
      },
    }),
  });
}
