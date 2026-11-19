"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import type { UserContact } from "@/types/users";
import { esTelefonoValido, formatearTelefono, MENSAJE_TELEFONO } from "@/lib/validaciones";

interface EmployeeFormProps {
  isEditing: boolean;
  initialValues?: UserContact;
  error?: string;
  onCancel: () => void;
  onSubmit: (values: UserContact) => void;
}

export function EmployeeForm({ isEditing, initialValues, error, onCancel, onSubmit }: EmployeeFormProps) {
  const [localError, setLocalError] = useState("");
  const errorMessage = localError || error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const readField = (field: string) => String(form.get(field) ?? "").trim();

    const phone = readField("phone");
    if (!esTelefonoValido(phone)) {
      setLocalError(MENSAJE_TELEFONO);
      return;
    }

    setLocalError("");
    onSubmit({
      name: readField("name"),
      lastName: readField("lastName"),
      phone: formatearTelefono(phone),
      mail: readField("mail"),
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="titulo-formulario">
      <form className="person-modal" onSubmit={handleSubmit}>
        <div className="modal-title">
          <div>
            <p className="eyebrow">{isEditing ? "Editar datos" : "Nueva cuenta"}</p>
            <h2 id="titulo-formulario">{isEditing ? "Editar trabajador" : "Registrar trabajador"}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Nombres
            <input name="name" defaultValue={initialValues?.name} required />
          </label>
          <label>
            Apellidos
            <input name="lastName" defaultValue={initialValues?.lastName} required />
          </label>
          <label>
            Teléfono
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="+56 9 1234 5678"
              defaultValue={initialValues?.phone}
              required
            />
          </label>
          <label>
            Correo electrónico
            <input name="mail" type="email" placeholder="nombre@correo.cl" defaultValue={initialValues?.mail} required />
          </label>
        </div>

        <div className="protected-field">
          <Icon name="lock" size={17} />
          {isEditing
            ? "La contraseña no puede editarse desde esta sección."
            : "La contraseña inicial une todos los nombres y apellidos, en minúsculas y sin tildes ni espacios (por ejemplo, Juan Pérez → juanperez). Deberá cambiarse en el primer acceso."}
        </div>

        {errorMessage && <Alerta tipo="error">{errorMessage}</Alerta>}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Guardar cambios" : "Registrar trabajador"}
          </button>
        </div>
      </form>
    </div>
  );
}
