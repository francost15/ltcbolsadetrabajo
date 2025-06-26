import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CompanyLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Si el usuario es un candidato, redirigir a su sección
  if (session.user.rol === 'candidato') {
    redirect("/home/candidate");
  }

  return <>{children}</>;
} 