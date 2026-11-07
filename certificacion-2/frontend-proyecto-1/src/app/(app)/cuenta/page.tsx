import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/feedback";
import { ROLE_LABEL } from "@/lib/session";
import { apiGet } from "@/lib/server";
import type { Me } from "@/lib/types";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const me = await apiGet<Me>("/users/me");
  return (
    <>
      <PageHeader title="Mi cuenta" subtitle="Tus datos y tu contraseña." />
      <AccountForms name={me.name} email={me.email} roleLabel={ROLE_LABEL[me.role]} />
    </>
  );
}
