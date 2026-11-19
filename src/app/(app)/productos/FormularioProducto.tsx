"use client";

import { useRef, useState, type FormEvent } from "react";
import { services } from "@/services";
import type { CreateProductInput } from "@/types/product";
import { mensajeDeServicio } from "@/utils/mensaje-error";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";
import { ConfirmModal } from "@/components/ConfirmModal";

const CATEGORIAS = ["Frutas", "Verduras", "Despensa", "Lácteos"];

export function FormularioProducto() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pendiente, setPendiente] = useState<CreateProductInput | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setExito("");

    const form = new FormData(e.currentTarget);
    const texto = (campo: string) => String(form.get(campo) ?? "").trim();

    const imagen = form.get("imagen");
    const archivo = imagen instanceof File && imagen.size > 0 ? imagen : undefined;
    if (archivo && !archivo.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen.");
      return;
    }

    // Se guarda y se pide confirmación antes de registrar.
    setPendiente({
      code: texto("codigo"),
      brand: texto("marca"),
      name: texto("nombre"),
      description: texto("descripcion"),
      category: texto("categoria"),
      price: Number(form.get("precio")),
      stock: Number(form.get("stock")),
      image: archivo,
    });
  }

  async function confirmar() {
    if (!pendiente) return;
    setProcesando(true);

    try {
      const producto = await services.products.create(pendiente);
      formRef.current?.reset();
      setExito(`Producto "${producto.name}" registrado correctamente.`);
    } catch (err) {
      setError(mensajeDeServicio(err));
    } finally {
      setPendiente(null);
      setProcesando(false);
    }
  }

  function limpiarMensajes() {
    setError("");
    setExito("");
  }

  return (
    <>
      <form ref={formRef} className="panel form-panel" onSubmit={handleSubmit} onReset={limpiarMensajes}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Ingreso individual</p>
            <h2>Nuevo producto</h2>
          </div>
          <span className="panel-icon">
            <Icon name="box" />
          </span>
        </div>

        <div className="form-grid">
          <label>
            Código
            <input name="codigo" placeholder="Ej. PRD-104" required />
          </label>
          <label>
            Marca
            <input name="marca" placeholder="Ej. Dumbo Selección" required />
          </label>
          <label className="span-2">
            Nombre del producto
            <input name="nombre" placeholder="Ej. Leche descremada 1 L" required />
          </label>
          <label className="span-2">
            Descripción
            <textarea
              name="descripcion"
              placeholder="Describe las principales características..."
              rows={4}
              required
            />
          </label>
          <label>
            Categoría
            <select name="categoria" defaultValue="" required>
              <option value="" disabled>
                Seleccionar
              </option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria}>{categoria}</option>
              ))}
            </select>
          </label>
          <label>
            Precio
            <input name="precio" type="number" placeholder="$ 0" min="1" step="1" required />
          </label>
          <label>
            Stock inicial
            <input name="stock" type="number" placeholder="0 unidades" min="0" step="1" required />
          </label>
          <label>
            Imagen
            <input name="imagen" type="file" accept="image/*" />
          </label>
        </div>

        {error && <Alerta tipo="error">{error}</Alerta>}
        {exito && <Alerta tipo="exito">{exito}</Alerta>}

        <div className="form-actions">
          <button type="reset" className="btn btn-secondary">
            Limpiar
          </button>
          <button type="submit" className="btn btn-primary">
            <Icon name="plus" /> Registrar producto
          </button>
        </div>
      </form>

      {pendiente && (
        <ConfirmModal
          detalle="El producto será agregado al inventario y quedará disponible para la venta."
          procesando={procesando}
          onCancelar={() => setPendiente(null)}
          onConfirmar={confirmar}
        />
      )}
    </>
  );
}
