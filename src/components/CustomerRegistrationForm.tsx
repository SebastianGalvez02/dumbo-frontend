"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alerta, Campo } from "@/components/formulario";
import {
  esTelefonoValido as isValidPhone,
  formatearTelefono as formatPhone,
  MENSAJE_TELEFONO as INVALID_PHONE_MESSAGE,
} from "@/lib/validaciones";
import { services } from "@/services";
import type { RegisterCustomerInput } from "@/types/users";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";

type RegistrationMode = "self" | "employee";

export function CustomerRegistrationForm({ mode }: { mode: RegistrationMode }) {
  const [error, setError] = useState("");
  const [registeredMail, setRegisteredMail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSelfRegistration = mode === "self";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const readField = (field: keyof RegisterCustomerInput) =>
      String(formData.get(field) ?? "").trim();

    const name = readField("name");
    const lastName = readField("lastName");
    const phone = readField("phone");
    const mail = readField("mail");

    setError("");
    setRegisteredMail("");

    if (!name || !lastName || !phone || !mail) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError(INVALID_PHONE_MESSAGE);
      return;
    }
    if (!window.confirm("¿Está seguro de registrar esta cuenta?")) return;

    setIsSubmitting(true);
    const input: RegisterCustomerInput = { name, lastName, phone: formatPhone(phone), mail };

    try {
      const customer = isSelfRegistration
        ? await services.customers.register(input)
        : await services.customers.registerByEmployee(input);

      form.reset();
      setRegisteredMail(customer.mail);
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSelfRegistration && registeredMail) {
    return (
      <div className="grid gap-4">
        <Alerta tipo="exito">Cuenta creada para {registeredMail}.</Alerta>
        <p className="text-sm text-(--muted)">
          Para entrar por primera vez, usa tus nombres y apellidos unidos en minúsculas,
          sin espacios ni tildes, como contraseña. El sistema te pedirá cambiarla.
        </p>
        <Link href="/login" className="btn btn-primary btn-wide">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <fieldset className="grid gap-4 sm:grid-cols-2" disabled={isSubmitting}>
        <Campo etiqueta="Nombres" icono="users" name="name" autoComplete="given-name" required />
        <Campo etiqueta="Apellidos" icono="users" name="lastName" autoComplete="family-name" required />
        <Campo
          etiqueta="Teléfono"
          icono="users"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+56 9 1234 5678"
          required
        />
        <Campo
          etiqueta="Correo electrónico"
          icono="mail"
          name="mail"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.cl"
          required
        />
      </fieldset>

      {error && <Alerta tipo="error">{error}</Alerta>}
      {registeredMail && (
        <Alerta tipo="exito">
          Cliente registrado con el correo {registeredMail}. El sistema le pedirá cambiar
          su contraseña inicial cuando inicie sesión.
        </Alerta>
      )}

      {!isSelfRegistration && (
        <p className="text-sm text-(--muted)">
          La contraseña inicial se genera con los nombres y apellidos unidos,
          en minúsculas, sin espacios ni tildes.
        </p>
      )}

      <button className="btn btn-primary justify-self-start" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : isSelfRegistration ? "Crear cuenta" : "Registrar cliente"}
      </button>
    </form>
  );
}
