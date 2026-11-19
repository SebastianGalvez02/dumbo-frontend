"use client";

import { useSyncExternalStore } from "react";
import { getSession, subscribeToSession } from "@/context/session-store";
import type { Session } from "@/types/session";

export function useSession(): Session | null | undefined {
  return useSyncExternalStore<Session | null | undefined>(
    subscribeToSession,
    getSession,
    () => undefined,
  );
}
