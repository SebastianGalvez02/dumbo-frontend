import { EmployeeManagement } from "./GestionTrabajadores";

// Depende de la sesión del navegador: no se valida como navegación instantánea.
export const instant = false;

export default function TrabajadoresPage() {
  return <EmployeeManagement />;
}
