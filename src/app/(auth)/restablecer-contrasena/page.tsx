import { Suspense } from "react";
import FormularioRestablecer from "./FormularioRestablecer";

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-(--muted)">Cargando...</p>}>
      <FormularioRestablecer />
    </Suspense>
  );
}
