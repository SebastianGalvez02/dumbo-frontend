import { leerSesion } from "./sesion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.status = status;
  }
}

function extraerMensaje(datos: unknown): string {
  if (datos && typeof datos === "object") {
    const d = datos as { mensaje?: string; errors?: Record<string, string[]> };
    if (d.mensaje) return d.mensaje;
    if (d.errors) {
      const primero = Object.values(d.errors)[0]?.[0];
      if (primero) return primero;
    }
  }
  return "Ocurrió un error inesperado";
}

async function solicitar<T>(
  metodo: "GET" | "POST",
  ruta: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const tokenFinal = token ?? leerSesion()?.token;

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(tokenFinal ? { Authorization: `Bearer ${tokenFinal}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, extraerMensaje(datos));
  }
  return datos as T;
}

export const apiGet = <T>(ruta: string) => solicitar<T>("GET", ruta);

export const apiPost = <T>(ruta: string, body: unknown, token?: string) =>
  solicitar<T>("POST", ruta, body, token);

export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudo conectar con el servidor. Intenta nuevamente.";
}
