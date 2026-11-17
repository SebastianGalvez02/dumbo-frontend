import type { Rol } from "@/lib/sesion";

interface HeaderProps {
  rol: Rol;
  nombre: string;
  titulo: string;
  subtitulo: string;
}

export function Header({ rol, nombre, titulo, subtitulo }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="breadcrumb">Dumbo / {rol}</p>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
      <div className="user-chip">
        <span>{nombre.charAt(0)}</span>
        <div>
          <strong>{nombre}</strong>
          <small>{rol}</small>
        </div>
      </div>
    </header>
  );
}
