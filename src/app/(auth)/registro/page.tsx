import Link from "next/link";
import { CustomerRegistrationForm } from "@/components/CustomerRegistrationForm";
import { Icon } from "@/components/Icon";

export default function RegistrationPage() {
  return (
    <>
      <Link href="/login" className="back-link">
        <Icon name="chevron" /> Volver al inicio de sesión
      </Link>
      <div className="auth-heading">
        <h2>Crea tu cuenta</h2>
        <p>Ingresa tus datos para registrarte como cliente.</p>
      </div>
      <CustomerRegistrationForm mode="self" />
    </>
  );
}
