import { Catalogo } from "./Catalogo";

// Depende de la sesión del navegador: no se valida como navegación instantánea.
export const instant = false;

export default function CatalogoPage() {
  return <Catalogo />;
}
