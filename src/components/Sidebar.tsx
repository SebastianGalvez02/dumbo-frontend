"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU } from "@/lib/menu";
import type { Rol } from "@/lib/sesion";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Sidebar({ rol, onSalir }: { rol: Rol; onSalir: () => void }) {
  const rutaActual = usePathname();

  return (
    <aside className="sidebar">
      <Logo light />
      <div className="workspace-label">Espacio {rol}</div>
      <nav>
        {MENU[rol].map((seccion) => (
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
    </aside>
  );
}
