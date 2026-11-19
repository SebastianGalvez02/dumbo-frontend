"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getDevelopmentResetLink, services } from "@/services";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export default function RequestPasswordResetPage() {
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setMessage("");
    setResetLink(null);
    setIsLoading(true);
    try {
      const response = await services.authentication.requestPasswordReset({ mail });
      setMessage(response.message);
      setResetLink(getDevelopmentResetLink(mail));
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Link href="/login" className="back-link">
        <Icon name="chevron" /> Volver
      </Link>
      <div className="auth-symbol">
        <Icon name="mail" size={28} />
      </div>
      <div className="auth-heading">
        <p className="eyebrow">Recuperar acceso</p>
        <h2>Restablece tu contraseña</h2>
        <p>Ingresa tu correo y te enviaremos las instrucciones para continuar.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Campo
          etiqueta="Correo electrónico"
          icono="mail"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.cl"
          required
          disabled={isLoading}
          value={mail}
          onChange={(event) => {
            setMail(event.target.value);
            setMessage("");
            setResetLink(null);
          }}
        />
        {error && <Alerta tipo="error">{error}</Alerta>}
        {message && <Alerta tipo="exito">{message}</Alerta>}
        {resetLink && (
          <Link href={resetLink} className="text-link">
            Abrir enlace de recuperación simulado
          </Link>
        )}
        <button className="btn btn-primary btn-wide" type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}
