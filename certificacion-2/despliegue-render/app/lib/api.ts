// Cliente del backend desplegado en Render. Se puede cambiar al compilar con NEXT_PUBLIC_API_URL
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://backendupbtest-gftj.onrender.com").replace(/\/+$/, "");

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  createdAt: string;
};

export type DatosProducto = {
  nombre?: string;
  precio?: number;
  stock?: number;
};

export type Estado = {
  servicio: string;
  estado: string;
  baseDeDatos: string;
  commit: string;
  iniciadoEn: string;
  uptimeSegundos: number;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// El plan gratuito de Render duerme el servicio y la primera petición puede tardar cerca de un minuto
const TIEMPO_MAXIMO_MS = 90_000;

async function pedir(ruta: string, init: RequestInit = {}): Promise<Response> {
  const headers: HeadersInit = init.body ? { "Content-Type": "application/json" } : {};
  try {
    return await fetch(API_URL + ruta, { ...init, headers, signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  }
}

async function leer<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, cuerpo?.error ?? `El servidor respondió con error ${res.status}`);
  return cuerpo as T;
}

export async function listarProductos(nombre = ""): Promise<Producto[]> {
  const consulta = nombre ? `?nombre=${encodeURIComponent(nombre)}` : "";
  return leer<Producto[]>(await pedir(`/api/productos${consulta}`));
}

export async function crearProducto(datos: DatosProducto): Promise<Producto> {
  return leer<Producto>(await pedir("/api/productos", { method: "POST", body: JSON.stringify(datos) }));
}

export async function actualizarProducto(id: number, datos: DatosProducto): Promise<Producto> {
  return leer<Producto>(await pedir(`/api/productos/${id}`, { method: "PUT", body: JSON.stringify(datos) }));
}

export async function eliminarProducto(id: number): Promise<void> {
  return leer<void>(await pedir(`/api/productos/${id}`, { method: "DELETE" }));
}

// /api/estado responde 503 con el mismo formato cuando la base de datos falla, por eso no se trata como error
export async function obtenerEstado(): Promise<Estado> {
  const res = await pedir("/api/estado");
  const cuerpo = await res.json().catch(() => null);
  if (!cuerpo || typeof cuerpo.estado !== "string") {
    throw new ApiError(res.status, "El servidor no devolvió su estado");
  }
  return cuerpo as Estado;
}
