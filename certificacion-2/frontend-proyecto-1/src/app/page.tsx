import { redirect } from "next/navigation";
import { getSession } from "@/lib/server";
import { HOME } from "@/lib/session";

// La raiz solo decide a donde mandarte
export default async function Root() {
  const session = await getSession();
  redirect(session ? HOME[session.role] : "/login");
}
