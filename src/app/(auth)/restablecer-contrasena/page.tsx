import { Suspense } from "react";
import ResetPasswordForm from "./FormularioRestablecer";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-(--muted)">Cargando...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
