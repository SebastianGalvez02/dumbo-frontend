"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiPost, mensajeDeError } from "@/lib/api";
import { esContrasenaSegura, MENSAJE_CONTRASENA, REQUISITOS_CONTRASENA } from "@/lib/validaciones";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export default function FormularioRestablecer() {
  const parametros = useSearchParams();
  const correo = parametros.get("correo");
  const token = parametros.get("token");

  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!esContrasenaSegura(nueva)) {
      setError(MENSAJE_CONTRASENA);
      return;
    }

    setCargando(true);
    try {
      await apiPost("/api/auth/restablecer-contrasena", { correo, token, contrasenaNueva: nueva });
      setExito(true);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }

  const volver = (
    <Link href="/login" className="back-link">
      <Icon name="chevron" /> Volver al inicio
    </Link>
  );

  if (!correo || !token) {
    return (
      <>
        {volver}
        <Alerta tipo="error">El enlace de recuperación no es válido o ha expirado.</Alerta>
      </>
    );
  }

  return (
    <>
      {volver}
      <div className="auth-symbol">
        <Icon name="lock" size={28} />
      </div>
      <div className="auth-heading">
        <p className="eyebrow">Nueva clave</p>
        <h2>Crea una contraseña segura</h2>
        <p>{REQUISITOS_CONTRASENA}</p>
      </div>

      {exito ? (
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
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          {error && <Alerta tipo="error">{error}</Alerta>}
          <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      )}
    </>
  );
}
