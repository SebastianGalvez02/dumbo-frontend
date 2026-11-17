import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function CarritoPage() {
  return (
    <EstadoVacio
      icono="cart"
      titulo="Tu carrito está vacío"
      descripcion="Aquí verás los productos que agregues desde el catálogo."
    />
  );
}
