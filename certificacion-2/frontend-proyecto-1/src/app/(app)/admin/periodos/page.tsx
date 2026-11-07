import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { PeriodsManager } from "@/components/admin/operations";

export const metadata: Metadata = { title: "Periodos" };

export default function Page() {
  return (
    <>
      <PageHeader title="Periodos" subtitle="Abre un periodo para recibir matrículas y ciérralo cuando termine el semestre." />
      <PeriodsManager />
    </>
  );
}
