import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function ProductosPage() {
  return (
    <EstadoVacio
      icono="box"
      titulo="Gestión de productos en construcción"
      descripcion="Aquí podrás agregar productos de forma individual o por carga masiva."
    />
  );
}
