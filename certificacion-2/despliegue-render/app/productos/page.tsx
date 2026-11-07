import type { Metadata } from "next";
import Link from "next/link";
import { ProductosApp } from "./productos-app";

export const metadata: Metadata = {
  title: "Productos — Prueba1",
  description: "Gestión de productos conectada al backend desplegado en Render.",
};

export default function PaginaProductos() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-foreground/70 hover:text-indigo-500">
        ← Volver al inicio
      </Link>
      <ProductosApp />
    </main>
  );
}
