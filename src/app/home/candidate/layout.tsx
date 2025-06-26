import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " LTC ",
  description: "La sección de candidato en LTC Project permite encontrar el mejor talento para ti",
};

export default async function CandidateLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Si el usuario es una empresa, redirigir a su sección
  if (session.user.rol === 'empresa') {
    redirect("/home/company");
  }

  return <>{children}</>;
} 