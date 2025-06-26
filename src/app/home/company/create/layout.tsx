import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " LTC ",
  description: "Publica una nueva vacante en LTC Project y encuentra el mejor talento para tu empresa.",
};

export default function CreateVacancyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 