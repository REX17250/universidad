import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { UsersManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Usuarios" };

export default function Page() {
  return (
    <>
      <PageHeader title="Usuarios" subtitle="Cuentas de acceso y roles. Los perfiles de estudiante y docente se crean aparte." />
      <UsersManager />
    </>
  );
}
