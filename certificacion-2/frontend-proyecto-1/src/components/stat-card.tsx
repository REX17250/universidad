import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

// Tarjeta de indicador: numero grande + etiqueta
export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: ReactNode; hint?: string; icon: LucideIcon }) {
  return (
    <Card className="flex items-start gap-4 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
    </Card>
  );
}
