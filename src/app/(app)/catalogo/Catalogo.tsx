"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { services } from "@/services";
import type { Product } from "@/types/product";
import { mensajeDeServicio } from "@/utils/mensaje-error";
import { Icon } from "@/components/Icon";
import { Alerta } from "@/components/formulario";

const formatoPrecio = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

export function Catalogo() {
  const [productos, setProductos] = useState<Product[] | null>(null);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  // Carga inicial de los productos.
  useEffect(() => {
    let activo = true;
    services.products
      .list()
      .then((lista) => {
        if (activo) setProductos(lista);
      })
      .catch((err: unknown) => {
        if (activo) setError(mensajeDeServicio(err));
      });
    return () => {
      activo = false;
    };
  }, []);

  if (error) return <Alerta tipo="error">{error}</Alerta>;
  if (productos === null) return <p className="table-message">Cargando productos...</p>;

  // Las categorías salen de los productos, así aparecen solas las nuevas.
  const categorias = ["Todos", ...new Set(productos.map((p) => p.category))];

  const texto = busqueda.trim().toLowerCase();
  const visibles = productos.filter(
    (p) =>
      (categoria === "Todos" || p.category === categoria) &&
      `${p.name} ${p.brand}`.toLowerCase().includes(texto),
  );

  return (
    <section>
      <div className="catalog-toolbar">
        <div className="search-box">
          <Icon name="search" />
          <input
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="filter-row" role="group" aria-label="Filtrar por categoría">
          {categorias.map((item) => (
            <button
              key={item}
              type="button"
              className={categoria === item ? "active" : ""}
              aria-pressed={categoria === item}
              onClick={() => setCategoria(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="panel empty-state">
          <span>
            <Icon name="search" size={30} />
          </span>
          <h2>No hay productos para mostrar</h2>
          <p>Prueba con otra búsqueda o categoría.</p>
        </div>
      ) : (
        <div className="products-grid">
          {visibles.map((p, indice) => (
            <article className="product-card" key={p.id}>
              <div className="product-image">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    unoptimized
                    // La primera fila se ve al abrir la página: se carga de inmediato.
                    loading={indice < 4 ? "eager" : "lazy"}
                    className="product-photo"
                  />
                ) : (
                  <span className="product-placeholder">
                    <Icon name="box" size={36} />
                  </span>
                )}
                <span className={`stock-badge ${p.stock > 0 ? "" : "out"}`}>
                  {p.stock > 0 ? "Disponible" : "Sin stock"}
                </span>
              </div>
              <div className="product-info">
                <span>{p.category}</span>
                <h3>{p.name}</h3>
                <div className="product-bottom">
                  <strong className="price">{formatoPrecio.format(p.price)}</strong>
                  <small className="product-brand">{p.brand}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
