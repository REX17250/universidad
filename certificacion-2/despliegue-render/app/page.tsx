import Link from "next/link";

const features = [
  {
    title: "Rápido por diseño",
    text: "Renderizado en el servidor y carga optimizada para que tu sitio responda al instante.",
  },
  {
    title: "Seguro y confiable",
    text: "Buenas prácticas de seguridad desde el primer despliegue, sin configuraciones complicadas.",
  },
  {
    title: "Escala contigo",
    text: "Desde un prototipo hasta miles de usuarios, la infraestructura crece cuando tú lo necesitas.",
  },
];

const steps = [
  { n: "1", title: "Crea tu cuenta", text: "Regístrate en menos de un minuto." },
  { n: "2", title: "Conecta tu proyecto", text: "Importa tu repositorio con un clic." },
  { n: "3", title: "Despliega", text: "Publica y comparte tu enlace con el mundo." },
];

const plans = [
  { name: "Gratis", price: "$0", items: ["1 proyecto", "Soporte comunitario", "Dominio incluido"], highlight: false },
  { name: "Pro", price: "$12", items: ["Proyectos ilimitados", "Soporte prioritario", "Dominio propio", "Analíticas"], highlight: true },
  { name: "Equipo", price: "$39", items: ["Todo en Pro", "Colaboración en equipo", "Roles y permisos"], highlight: false },
];

const btnPrimary =
  "inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 font-medium text-background transition-opacity hover:opacity-85";
const btnSecondary =
  "inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-6 font-medium transition-colors hover:bg-foreground/5";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#inicio" className="text-lg font-semibold tracking-tight">
            Prueba<span className="text-indigo-500">1</span>
          </a>
          <ul className="hidden items-center gap-8 text-sm sm:flex">
            <li><a href="#caracteristicas" className="hover:text-indigo-500">Características</a></li>
            <li><a href="#como-funciona" className="hover:text-indigo-500">Cómo funciona</a></li>
            <li><a href="#precios" className="hover:text-indigo-500">Precios</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/productos/" className="rounded-full border border-indigo-500/40 px-4 py-2 text-sm font-medium text-indigo-500 hover:bg-indigo-500/10">
              Productos
            </Link>
            <a href="#contacto" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Empezar
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section id="inicio" className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500">
            Nuevo · Despliegue en un clic
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Lanza tu idea al mundo{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              sin complicaciones
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            Construye, despliega y escala tu proyecto con una plataforma simple,
            rápida y pensada para ti.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#contacto" className={btnPrimary}>Comenzar gratis</a>
            <a href="#como-funciona" className={btnSecondary}>Ver cómo funciona</a>
          </div>
        </section>

        <section id="caracteristicas" className="border-t border-foreground/10 bg-foreground/[.03] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight">Todo lo que necesitas</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <div className="mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-foreground/70">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">Cómo funciona</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-foreground/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="precios" className="border-t border-foreground/10 bg-foreground/[.03] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight">Precios simples</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plans.map((p) => (
                <article
                  key={p.name}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    p.highlight ? "border-indigo-500 bg-background shadow-lg ring-1 ring-indigo-500" : "border-foreground/10 bg-background"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-4 text-4xl font-bold">
                    {p.price}<span className="text-base font-normal text-foreground/60">/mes</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-foreground/80">
                    {p.items.map((i) => (
                      <li key={i}>✓ {i}</li>
                    ))}
                  </ul>
                  <a href="#contacto" className={`mt-8 ${p.highlight ? btnPrimary : btnSecondary}`}>
                    Elegir {p.name}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Listo para empezar?</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Escríbenos y te ayudamos a poner tu proyecto en línea hoy mismo.
          </p>
          <a href="mailto:hola@prueba1.com" className={`mt-8 ${btnPrimary}`}>
            hola@prueba1.com
          </a>
        </section>
      </main>

      <footer className="border-t border-foreground/10 py-8 text-center text-sm text-foreground/60">
        © {new Date().getFullYear()} Prueba1. Todos los derechos reservados.
      </footer>
    </>
  );
}
