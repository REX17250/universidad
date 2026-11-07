"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  API_URL,
  ApiError,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerEstado,
  type DatosProducto,
  type Estado,
  type Producto,
} from "../lib/api";

type Resultado = { clave: string; datos: Producto[] | null; error: string | null };
type Formulario = { id: number | null; nombre: string; precio: string; stock: string };
const FORMULARIO_VACIO: Formulario = { id: null, nombre: "", precio: "", stock: "" };

const formatoPrecio = new Intl.NumberFormat("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const textoError = (e: unknown) => (e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");

const campo =
  "min-h-11 w-full rounded-xl border border-foreground/20 bg-background px-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";
const botonPrimario =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50";
const botonSecundario =
  "inline-flex min-h-9 items-center justify-center rounded-full border border-foreground/20 px-4 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:opacity-50";

export function ProductosApp() {
  const [estado, setEstado] = useState<Estado | "error" | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [version, setVersion] = useState(0);
  const [lento, setLento] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [consulta, setConsulta] = useState("");
  const [form, setForm] = useState<Formulario>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<number | null>(null);

  // El resultado guarda la consulta que lo produjo: si no coincide con la actual, la lista está cargando
  const clave = `${version}:${consulta}`;
  const cargando = resultado?.clave !== clave;
  const productos = resultado?.datos ?? null;
  const errorLista = errorAccion ?? resultado?.error ?? null;
  const recargar = () => {
    setErrorAccion(null);
    setVersion((v) => v + 1);
  };

  useEffect(() => {
    obtenerEstado().then(setEstado, () => setEstado("error"));
  }, []);

  // Espera 300 ms después de escribir antes de buscar en el backend
  useEffect(() => {
    const t = setTimeout(() => setConsulta(busqueda.trim()), 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  // Si la carga tarda, el servidor gratuito de Render probablemente se está despertando
  useEffect(() => {
    if (!cargando) return;
    const t = setTimeout(() => setLento(true), 4000);
    return () => {
      clearTimeout(t);
      setLento(false);
    };
  }, [cargando]);

  // Si cambia la consulta mientras hay una petición en vuelo, la respuesta vieja se descarta
  useEffect(() => {
    let vigente = true;
    listarProductos(consulta).then(
      (datos) => {
        if (vigente) setResultado({ clave, datos, error: null });
      },
      (e) => {
        if (vigente) setResultado({ clave, datos: null, error: textoError(e) });
      },
    );
    return () => {
      vigente = false;
    };
  }, [clave, consulta]);

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    setMensaje(null);
    try {
      const datos: DatosProducto = { nombre: form.nombre };
      if (form.precio.trim() !== "") datos.precio = Number(form.precio);
      if (form.stock.trim() !== "") datos.stock = Number(form.stock);
      if (form.id === null) {
        await crearProducto(datos);
        setMensaje("Producto creado.");
      } else {
        await actualizarProducto(form.id, datos);
        setMensaje("Producto actualizado.");
      }
      setForm(FORMULARIO_VACIO);
      recargar();
    } catch (e) {
      setErrorForm(textoError(e));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: number) {
    setErrorAccion(null);
    setMensaje(null);
    try {
      await eliminarProducto(id);
      setConfirmando(null);
      if (form.id === id) setForm(FORMULARIO_VACIO);
      setMensaje("Producto eliminado.");
      recargar();
    } catch (e) {
      setConfirmando(null);
      setErrorAccion(textoError(e));
    }
  }

  function editar(p: Producto) {
    setErrorForm(null);
    setMensaje(null);
    setForm({ id: p.id, nombre: p.nombre, precio: String(p.precio), stock: String(p.stock) });
  }

  return (
    <section aria-labelledby="titulo-productos" className="mt-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="titulo-productos" className="text-3xl font-bold tracking-tight">
            Productos
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            Datos en vivo desde el backend: <span className="font-mono">{API_URL}</span>
          </p>
        </div>
        <EstadoServidor estado={estado} />
      </div>

      <p role="status" className="mt-4 min-h-6 text-sm font-medium text-emerald-600">
        {mensaje}
      </p>

      <div className="mt-2 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={guardar} className="h-fit space-y-4 rounded-2xl border border-foreground/10 bg-foreground/[.03] p-6">
          <h2 className="text-lg font-semibold">{form.id === null ? "Nuevo producto" : `Editar producto #${form.id}`}</h2>

          <div className="space-y-1.5">
            <label htmlFor="nombre" className="block text-sm font-semibold">
              Nombre
            </label>
            <input
              id="nombre"
              className={campo}
              value={form.nombre}
              maxLength={100}
              required
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="precio" className="block text-sm font-semibold">
              Precio
            </label>
            <input
              id="precio"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              className={campo}
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="stock" className="block text-sm font-semibold">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              inputMode="numeric"
              min={0}
              step="1"
              className={campo}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          {errorForm && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
              {errorForm}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={botonPrimario} disabled={guardando}>
              {guardando ? "Guardando…" : form.id === null ? "Crear producto" : "Guardar cambios"}
            </button>
            {form.id !== null && (
              <button type="button" className={botonSecundario} disabled={guardando} onClick={() => setForm(FORMULARIO_VACIO)}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div>
          <label htmlFor="busqueda" className="block text-sm font-semibold">
            Buscar por nombre
          </label>
          <input
            id="busqueda"
            type="search"
            className={`${campo} mt-1.5 max-w-md`}
            placeholder="Ej.: laptop"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {errorLista && (
            <div role="alert" className="mt-4 space-y-3 rounded-lg bg-red-500/10 px-3 py-3 text-sm font-medium text-red-600">
              <p>{errorLista}</p>
              <button type="button" className={botonSecundario} onClick={recargar}>
                Reintentar
              </button>
            </div>
          )}

          {cargando && (
            <p role="status" className="mt-4 text-sm text-foreground/70">
              Cargando productos…{" "}
              {lento && "El servidor gratuito de Render se está despertando; la primera carga puede tardar cerca de un minuto."}
            </p>
          )}

          {!cargando && !errorLista && productos && productos.length === 0 && (
            <p className="mt-6 rounded-2xl border border-dashed border-foreground/20 p-8 text-center text-foreground/70">
              {consulta ? `No hay productos que coincidan con "${consulta}".` : "Aún no hay productos. Crea el primero con el formulario."}
            </p>
          )}

          {productos && productos.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-foreground/10">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">Lista de productos</caption>
                <thead className="bg-foreground/[.05] text-foreground/70">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">ID</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Precio</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Stock</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-mono text-foreground/60">{p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.nombre}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatoPrecio.format(p.precio)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          {confirmando === p.id ? (
                            <>
                              <span className="self-center text-xs font-semibold">¿Eliminar?</span>
                              <button type="button" className={`${botonSecundario} border-red-500/50 text-red-600`} onClick={() => void eliminar(p.id)}>
                                Sí
                              </button>
                              <button type="button" className={botonSecundario} onClick={() => setConfirmando(null)}>
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" className={botonSecundario} onClick={() => editar(p)} aria-label={`Editar ${p.nombre}`}>
                                Editar
                              </button>
                              <button type="button" className={botonSecundario} onClick={() => setConfirmando(p.id)} aria-label={`Eliminar ${p.nombre}`}>
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EstadoServidor({ estado }: { estado: Estado | "error" | null }) {
  const base = "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium";
  if (estado === null) {
    return <span className={`${base} border-foreground/20 text-foreground/70`}>Conectando con el backend…</span>;
  }
  if (estado === "error") {
    return <span className={`${base} border-red-500/40 bg-red-500/10 text-red-600`}>● Backend sin respuesta</span>;
  }
  const bien = estado.estado === "ok";
  return (
    <span className={`${base} ${bien ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600" : "border-amber-500/40 bg-amber-500/10 text-amber-600"}`}>
      ● Backend {bien ? "conectado" : "degradado"} · BD {estado.baseDeDatos} · commit <span className="font-mono">{estado.commit}</span>
    </span>
  );
}
