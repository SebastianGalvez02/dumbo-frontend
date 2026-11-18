"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import type { DatosTrabajador } from "@/lib/trabajadores";
import { esTelefonoValido, formatearTelefono, MENSAJE_TELEFONO } from "@/lib/validaciones";

interface FormularioTrabajadorProps {
  esEdicion: boolean;
  inicial?: DatosTrabajador;
  error?: string;
  onCancelar: () => void;
  onEnviar: (datos: DatosTrabajador) => void;
}

export function FormularioTrabajador({ esEdicion, inicial, error, onCancelar, onEnviar }: FormularioTrabajadorProps) {
  // Errores detectados aquí, antes de enviar (el `error` de props viene del backend).
  const [errorLocal, setErrorLocal] = useState("");
  const mensajeError = errorLocal || error;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const leer = (campo: string) => String(form.get(campo) ?? "").trim();

    const telefono = leer("telefono");
    if (!esTelefonoValido(telefono)) {
      setErrorLocal(MENSAJE_TELEFONO);
      return;
    }

    setErrorLocal("");
    onEnviar({
      nombres: leer("nombres"),
      apellidos: leer("apellidos"),
      telefono: formatearTelefono(telefono),
      correo: leer("correo"),
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="titulo-formulario">
      <form className="person-modal" onSubmit={handleSubmit}>
        <div className="modal-title">
          <div>
            <p className="eyebrow">{esEdicion ? "Editar datos" : "Nueva cuenta"}</p>
            <h2 id="titulo-formulario">{esEdicion ? "Editar trabajador" : "Registrar trabajador"}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onCancelar} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Nombres
            <input name="nombres" defaultValue={inicial?.nombres} required />
          </label>
          <label>
            Apellidos
            <input name="apellidos" defaultValue={inicial?.apellidos} required />
          </label>
          <label>
            Teléfono
            <input
              name="telefono"
              type="tel"
              inputMode="tel"
              placeholder="+56 9 1234 5678"
              defaultValue={inicial?.telefono}
              required
            />
          </label>
          <label>
            Correo electrónico
            <input name="correo" type="email" placeholder="nombre@correo.cl" defaultValue={inicial?.correo} required />
          </label>
        </div>

        <div className="protected-field">
          <Icon name="lock" size={17} />
          {esEdicion
            ? "La contraseña no puede editarse desde esta sección."
            : "La contraseña inicial será el primer nombre y el primer apellido, sin tildes ni espacios (por ejemplo, JuanPerez). Deberá cambiarse en el primer acceso."}
        </div>

        {mensajeError && <Alerta tipo="error">{mensajeError}</Alerta>}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {esEdicion ? "Guardar cambios" : "Registrar trabajador"}
          </button>
        </div>
      </form>
    </div>
  );
}
