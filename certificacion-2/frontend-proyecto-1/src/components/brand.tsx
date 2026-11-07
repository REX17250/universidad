import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";

// Marca provisional (el logo real vendra del diseno, como archivo local en public/)
export function Brand({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-extrabold tracking-tight", light ? "text-white" : "text-ink", className)}>
      <span className={cn("flex size-9 items-center justify-center rounded-xl", light ? "bg-white/20" : "bg-primary-600 text-white")}>
        <GraduationCap className="size-5" aria-hidden />
      </span>
      <span className="text-lg">Gestión Académica</span>
    </span>
  );
}
