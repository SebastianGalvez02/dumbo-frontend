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
  const rol = sesion?.rol ?? null;

  // undefined mientras se lee la sesión; luego, la sección si tiene acceso.
  const seccion = sesion === undefined ? undefined : buscarSeccion(rol, rutaActual);

  useEffect(() => {
    if (sesion === undefined || seccion) return;
    // Sin acceso: con sesión va a su inicio; sin sesión, al login.
    router.replace(sesion ? rutaInicio(sesion.rol) : "/login");
  }, [sesion, seccion, router]);

  if (!seccion) return null;

  function salir() {
    cerrarSesion();
    router.replace("/login");
  }

  return (
    <div className="app-shell">
      <Sidebar rol={rol} onSalir={salir} />
      <div className="main-content">
        <Header
          rol={rol}
          nombre={sesion?.nombres}
          titulo={seccion.titulo}
          subtitulo={seccion.subtitulo}
        />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}
