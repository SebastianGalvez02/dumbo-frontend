import type { IconName } from "@/components/Icon";
import type { Rol } from "./sesion";

export interface Seccion {
  ruta: string;
  etiqueta: string;
  icono: IconName;
  titulo: string;
  subtitulo: string;
}

export const MENU: Record<Rol, Seccion[]> = {
  Cliente: [
    {
      ruta: "/catalogo",
      etiqueta: "Catálogo",
      icono: "grid",
      titulo: "Catálogo",
      subtitulo: "Descubre productos frescos para tu día a día.",
    },
    {
      ruta: "/carrito",
      etiqueta: "Mi carrito",
      icono: "cart",
      titulo: "Mi carrito",
      subtitulo: "Revisa tu selección antes de continuar.",
    },
  ],
  Trabajador: [
    {
      ruta: "/productos",
      etiqueta: "Productos",
      icono: "box",
      titulo: "Gestión de productos",
      subtitulo: "Agrega productos de forma individual o mediante carga masiva.",
    },
    {
      ruta: "/clientes",
      etiqueta: "Clientes",
      icono: "users",
      titulo: "Gestión de clientes",
      subtitulo: "Administra la información y el estado de las cuentas.",
    },
  ],
  Administrador: [
    {
      ruta: "/trabajadores",
      etiqueta: "Trabajadores",
      icono: "users",
      titulo: "Gestión de trabajadores",
      subtitulo: "Administra el equipo y sus accesos al sistema.",
    },
    {
      ruta: "/reportes",
      etiqueta: "Reportes",
      icono: "chart",
      titulo: "Reportes",
      subtitulo: "Una visión consolidada de ventas e inventario.",
    },
  ],
};

/** Primera sección del rol: es donde llega al iniciar sesión. */
export function rutaInicio(rol: Rol): string {
  return MENU[rol][0].ruta;
}

/** Devuelve la sección si el rol tiene acceso a esa ruta, o undefined si no. */
export function buscarSeccion(rol: Rol, ruta: string): Seccion | undefined {
  return MENU[rol].find((seccion) => seccion.ruta === ruta);
}
