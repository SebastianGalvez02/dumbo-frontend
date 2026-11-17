import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type CampoProps = { etiqueta: string; icono: IconName } & InputHTMLAttributes<HTMLInputElement>;

export function Campo({ etiqueta, icono, ...props }: CampoProps) {
  return (
    <label>
      {etiqueta}
      <span className="input-shell">
        <Icon name={icono} />
        <input {...props} />
      </span>
    </label>
  );
}

export function Alerta({ tipo, children }: { tipo: "error" | "exito"; children: ReactNode }) {
  return (
    <div role="alert" className={`alert ${tipo === "error" ? "alert-error" : "alert-success"}`}>
      {children}
    </div>
  );
}
