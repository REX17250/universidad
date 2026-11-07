import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { TeachersManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Docentes" };

export default function Page() {
  return (
    <>
      <PageHeader title="Docentes" subtitle="Perfiles de docentes y su facultad." />
      <TeachersManager />
    </>
  );
}
