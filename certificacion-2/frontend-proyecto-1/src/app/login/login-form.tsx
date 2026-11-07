"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/feedback";

export function LoginForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { home } = await api<{ role: string; home: string }>("/auth/login", { method: "POST", body: { email, password } });
      router.replace(home);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {expired && !error && <Alert tone="danger">Tu sesión venció. Ingresa de nuevo.</Alert>}
      {error && <Alert>{error}</Alert>}
      <Field
        label="Correo institucional"
        name="email"
        type="email"
        autoComplete="username"
        placeholder="nombre@universidad.edu"
        icon={<Mail className="size-4" aria-hidden />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<Lock className="size-4" aria-hidden />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} disabled={!email || !password} className="w-full">
        Ingresar
      </Button>
    </form>
  );
}
