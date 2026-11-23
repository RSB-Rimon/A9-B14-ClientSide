import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

export default async function AuthRedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (session.user.role === "customer") {
    redirect("/customer/dashboard");
  }

  redirect("/");
}
