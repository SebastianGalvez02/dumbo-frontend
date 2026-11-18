import { apiGet, apiPatch, apiPost, apiPut } from "./api";

export interface Trabajador {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  habilitado: boolean;
}

/** Datos que se envían al registrar o editar. */
export type DatosTrabajador = Pick<Trabajador, "nombres" | "apellidos" | "telefono" | "correo">;

const RUTA = "/api/trabajadores";

export function listarTrabajadores() {
  return apiGet<Trabajador[]>(RUTA);
}

export function crearTrabajador(datos: DatosTrabajador) {
  return apiPost<Trabajador>(RUTA, datos);
}

export function editarTrabajador(id: number, datos: DatosTrabajador) {
  return apiPut<null>(`${RUTA}/${id}`, datos);
}

export function cambiarEstadoTrabajador(id: number, habilitado: boolean) {
  return apiPatch<null>(`${RUTA}/${id}/estado`, { habilitado });
}
