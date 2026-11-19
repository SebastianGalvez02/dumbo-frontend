"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/context/session-store";
import { useSession } from "@/hooks/use-session";
import { buscarSeccion, rutaInicio } from "@/lib/menu";
import { services } from "@/services";
import { mensajeDeServicio } from "@/utils/mensaje-error";
import { Alerta } from "./formulario";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentPath = usePathname();
  const session = useSession();
  const role = session?.role ?? null;
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const section = session === undefined ? undefined : buscarSeccion(role, currentPath);

  useEffect(() => {
    if (isSigningOut || session === undefined || section) return;
    router.replace(session ? rutaInicio(session.role) : "/login");
  }, [isSigningOut, session, section, router]);

  if (!section) return null;

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setError("");

    try {
      await services.authentication.signOut();
      clearSession();
      router.replace("/login");
    } catch (error) {
      setError(mensajeDeServicio(error));
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar rol={role} onSignOut={handleSignOut} isSigningOut={isSigningOut} />
      <div className="main-content">
        <Header
          rol={role}
          nombre={session?.name}
          titulo={section.titulo}
          subtitulo={section.subtitulo}
        />
        <div className="content-area">
          {error && <Alerta tipo="error">{error}</Alerta>}
          {children}
        </div>
      </div>
    </div>
  );
}
