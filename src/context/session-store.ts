import type { Session } from "@/types/session";

let currentSession: Session | null = null;
let expirationTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

export function getSession(): Session | null {
  if (currentSession && Date.parse(currentSession.tokenExpiration) > Date.now()) {
    return currentSession;
  }
  return null;
}

export function clearSession(): void {
  clearTimeout(expirationTimer);
  expirationTimer = undefined;
  currentSession = null;
  listeners.forEach((listener) => listener());
}

export function saveSession(session: Session): void {
  const expiresIn = Date.parse(session.tokenExpiration) - Date.now();
  if (session.hasToChangePassword || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error("La sesión no es válida.");
  }

  clearTimeout(expirationTimer);
  currentSession = { ...session };
  expirationTimer = setTimeout(clearSession, expiresIn);
  listeners.forEach((listener) => listener());
}

export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
