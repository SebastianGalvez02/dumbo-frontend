import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function ClientesPage() {
  return (
    <EstadoVacio
      icono="users"
      titulo="Gestión de clientes en construcción"
      descripcion="Aquí podrás administrar las cuentas de los clientes."
    />
  );
}
