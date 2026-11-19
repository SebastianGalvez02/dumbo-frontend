"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, saveSession } from "@/context/session-store";
import {
  esContrasenaSegura as isStrongPassword,
  MENSAJE_CONTRASENA as PASSWORD_ERROR_MESSAGE,
  REQUISITOS_CONTRASENA as PASSWORD_REQUIREMENTS,
} from "@/lib/validaciones";
import { services } from "@/services";
import type { Session } from "@/types/session";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [temporaryToken, setTemporaryToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function resetPasswordFields() {
    setPassword("");
    setNewPassword("");
    setTemporaryToken(null);
  }

  function completeSignIn(session: Session) {
    saveSession(session);
    resetPasswordFields();
    router.replace("/");
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const session = await services.authentication.signIn({ mail, password });
      if (session.hasToChangePassword) {
        // El token del primer acceso queda en el formulario hasta cambiar la clave.
        clearSession();
        setTemporaryToken(session.token);
        return;
      }
      completeSignIn(session);
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleInitialPasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !temporaryToken) return;
    setError("");

    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_ERROR_MESSAGE);
      return;
    }
    if (!window.confirm("¿Está seguro de cambiar su contraseña?")) return;

    setIsLoading(true);
    let passwordChanged = false;
    try {
      await services.authentication.changePassword(
        { oldPassword: password, newPassword },
        temporaryToken,
      );
      passwordChanged = true;
      const session = await services.authentication.signIn({ mail, password: newPassword });
      completeSignIn(session);
    } catch (error) {
      if (passwordChanged) {
        resetPasswordFields();
        setError("La contraseña se cambió. Inicia sesión con tu nueva contraseña.");
      } else {
        setError(getServiceErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelFirstAccess() {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      await services.authentication.signOut();
      resetPasswordFields();
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  if (temporaryToken) {
    return (
      <>
        <div className="auth-symbol">
          <Icon name="shield" size={28} />
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Primer acceso</p>
          <h2>Cambia tu contraseña inicial</h2>
          <p>Por seguridad, debes crear una nueva contraseña antes de continuar. {PASSWORD_REQUIREMENTS}</p>
        </div>
        <form onSubmit={handleInitialPasswordChange}>
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
            {isLoading ? "Guardando..." : "Cambiar contraseña y continuar"}
          </button>
          <button className="btn btn-secondary btn-wide" type="button" onClick={handleCancelFirstAccess} disabled={isLoading}>
            Volver al inicio de sesión
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="auth-heading">
        <p className="eyebrow">Bienvenido de vuelta</p>
        <h2>Inicia sesión</h2>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>
      </div>

      <form onSubmit={handleSignIn}>
        <Campo
          etiqueta="Correo electrónico"
          icono="mail"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.cl"
          required
          disabled={isLoading}
          value={mail}
          onChange={(event) => setMail(event.target.value)}
        />
        <Campo
          etiqueta="Contraseña"
          icono="lock"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          required
          disabled={isLoading}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Link href="/recuperar-contrasena" className="text-link forgot-link">
          ¿Olvidaste tu contraseña?
        </Link>

        {error && <Alerta tipo="error">{error}</Alerta>}

        <button className="btn btn-primary btn-wide" type="submit" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Iniciar sesión"} <Icon name="arrow" />
        </button>
      </form>

      <p className="auth-switch">
        ¿Aún no tienes una cuenta?{" "}
        <Link href="/registro" className="text-link">
          Registrarse
        </Link>
      </p>
    </>
  );
}
