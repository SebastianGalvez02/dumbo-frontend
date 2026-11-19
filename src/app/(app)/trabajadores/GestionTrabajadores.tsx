"use client";

import { useEffect, useState } from "react";
import { services } from "@/services";
import type { Employee, UserContact } from "@/types/users";
import { mensajeDeServicio as getServiceErrorMessage } from "@/utils/mensaje-error";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmployeeForm } from "./FormularioTrabajador";

interface FormState {
  employee?: Employee;
  values?: UserContact;
  error?: string;
}

/** Acción que espera confirmación ("¿Está seguro?"). */
type EmployeeAction =
  | { kind: "create"; values: UserContact }
  | { kind: "edit"; employee: Employee; values: UserContact }
  | { kind: "status"; employee: Employee };

interface Notice {
  message: string;
  error?: boolean;
}

function getConfirmationDetails(action: EmployeeAction): string {
  if (action.kind === "create") return "Se creará una nueva cuenta de trabajador.";
  if (action.kind === "edit") return "Se guardarán los cambios realizados al trabajador.";
  const statusLabel = action.employee.isEnabled ? "deshabilitada" : "habilitada";
  return `La cuenta de ${action.employee.name} ${action.employee.lastName} será ${statusLabel}.`;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [action, setAction] = useState<EmployeeAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let isMounted = true;
    services.employees.list()
      .then((list) => {
        if (isMounted) setEmployees(list);
      })
      .catch((error: unknown) => {
        if (isMounted) setLoadError(getServiceErrorMessage(error));
      });
    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const search = query.trim().toLowerCase();
  const filteredEmployees = (employees ?? []).filter((employee) =>
    `${employee.name} ${employee.lastName} ${employee.mail} ${employee.phone}`.toLowerCase().includes(search),
  );

  function replaceEmployee(updatedEmployee: Employee) {
    setEmployees((list) => (list ?? []).map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee,
    ));
  }

  function handleFormSubmit(values: UserContact) {
    const employee = form?.employee;
    setForm(null);
    setAction(employee ? { kind: "edit", employee, values } : { kind: "create", values });
  }

  async function handleConfirm() {
    if (!action || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (action.kind === "create") {
        const newEmployee = await services.employees.create(action.values);
        setEmployees((list) => [...(list ?? []), newEmployee]);
        setNotice({ message: "Trabajador registrado correctamente" });
      } else if (action.kind === "edit") {
        const updatedEmployee = await services.employees.update(action.employee.id, action.values);
        replaceEmployee(updatedEmployee);
        setNotice({ message: "Cambios guardados correctamente" });
      } else {
        const isEnabled = !action.employee.isEnabled;
        const updatedEmployee = await services.employees.changeStatus(action.employee.id, { isEnabled });
        replaceEmployee(updatedEmployee);
        setNotice({ message: isEnabled ? "Trabajador habilitado" : "Trabajador deshabilitado" });
      }
    } catch (cause) {
      const error = getServiceErrorMessage(cause);
      if (action.kind === "status") {
        setNotice({ message: error, error: true });
      } else {
        setForm({
          employee: action.kind === "edit" ? action.employee : undefined,
          values: action.values,
          error,
        });
      }
    } finally {
      setAction(null);
      setIsSubmitting(false);
    }
  }

  function handleCancelConfirmation() {
    if (action && action.kind !== "status") {
      setForm({
        employee: action.kind === "edit" ? action.employee : undefined,
        values: action.values,
      });
    }
    setAction(null);
  }

  function handleRetry() {
    setLoadError("");
    setLoadAttempt((attempt) => attempt + 1);
  }

  function renderEmployees() {
    if (loadError) {
      return (
        <div className="p-6">
          <Alerta tipo="error">{loadError}</Alerta>
          <button type="button" className="btn btn-secondary" onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      );
    }

    if (employees === null) {
      return <p className="table-message">Cargando trabajadores...</p>;
    }

    if (filteredEmployees.length === 0) {
      return (
        <div className="empty-state compact">
          <span>
            <Icon name="users" size={30} />
          </span>
          <h2>No hay trabajadores para mostrar</h2>
          <p>Prueba con otra búsqueda o registra una nueva cuenta.</p>
        </div>
      );
    }

    return (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo electrónico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="person-cell">
                    <span>{employee.name.charAt(0)}</span>
                    <div>
                      <strong>
                        {employee.name} {employee.lastName}
                      </strong>
                      <small>ID #{String(employee.id).padStart(4, "0")}</small>
                    </div>
                  </div>
                </td>
                <td>{employee.phone}</td>
                <td>{employee.mail}</td>
                <td>
                  <span className={`status ${employee.isEnabled ? "" : "disabled"}`}>
                    {employee.isEnabled ? "Habilitado" : "Deshabilitado"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => setForm({ employee, values: employee })}>
                      <Icon name="edit" size={17} /> Editar
                    </button>
                    <button
                      type="button"
                      className={employee.isEnabled ? "danger-text" : ""}
                      onClick={() => setAction({ kind: "status", employee })}
                    >
                      {employee.isEnabled ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Icon name="search" />
            <input
              placeholder="Buscar trabajadores..."
              aria-label="Buscar trabajadores"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setForm({})}
            disabled={employees === null}
          >
            <Icon name="plus" /> Registrar trabajador
          </button>
        </div>

        {renderEmployees()}
      </div>

      {form && (
        <EmployeeForm
          isEditing={Boolean(form.employee)}
          initialValues={form.values}
          error={form.error}
          onCancel={() => setForm(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {action && (
        <ConfirmModal
          detalle={getConfirmationDetails(action)}
          procesando={isSubmitting}
          onCancelar={handleCancelConfirmation}
          onConfirmar={handleConfirm}
        />
      )}

      {notice && (
        <div className={`toast ${notice.error ? "danger" : ""}`} role="status">
          {notice.message}
        </div>
      )}
    </>
  );
}
