import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  hideLabel?: boolean;
}

export function Select({ label, options, placeholder, hint, hideLabel, id, className, ...rest }: Props) {
  const fieldId = id ?? rest.name ?? label;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className={cn("block text-sm font-semibold text-ink", hideLabel && "sr-only")}>
        {label}
      </label>
      <select id={fieldId} aria-describedby={hint ? `${fieldId}-hint` : undefined} className={cn("min-h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink", className)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={`${fieldId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
