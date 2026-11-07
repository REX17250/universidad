// Une clases CSS ignorando los valores vacios: cn("a", cond && "b") -> "a b"
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
