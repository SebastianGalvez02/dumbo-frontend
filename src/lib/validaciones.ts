export const MENSAJE_CONTRASENA = "La nueva contraseña no cumple los estándares de seguridad";
export const REQUISITOS_CONTRASENA = "Debe tener más de 8 caracteres, una mayúscula y un número.";

export function esContrasenaSegura(contrasena: string): boolean {
  return contrasena.length > 8 && /[A-Z]/.test(contrasena) && /\d/.test(contrasena);
}

export const MENSAJE_TELEFONO = "El número de teléfono ingresado no es válido";

/** Quita espacios, guiones y paréntesis. */
function limpiarTelefono(telefono: string): string {
  return telefono.replace(/[\s\-()]/g, "");
}

/** Celular chileno: +56 9 y exactamente 8 dígitos. El "+" es opcional. */
export function esTelefonoValido(telefono: string): boolean {
  return /^\+?569\d{8}$/.test(limpiarTelefono(telefono));
}

/** Deja el teléfono siempre como "+56 9 1234 5678". */
export function formatearTelefono(telefono: string): string {
  const digitos = limpiarTelefono(telefono).replace(/^\+?569/, "");
  return `+56 9 ${digitos.slice(0, 4)} ${digitos.slice(4)}`;
}
