import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " LTC ",
  description: "Edita tu perfil en LTC Project y encuentra el mejor talento para tu empresa.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 