import { EstadoVacio } from "@/components/EstadoVacio";

export const instant = false;

export default function ReportesPage() {
  return (
    <EstadoVacio
      icono="chart"
      titulo="Reportes en construcción"
      descripcion="Aquí verás una visión consolidada de ventas e inventario."
    />
  );
}
