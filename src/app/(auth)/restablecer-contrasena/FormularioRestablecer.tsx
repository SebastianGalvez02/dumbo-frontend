"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clearSession, getSession } from "@/context/session-store";
import {
  esContrasenaSegura as isStrongPassword,
  MENSAJE_CONTRASENA as PASSWORD_ERROR_MESSAGE,
  REQUISITOS_CONTRASENA as PASSWORD_REQUIREMENTS,
} from "@/lib/validaciones";
import { services } from "@/services";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const mail = searchParams.get("correo");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mail || !token || isLoading) return;
    setError("");

    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_ERROR_MESSAGE);
      return;
    }
    if (!window.confirm("¿Está seguro de restablecer su contraseña?")) return;

    setIsLoading(true);
    try {
      await services.authentication.resetPassword({ mail, token, newPassword });
      if (getSession()?.mail === mail.trim().toLowerCase()) {
        clearSession();
      }
      setNewPassword("");
      setIsSuccess(true);
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const backLink = (
    <Link href="/login" className="back-link">
      <Icon name="chevron" /> Volver al inicio
    </Link>
  );

  if (!mail || !token) {
    return (
      <>
        {backLink}
        <Alerta tipo="error">El enlace de recuperación no es válido o ha expirado.</Alerta>
      </>
    );
  }

  return (
    <>
      {backLink}
      <div className="auth-symbol">
        <Icon name="lock" size={28} />
      </div>
      <div className="auth-heading">
        <p className="eyebrow">Nueva clave</p>
        <h2>Crea una contraseña segura</h2>
        <p>{PASSWORD_REQUIREMENTS}</p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col gap-4">
          <Alerta tipo="exito">Contraseña actualizada correctamente.</Alerta>
          <Link href="/login" className="btn btn-secondary btn-wide">
            Ir a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Campo
            etiqueta="Nueva contraseña"
            icono="lock"
            type="password"
            autoComplete="new-password"
            placeholder="Más de 8 caracteres"
            required
            disabled={isLoading}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          {error && <Alerta tipo="error">{error}</Alerta>}
          <button className="btn btn-primary btn-wide" type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      )}
    </>
  );
}
