import Link from "next/link";
import type { Rol } from "@/lib/sesion";
import { Icon } from "./Icon";

interface HeaderProps {
  rol: Rol | null;
  nombre?: string;
  titulo: string;
  subtitulo: string;
}

export function Header({ rol, nombre, titulo, subtitulo }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="breadcrumb">Dumbo / {rol ?? "Invitado"}</p>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      {rol && nombre ? (
        <div className="user-chip">
          <span>{nombre.charAt(0)}</span>
          <div>
            <strong>{nombre}</strong>
            <small>{rol}</small>
          </div>
        </div>
      ) : (
        <Link href="/login" className="btn btn-primary">
          Iniciar sesión <Icon name="arrow" />
        </Link>
      )}
    </header>
  );
}
