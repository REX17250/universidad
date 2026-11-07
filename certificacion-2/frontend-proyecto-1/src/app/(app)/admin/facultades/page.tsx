import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { FacultiesManager } from "@/components/admin/configs";

export const metadata: Metadata = { title: "Facultades" };

export default function Page() {
  return (
    <>
      <PageHeader title="Facultades" subtitle="Facultades de la universidad y su sede." />
      <FacultiesManager />
    </>
  );
}
