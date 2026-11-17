import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import "./app.css";

// La sesión se guarda en el navegador (localStorage), así que estas
// secciones no se pueden validar como "navegación instantánea" en el servidor.
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
