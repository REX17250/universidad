import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { GroupsManager } from "@/components/admin/operations";

export const metadata: Metadata = { title: "Grupos" };

export default function Page() {
  return (
    <>
      <PageHeader title="Grupos" subtitle="Grupos de cada materia con su docente, cupo y horario semanal." />
      <GroupsManager />
    </>
  );
}
