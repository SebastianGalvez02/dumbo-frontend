"use client";

import { useEffect, useState } from "react";
import { mensajeDeError } from "@/lib/api";
import {
  cambiarEstadoTrabajador,
  crearTrabajador,
  editarTrabajador,
  listarTrabajadores,
  type DatosTrabajador,
  type Trabajador,
} from "@/lib/trabajadores";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import { ConfirmModal } from "@/components/ConfirmModal";
import { FormularioTrabajador } from "./FormularioTrabajador";

/** Formulario abierto: sin `trabajador` es registro; con `trabajador` es edición. */
interface Formulario {
  trabajador?: Trabajador;
  datos?: DatosTrabajador;
  error?: string;
}

/** Acción que espera confirmación ("¿Está seguro?"). */
type Accion =
  | { tipo: "registrar"; datos: DatosTrabajador }
  | { tipo: "editar"; trabajador: Trabajador; datos: DatosTrabajador }
  | { tipo: "estado"; trabajador: Trabajador };

interface Aviso {
  mensaje: string;
  error?: boolean;
}

function detalleDe(accion: Accion): string {
  if (accion.tipo === "registrar") return "Se creará una nueva cuenta de trabajador.";
  if (accion.tipo === "editar") return "Se guardarán los cambios realizados al trabajador.";
  const estado = accion.trabajador.habilitado ? "deshabilitada" : "habilitada";
  return `La cuenta de ${accion.trabajador.nombres} ${accion.trabajador.apellidos} será ${estado}.`;
}

export function GestionTrabajadores() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[] | null>(null);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [accion, setAccion] = useState<Accion | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  // Carga inicial de la lista.
  useEffect(() => {
    let activo = true;
    listarTrabajadores()
      .then((lista) => {
        if (activo) setTrabajadores(lista);
      })
      .catch((err: unknown) => {
        if (activo) setErrorCarga(mensajeDeError(err));
      });
    return () => {
      activo = false;
    };
  }, []);

  const texto = busqueda.trim().toLowerCase();
  const filtrados = (trabajadores ?? []).filter((t) =>
    `${t.nombres} ${t.apellidos} ${t.correo} ${t.telefono}`.toLowerCase().includes(texto),
  );

  function mostrarAviso(nuevo: Aviso) {
    setAviso(nuevo);
    setTimeout(() => setAviso(null), 3500);
  }

  function actualizarEnLista(id: number, cambios: Partial<Trabajador>) {
    setTrabajadores((lista) => (lista ?? []).map((t) => (t.id === id ? { ...t, ...cambios } : t)));
  }

  function enviarFormulario(datos: DatosTrabajador) {
    const trabajador = formulario?.trabajador;
    setFormulario(null);
    setAccion(trabajador ? { tipo: "editar", trabajador, datos } : { tipo: "registrar", datos });
  }

  async function confirmar() {
    if (!accion) return;
    setProcesando(true);

    try {
      if (accion.tipo === "registrar") {
        const nuevo = await crearTrabajador(accion.datos);
        setTrabajadores((lista) => [...(lista ?? []), nuevo]);
        mostrarAviso({ mensaje: "Trabajador registrado correctamente" });
      } else if (accion.tipo === "editar") {
        await editarTrabajador(accion.trabajador.id, accion.datos);
        actualizarEnLista(accion.trabajador.id, accion.datos);
        mostrarAviso({ mensaje: "Cambios guardados correctamente" });
      } else {
        const habilitado = !accion.trabajador.habilitado;
        await cambiarEstadoTrabajador(accion.trabajador.id, habilitado);
        actualizarEnLista(accion.trabajador.id, { habilitado });
        mostrarAviso({ mensaje: habilitado ? "Trabajador habilitado" : "Trabajador deshabilitado" });
      }
    } catch (err) {
      const error = mensajeDeError(err);
      if (accion.tipo === "estado") {
        mostrarAviso({ mensaje: error, error: true });
      } else {
        // Se reabre el formulario con lo que el usuario había escrito y el error del backend.
        setFormulario({
          trabajador: accion.tipo === "editar" ? accion.trabajador : undefined,
          datos: accion.datos,
          error,
        });
      }
    } finally {
      setAccion(null);
      setProcesando(false);
    }
  }

  function contenido() {
    if (errorCarga) {
      return (
        <div className="p-6">
          <Alerta tipo="error">{errorCarga}</Alerta>
        </div>
      );
    }

    if (trabajadores === null) {
      return <p className="table-message">Cargando trabajadores...</p>;
    }

    if (filtrados.length === 0) {
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
            {filtrados.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className="person-cell">
                    <span>{t.nombres.charAt(0)}</span>
                    <div>
                      <strong>
                        {t.nombres} {t.apellidos}
                      </strong>
                      <small>ID #{String(t.id).padStart(4, "0")}</small>
                    </div>
                  </div>
                </td>
                <td>{t.telefono}</td>
                <td>{t.correo}</td>
                <td>
                  <span className={`status ${t.habilitado ? "" : "disabled"}`}>
                    {t.habilitado ? "Habilitado" : "Deshabilitado"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => setFormulario({ trabajador: t, datos: t })}>
                      <Icon name="edit" size={17} /> Editar
                    </button>
                    <button
                      type="button"
                      className={t.habilitado ? "danger-text" : ""}
                      onClick={() => setAccion({ tipo: "estado", trabajador: t })}
                    >
                      {t.habilitado ? "Deshabilitar" : "Habilitar"}
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
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setFormulario({})}>
            <Icon name="plus" /> Registrar trabajador
          </button>
        </div>

        {contenido()}
      </div>

      {formulario && (
        <FormularioTrabajador
          esEdicion={Boolean(formulario.trabajador)}
          inicial={formulario.datos}
          error={formulario.error}
          onCancelar={() => setFormulario(null)}
          onEnviar={enviarFormulario}
        />
      )}

      {accion && (
        <ConfirmModal
          detalle={detalleDe(accion)}
          procesando={procesando}
          onCancelar={() => setAccion(null)}
          onConfirmar={confirmar}
        />
      )}

      {aviso && (
        <div className={`toast ${aviso.error ? "danger" : ""}`} role="status">
          {aviso.mensaje}
        </div>
      )}
    </>
  );
}
