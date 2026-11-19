import { ServiceError } from "@/services/contracts/service-error";

export function mensajeDeServicio(error: unknown): string {
  if (error instanceof ServiceError) return error.message;
  return "No se pudo conectar con el servidor. Intenta nuevamente.";
}
