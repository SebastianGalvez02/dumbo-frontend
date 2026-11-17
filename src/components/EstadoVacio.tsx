import { Icon, type IconName } from "./Icon";

interface EstadoVacioProps {
  icono: IconName;
  titulo: string;
  descripcion: string;
}

export function EstadoVacio({ icono, titulo, descripcion }: EstadoVacioProps) {
  return (
    <section className="panel empty-state">
      <span>
        <Icon name={icono} size={30} />
      </span>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </section>
  );
}
