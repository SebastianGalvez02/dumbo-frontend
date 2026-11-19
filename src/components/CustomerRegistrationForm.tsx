"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Alerta, Campo } from "@/components/formulario";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  esTelefonoValido as isValidPhone,
  formatearTelefono as formatPhone,
  MENSAJE_TELEFONO as INVALID_PHONE_MESSAGE,
} from "@/lib/validaciones";
import { services } from "@/services";
import type { Customer, RegisterCustomerInput } from "@/types/users";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";

type RegistrationMode = "self" | "employee";

interface CustomerRegistrationFormProps {
  mode: RegistrationMode;
  /** Si se entrega, se llama al registrar (en vez de mostrar el aviso interno). */
  onRegistered?: (customer: Customer) => void;
  /** Si se entrega, se muestra un botón "Cancelar" (por ejemplo, dentro de una ventana). */
  onCancel?: () => void;
}

export function CustomerRegistrationForm({ mode, onRegistered, onCancel }: CustomerRegistrationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [registeredMail, setRegisteredMail] = useState("");
  const [pendingInput, setPendingInput] = useState<RegisterCustomerInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSelfRegistration = mode === "self";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
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

    // Se pide confirmación con la ventana del diseño antes de registrar.
    setPendingInput({ name, lastName, phone: formatPhone(phone), mail });
  }

  async function confirmRegistration() {
    if (!pendingInput) return;
    setIsSubmitting(true);

    try {
      const customer = isSelfRegistration
        ? await services.customers.register(pendingInput)
        : await services.customers.registerByEmployee(pendingInput);

      formRef.current?.reset();
      if (onRegistered) onRegistered(customer);
      else setRegisteredMail(customer.mail);
    } catch (error) {
      setError(getServiceErrorMessage(error));
    } finally {
      setPendingInput(null);
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

  const submitLabel = isSubmitting
    ? "Registrando..."
    : isSelfRegistration
      ? "Crear cuenta"
      : "Registrar cliente";

  return (
    <>
      <form ref={formRef} className="grid gap-4" onSubmit={handleSubmit}>
        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={isSubmitting}>
          <Campo etiqueta="Nombres" icono="users" name="name" autoComplete="given-name" required />
          <Campo etiqueta="Apellidos" icono="users" name="lastName" autoComplete="family-name" required />
          <Campo
            etiqueta="Teléfono"
            icono="phone"
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

        {onCancel ? (
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {submitLabel}
            </button>
          </div>
        ) : (
          <button className="btn btn-primary justify-self-start" type="submit" disabled={isSubmitting}>
            {submitLabel}
          </button>
        )}
      </form>

      {pendingInput && (
        <ConfirmModal
          detalle={
            isSelfRegistration
              ? "Se creará tu cuenta de cliente con los datos ingresados."
              : "Se creará una nueva cuenta de cliente con los datos ingresados."
          }
          procesando={isSubmitting}
          onCancelar={() => setPendingInput(null)}
          onConfirmar={confirmRegistration}
        />
      )}
    </>
  );
}
