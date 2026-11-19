import { GestionClientes } from "./GestionClientes";

// Depende de la sesión del navegador: no se valida como navegación instantánea.
export const instant = false;

export default function ClientesPage() {
  return <GestionClientes />;
}
