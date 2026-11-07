import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { ClassroomsManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Salones" };

export default function Page() {
  return (
    <>
      <PageHeader title="Salones" subtitle="Espacios físicos disponibles para los horarios." />
      <ClassroomsManager />
    </>
  );
}
