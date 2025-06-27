import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { inter } from "@/config/fonts";


export const metadata: Metadata = {
  title: {
    template: '%s - LTC Bolsa de Trabajo',
    default:'HOME - LTC Bolsa de Trabajo'
  },
  description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado. LTC Bolsa de Trabajo te ayuda a impulsar tu carrera profesional.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e40af",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="msapplication-TileColor" content="#1e40af" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
