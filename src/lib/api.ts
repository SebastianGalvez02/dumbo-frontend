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
  metodo: "GET" | "POST" | "PUT" | "PATCH",
  ruta: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (respuesta.status === 401 && !datos) {
      throw new ApiError(401, "Tu sesión expiró. Inicia sesión nuevamente.");
    }
    if (respuesta.status === 403) {
      throw new ApiError(403, "No tienes permisos para realizar esta acción.");
    }
    throw new ApiError(respuesta.status, extraerMensaje(datos));
  }
  return datos as T;
}

export const apiGet = <T>(ruta: string) => solicitar<T>("GET", ruta);

export const apiPost = <T>(ruta: string, body: unknown, token?: string) =>
  solicitar<T>("POST", ruta, body, token);

export const apiPut = <T>(ruta: string, body: unknown) => solicitar<T>("PUT", ruta, body);

export const apiPatch = <T>(ruta: string, body: unknown) => solicitar<T>("PATCH", ruta, body);

export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudo conectar con el servidor. Intenta nuevamente.";
}
