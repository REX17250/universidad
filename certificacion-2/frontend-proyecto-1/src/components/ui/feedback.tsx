import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

// Aviso de error o exito (se anuncia a lectores de pantalla)
export function Alert({ tone = "danger", children }: { tone?: "danger" | "success"; children: ReactNode }) {
  const Icon = tone === "danger" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium",
        tone === "danger" ? "bg-danger-100 text-danger-600" : "bg-success-100 text-success-600",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-(--radius-card) border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        <Inbox className="size-6" aria-hidden />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
