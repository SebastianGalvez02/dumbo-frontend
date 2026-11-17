import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function TrabajadoresPage() {
  return (
    <EstadoVacio
      icono="users"
      titulo="Gestión de trabajadores en construcción"
      descripcion="Aquí podrás administrar el equipo y sus accesos al sistema."
    />
  );
}
