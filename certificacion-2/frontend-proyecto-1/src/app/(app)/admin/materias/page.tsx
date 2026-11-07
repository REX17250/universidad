import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { SubjectsManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Materias" };

export default function Page() {
  return (
    <>
      <PageHeader title="Materias" subtitle="Materias, créditos, semestre y prerrequisitos." />
      <SubjectsManager />
    </>
  );
}
