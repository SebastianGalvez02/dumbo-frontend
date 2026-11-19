"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { seccionesDe } from "@/lib/menu";
import type { Rol } from "@/lib/sesion";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Sidebar({ rol, onSalir }: { rol: Rol | null; onSalir: () => void }) {
  const rutaActual = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="logo-link" aria-label="Ir al inicio">
        <Logo light />
      </Link>
      <div className="workspace-label">{rol ? `Espacio ${rol}` : "Explora"}</div>
      <nav>
        {seccionesDe(rol).map((seccion) => (
          <Link
            key={seccion.ruta}
            href={seccion.ruta}
            className={rutaActual === seccion.ruta ? "active" : ""}
          >
            <Icon name={seccion.icono} />
            <span>{seccion.etiqueta}</span>
          </Link>
        ))}
      </nav>

      {rol ? (
        <>
          <div className="sidebar-note">
            <Icon name="shield" />
            <div>
              <strong>Acceso protegido</strong>
              <span>Vista limitada por rol</span>
            </div>
          </div>
          <button className="logout-button" onClick={onSalir}>
            <Icon name="logout" /> Cerrar sesión
          </button>
        </>
      ) : (
        <Link href="/login" className="logout-button sidebar-login">
          <Icon name="arrow" /> Iniciar sesión
        </Link>
      )}
    </aside>
  );
}
