"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { services } from "@/services";
import type { ImportProductsResult } from "@/types/product";
import { mensajeDeServicio } from "@/utils/mensaje-error";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import { ConfirmModal } from "@/components/ConfirmModal";

const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB, igual que el backend
const EXTENSIONES_VALIDAS = /\.(csv|xlsx)$/i;

export function ImportarProductos() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<ImportProductsResult | null>(null);

  function limpiarInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  function elegir(elegido: File | null) {
    setError("");
    setResultado(null);

    if (elegido && !EXTENSIONES_VALIDAS.test(elegido.name)) {
      setError("Selecciona un archivo CSV o Excel (.xlsx).");
      setArchivo(null);
      limpiarInput();
      return;
    }
    if (elegido && elegido.size > TAMANO_MAXIMO) {
      setError("El archivo supera el máximo de 5 MB.");
      setArchivo(null);
      limpiarInput();
      return;
    }
    setArchivo(elegido);
  }

  function alSeleccionar(e: ChangeEvent<HTMLInputElement>) {
    elegir(e.target.files?.[0] ?? null);
  }

  function alSoltar(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    elegir(e.dataTransfer.files[0] ?? null);
  }

  async function confirmar() {
    if (!archivo) return;
    setProcesando(true);

    try {
      setResultado(await services.products.importProducts({ file: archivo }));
      setArchivo(null);
      limpiarInput();
    } catch (err) {
      setError(mensajeDeServicio(err));
    } finally {
      setConfirmando(false);
      setProcesando(false);
    }
  }

  const creados = resultado?.createdProducts.length ?? 0;
  const rechazados = resultado?.rejectedRows ?? [];

  return (
    <aside className="panel import-panel">
      <span className="panel-icon large">
        <Icon name="file" size={27} />
      </span>
      <p className="eyebrow">Carga masiva</p>
      <h2>Importar inventario</h2>
      <p>Agrega múltiples productos desde un archivo estructurado. Validaremos los datos antes de ingresarlos.</p>

      <label className="drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={alSoltar}>
        <Icon name="file" size={30} />
        <strong>{archivo?.name ?? "Selecciona o arrastra un archivo"}</strong>
        <span>Formatos .CSV o .XLSX · Máx. 5 MB</span>
        <input ref={inputRef} type="file" accept=".csv,.xlsx" onChange={alSeleccionar} />
      </label>

      <button
        type="button"
        className="btn btn-secondary btn-wide"
        disabled={!archivo}
        onClick={() => setConfirmando(true)}
      >
        Cargar productos
      </button>

      {error && <Alerta tipo="error">{error}</Alerta>}

      {resultado && creados > 0 && (
        <Alerta tipo="exito">
          {creados === 1 ? "1 producto registrado correctamente." : `${creados} productos registrados correctamente.`}
        </Alerta>
      )}

      {resultado && creados === 0 && rechazados.length === 0 && (
        <Alerta tipo="error">El archivo no contiene productos.</Alerta>
      )}

      {rechazados.length > 0 && (
        <div className="import-error-list" role="alert">
          <strong>
            {rechazados.length === 1
              ? "1 registro no pudo importarse"
              : `${rechazados.length} registros no pudieron importarse`}
          </strong>
          {rechazados.map((fila) => (
            <span key={fila.rowNumber}>
              Fila {fila.rowNumber}
              {fila.code ? ` · Código ${fila.code}` : ""} · {fila.messages.join(" ")}
            </span>
          ))}
          <small>Corrige estos registros y vuelve a cargar el archivo.</small>
        </div>
      )}

      {confirmando && archivo && (
        <ConfirmModal
          detalle={`Se registrarán los productos contenidos en ${archivo.name}.`}
          procesando={procesando}
          onCancelar={() => setConfirmando(false)}
          onConfirmar={confirmar}
        />
      )}
    </aside>
  );
}
