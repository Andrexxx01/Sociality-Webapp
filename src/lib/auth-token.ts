import { LOCAL_STORAGE_KEYS } from "@/constants/localStorage";
import type { SetCredentialsPayload } from "@/types/auth";

export function saveAuthSession(payload: SetCredentialsPayload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.authSession, JSON.stringify(payload));
}

export function getAuthSession(): SetCredentialsPayload | null {
  if (typeof window === "undefined") return null;
  const rawSession = localStorage.getItem(LOCAL_STORAGE_KEYS.authSession);
  if (!rawSession) return null;

  try {
    const parsedSession = JSON.parse(rawSession) as SetCredentialsPayload;
    if (!parsedSession?.token || !parsedSession?.user) {
      return null;
    }
    return parsedSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_KEYS.authSession);
}
