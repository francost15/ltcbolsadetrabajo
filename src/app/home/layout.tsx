import { ReactNode } from "react";
import { NavBar } from "@/components";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s - LTC Bolsa de Trabajo',
    default:'HOME - LTC Bolsa de Trabajo'
  },
  description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado. LTC Bolsa de Trabajo te ayuda a impulsar tu carrera profesional.",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <>
      <SessionProvider>
        <NavBar />
        {children}
      </SessionProvider>
    </>
  );
}