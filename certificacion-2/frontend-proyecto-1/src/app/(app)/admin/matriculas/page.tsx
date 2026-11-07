import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { EnrollmentsManager } from "@/components/admin/operations";

export const metadata: Metadata = { title: "Matrículas" };

export default function Page() {
  return (
    <>
      <PageHeader title="Matrículas" subtitle="Matrículas de los estudiantes. Puedes matricular o cancelar en nombre de un estudiante." />
      <EnrollmentsManager />
    </>
  );
}
