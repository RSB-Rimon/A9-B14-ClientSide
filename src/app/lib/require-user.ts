import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

type UserRole = "admin" | "customer";

export async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.isBlocked === true) {
    redirect("/account-blocked");
  }

  return session;
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireUser();

  if (session.user.role !== requiredRole) {
    if (session.user.role === "admin") {
      redirect("/admin/dashboard");
    }

    if (session.user.role === "customer") {
      redirect("/customer/dashboard");
    }

    redirect("/");
  }

  return session;
}
