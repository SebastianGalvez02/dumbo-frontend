export const MENSAJE_CONTRASENA = "La nueva contraseña no cumple los estándares de seguridad";
export const REQUISITOS_CONTRASENA = "Debe tener más de 8 caracteres, una mayúscula y un número.";

export function esContrasenaSegura(contrasena: string): boolean {
  return contrasena.length > 8 && /[A-Z]/.test(contrasena) && /\d/.test(contrasena);
}
