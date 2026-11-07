import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { expired } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Brand />
          <h1 className="mt-10 text-3xl font-extrabold tracking-tight">Bienvenido de nuevo</h1>
          <p className="mt-2 mb-8 text-sm text-muted">Ingresa con tu cuenta para ver tus materias, grupos y notas.</p>
          <LoginForm expired={expired !== undefined} />
        </div>
      </section>

      <aside className="relative hidden flex-col items-center justify-center gap-8 overflow-hidden bg-primary-700 p-12 text-white lg:flex">
        {/* Ilustración local: no depende de ningún servicio de imágenes */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/hero.svg" alt="" className="w-full max-w-md" />
        <div className="max-w-md text-center">
          <p className="text-2xl font-bold">Todo tu semestre en un solo lugar</p>
          <p className="mt-2 text-primary-100">Matrícula, horarios, evaluaciones y notas, según tu rol en la universidad.</p>
        </div>
      </aside>
    </main>
  );
}
