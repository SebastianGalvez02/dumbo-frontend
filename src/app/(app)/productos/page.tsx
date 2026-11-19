import { FormularioProducto } from "./FormularioProducto";
import { ImportarProductos } from "./ImportarProductos";

// Depende de la sesión del navegador: no se valida como navegación instantánea.
export const instant = false;

export default function ProductosPage() {
  return (
    <div className="management-grid">
      <FormularioProducto />
      <ImportarProductos />
    </div>
  );
}
