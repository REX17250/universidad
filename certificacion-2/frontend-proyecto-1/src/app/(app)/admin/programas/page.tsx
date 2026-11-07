import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { ProgramsManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Programas" };

export default function Page() {
  return (
    <>
      <PageHeader title="Programas" subtitle="Programas académicos y su facultad." />
      <ProgramsManager />
    </>
  );
}
