"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost, mensajeDeError } from "@/lib/api";
import { guardarSesion, type Sesion } from "@/lib/sesion";
import { esContrasenaSegura, MENSAJE_CONTRASENA, REQUISITOS_CONTRASENA } from "@/lib/validaciones";
import { Alerta, Campo } from "@/components/formulario";
import { Icon } from "@/components/Icon";

type Vista = "login" | "primer-acceso";

export default function LoginPage() {
  const router = useRouter();
  const [vista, setVista] = useState<Vista>("login");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nueva, setNueva] = useState("");
  const [tokenTemporal, setTokenTemporal] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function entrar(sesion: Sesion) {
    guardarSesion(sesion);

    setContrasena("");
    setNueva("");
    setTokenTemporal("");
    setError("");
    setVista("login");
    setCargando(false);

    router.replace("/");
  }


  async function iniciarSesion(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const sesion = await apiPost<Sesion>("/api/auth/login", { correo, contrasena });

      if (sesion.debeCambiarContrasena) {
        // El token viene limitado: se guarda solo en memoria, no en localStorage.
        setTokenTemporal(sesion.token);
        setVista("primer-acceso");
        setCargando(false);
        return;
      }

      entrar(sesion);
    } catch (err) {
      setError(mensajeDeError(err));
      setCargando(false);
    }
  }

  async function cambiarContrasenaInicial(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!esContrasenaSegura(nueva)) {
      setError(MENSAJE_CONTRASENA);
      return;
    }

    setCargando(true);
    try {
      await apiPost(
        "/api/auth/cambiar-contrasena",
        { contrasenaActual: contrasena, contrasenaNueva: nueva },
        tokenTemporal,
      );
      // El token anterior sigue limitado, así que se inicia sesión de nuevo.
      const sesion = await apiPost<Sesion>("/api/auth/login", { correo, contrasena: nueva });
      entrar(sesion);
    } catch (err) {
      setError(mensajeDeError(err));
      setCargando(false);
    }
  }

  if (vista === "primer-acceso") {
    return (
      <>
        <div className="auth-symbol">
          <Icon name="shield" size={28} />
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Primer acceso</p>
          <h2>Cambia tu contraseña inicial</h2>
          <p>Por seguridad, debes crear una nueva contraseña antes de continuar. {REQUISITOS_CONTRASENA}</p>
        </div>
        <form onSubmit={cambiarContrasenaInicial}>
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
            {cargando ? "Guardando..." : "Cambiar contraseña y continuar"}
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

      <form onSubmit={iniciarSesion}>
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
        <Campo
          etiqueta="Contraseña"
          icono="lock"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          required
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <Link href="/recuperar-contrasena" className="text-link forgot-link">
          ¿Olvidaste tu contraseña?
        </Link>

        {error && <Alerta tipo="error">{error}</Alerta>}

        <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"} <Icon name="arrow" />
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
