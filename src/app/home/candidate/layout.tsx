import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { checkActiveSubscription } from "@/actions";

export const metadata: Metadata = {
  title: " LTC ",
  description: "La sección de candidato en LTC Project permite encontrar el mejor talento para ti",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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

  // Verificar si el usuario tiene una suscripción activa
  const subscriptionStatus = await checkActiveSubscription();
  
  if (!subscriptionStatus.hasActiveSubscription) {
    redirect("/subscription/checkout");
  }

  return <>{children}</>;
} 