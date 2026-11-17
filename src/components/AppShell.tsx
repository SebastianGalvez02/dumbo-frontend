"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cerrarSesion, useSesion } from "@/lib/sesion";
import { buscarSeccion, rutaInicio } from "@/lib/menu";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const rutaActual = usePathname();
  const sesion = useSesion();
  const seccion = sesion ? buscarSeccion(sesion.rol, rutaActual) : undefined;

  useEffect(() => {
    if (sesion === null) router.replace("/login");
    else if (sesion && !seccion) router.replace(rutaInicio(sesion.rol));
  }, [sesion, seccion, router]);

  if (!sesion || !seccion) return null;

  function salir() {
    cerrarSesion();
    router.replace("/login");
  }

  return (
    <div className="app-shell">
      <Sidebar rol={sesion.rol} onSalir={salir} />
      <div className="main-content">
        <Header
          rol={sesion.rol}
          nombre={sesion.nombres}
          titulo={seccion.titulo}
          subtitulo={seccion.subtitulo}
        />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}
