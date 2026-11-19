"use client";

import { useEffect, useState } from "react";
import { services } from "@/services";
import type { Customer } from "@/types/users";
import { mensajeDeServicio } from "@/utils/mensaje-error";
import { CustomerRegistrationForm } from "@/components/CustomerRegistrationForm";
import { Alerta } from "@/components/formulario";
import { Icon } from "@/components/Icon";

export function GestionClientes() {
  const [clientes, setClientes] = useState<Customer[] | null>(null);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [aviso, setAviso] = useState("");

  // Carga inicial de la lista.
  useEffect(() => {
    let activo = true;
    services.customers
      .list()
      .then((lista) => {
        if (activo) setClientes(lista);
      })
      .catch((err: unknown) => {
        if (activo) setErrorCarga(mensajeDeServicio(err));
      });
    return () => {
      activo = false;
    };
  }, []);

  const texto = busqueda.trim().toLowerCase();
  const filtrados = (clientes ?? []).filter((c) =>
    `${c.name} ${c.lastName} ${c.mail} ${c.phone}`.toLowerCase().includes(texto),
  );

  function alRegistrar(cliente: Customer) {
    setRegistrando(false);
    setClientes((lista) => [cliente, ...(lista ?? [])]);
    setAviso(`Cliente registrado con el correo ${cliente.mail}`);
    setTimeout(() => setAviso(""), 3500);
  }

  function contenido() {
    if (errorCarga) {
      return (
        <div className="p-6">
          <Alerta tipo="error">{errorCarga}</Alerta>
        </div>
      );
    }

    if (clientes === null) {
      return <p className="table-message">Cargando clientes...</p>;
    }

    if (filtrados.length === 0) {
      return (
        <div className="empty-state compact">
          <span>
            <Icon name="users" size={30} />
          </span>
          <h2>No hay clientes para mostrar</h2>
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
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="person-cell">
                    <span>{c.name.charAt(0)}</span>
                    <div>
                      <strong>
                        {c.name} {c.lastName}
                      </strong>
                      <small>ID #{String(c.id).padStart(4, "0")}</small>
                    </div>
                  </div>
                </td>
                <td>{c.phone}</td>
                <td>{c.mail}</td>
                <td>
                  <span className={`status ${c.isEnabled ? "" : "disabled"}`}>
                    {c.isEnabled ? "Habilitado" : "Deshabilitado"}
                  </span>
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
              placeholder="Buscar clientes..."
              aria-label="Buscar clientes"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setRegistrando(true)}>
            <Icon name="plus" /> Registrar cliente
          </button>
        </div>

        {contenido()}
      </div>

      {registrando && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="titulo-registro-cliente">
          <div className="person-modal">
            <div className="modal-title">
              <div>
                <p className="eyebrow">Nueva cuenta</p>
                <h2 id="titulo-registro-cliente">Registrar cliente</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setRegistrando(false)} aria-label="Cerrar">
                <Icon name="close" />
              </button>
            </div>
            <CustomerRegistrationForm
              mode="employee"
              onRegistered={alRegistrar}
              onCancel={() => setRegistrando(false)}
            />
          </div>
        </div>
      )}

      {aviso && (
        <div className="toast" role="status">
          {aviso}
        </div>
      )}
    </>
  );
}
