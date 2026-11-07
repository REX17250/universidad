"use client";

import { useRouter } from "next/navigation";

export function PeriodSelect({ periods, value }: { periods: { id: string; label: string }[]; value: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold">
      Periodo
      <select
        value={value}
        onChange={(e) => router.push(`/docente/grupos?period=${e.target.value}`)}
        className="min-h-11 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium"
      >
        <option value="todos">Todos los periodos</option>
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );
}
