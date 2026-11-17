"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiPost, mensajeDeError } from "@/lib/api";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export default function RecuperarContrasenaPage() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setAviso("");
    setCargando(true);
    try {
      const respuesta = await apiPost<{ mensaje: string }>("/api/auth/recuperar-contrasena", { correo });
      setAviso(respuesta.mensaje);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
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
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        {error && <Alerta tipo="error">{error}</Alerta>}
        {aviso && <Alerta tipo="exito">{aviso}</Alerta>}
        <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>
          {cargando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}
