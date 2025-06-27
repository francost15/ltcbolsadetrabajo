import { ReactNode } from "react";
import { NavBar } from "@/components";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LTC Bolsa de Trabajo",
  description: "LTC Bolsa de Trabajo",
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