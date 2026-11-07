"use client";

import { useRouter } from "next/navigation";

// Selector de periodo de los reportes: conserva la pestana actual en la URL
export function ReportPeriodSelect({ tab, value, periods }: { tab: string; value: string; periods: { id: string; label: string }[] }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold">
      Periodo
      <select
        value={value}
        onChange={(e) => router.push(`/admin/reportes?tab=${tab}&period=${e.target.value}`)}
        className="min-h-11 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium"
      >
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );
}
