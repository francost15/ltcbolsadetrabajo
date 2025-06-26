import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { inter } from "@/config/fonts";
export const metadata: Metadata = {
  title: "LTC Project - Tu Plataforma de Empleo",
  description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado. LTC Project te ayuda a impulsar tu carrera profesional.",
  keywords: "empleo, trabajo, oportunidades laborales, búsqueda de empleo, recursos humanos, reclutamiento",
  authors: [{ name: "LTC Project" }],
  creator: "LTC Project",
  publisher: "LTC Project",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://ltcbolsadetrabajo.com",
    siteName: "LTC Project",
    title: "LTC Project - Tu Plataforma de Empleo",
    description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LTC Project Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LTC Project - Tu Plataforma de Empleo",
    description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado.",
  },
  metadataBase: new URL('https://ltcbolsadetrabajo.com'),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e40af",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#1e40af" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
