import type { Metadata } from "next";

export const metadata: Metadata = {
  title: " LTC ",
  description: "Edita una vacante en LTC Project y encuentra el mejor talento para tu empresa.",
};

export default function EditVacancyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 