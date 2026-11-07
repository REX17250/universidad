import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { StudentsManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Estudiantes" };

export default function Page() {
  return (
    <>
      <PageHeader title="Estudiantes" subtitle="Perfiles de estudiantes y su programa." />
      <StudentsManager />
    </>
  );
}
