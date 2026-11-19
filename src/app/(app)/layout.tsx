import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import "./app.css";

// La sesión vive en el navegador, fuera del alcance de la navegación instantánea del servidor.
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
