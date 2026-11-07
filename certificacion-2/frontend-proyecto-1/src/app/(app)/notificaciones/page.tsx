import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { NotificationList } from "./notification-list";

export const metadata: Metadata = { title: "Notificaciones" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notificaciones" subtitle="Avisos de matrícula, notas y grupos." />
      <NotificationList />
    </>
  );
}
