import { useSyncExternalStore } from "react";

export type Rol = "Cliente" | "Trabajador" | "Administrador";

export interface Sesion {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Rol;
  debeCambiarContrasena: boolean;
  token: string;
  expira: string;
}

const CLAVE = "dumbo.sesion";

export function guardarSesion(sesion: Sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE);
}

// Devuelve el texto guardado, o null si no hay sesión o ya expiró.
function leerTexto(): string | null {
  const texto = localStorage.getItem(CLAVE);
  if (!texto) return null;
  try {
    const sesion = JSON.parse(texto) as Sesion;
    if (new Date(sesion.expira) <= new Date()) {
      cerrarSesion();
      return null;
    }
    return texto;
  } catch {
    cerrarSesion();
    return null;
  }
}

export function leerSesion(): Sesion | null {
  if (typeof window === "undefined") return null;
  const texto = leerTexto();
  return texto ? (JSON.parse(texto) as Sesion) : null;
}

function suscribir(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * undefined = todavía cargando
 * null      = no hay sesión
 */
export function useSesion(): Sesion | null | undefined {
  const texto = useSyncExternalStore(suscribir, leerTexto, () => undefined);
  if (texto === undefined) return undefined;
  return texto ? (JSON.parse(texto) as Sesion) : null;
}
