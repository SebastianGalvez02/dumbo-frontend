import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function CatalogoPage() {
  return (
    <EstadoVacio
      icono="grid"
      titulo="Catálogo en construcción"
      descripcion="Aquí se mostrarán los productos disponibles."
    />
  );
}
