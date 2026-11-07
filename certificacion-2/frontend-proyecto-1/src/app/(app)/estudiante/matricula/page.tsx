import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { EnrollView } from "./enroll-view";

export const metadata: Metadata = { title: "Matricular" };

export default function EnrollPage() {
  return (
    <>
      <PageHeader title="Matricular materias" subtitle="Grupos del periodo abierto que puedes cursar: con cupo y con tus prerrequisitos cumplidos." />
      <EnrollView />
    </>
  );
}
