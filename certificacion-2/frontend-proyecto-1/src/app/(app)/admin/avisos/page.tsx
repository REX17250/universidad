import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { SendNotice } from "@/components/admin/operations";

export const metadata: Metadata = { title: "Enviar aviso" };

export default function Page() {
  return (
    <>
      <PageHeader title="Enviar aviso" subtitle="Envía una notificación a cualquier usuario." />
      <SendNotice />
    </>
  );
}
