import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { inter } from "@/config/fonts";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: '%s - LTC Bolsa de Trabajo',
    default: 'LTC Bolsa de Trabajo'
  },
  description: "Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado. LTC Bolsa de Trabajo te ayuda a impulsar tu carrera profesional.",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    siteName: 'LTC Bolsa de Trabajo',
    title: 'LTC Bolsa de Trabajo',
    description: 'Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado.',
    images: [
      {
        url: '/og-image.png', // Imagen optimizada para redes sociales
        width: 1200,
        height: 630,
        alt: 'LTC Bolsa de Trabajo'
      },
      {
        url: '/og-image-square.png', // Versión cuadrada para plataformas que lo prefieren
        width: 600,
        height: 600,
        alt: 'LTC Bolsa de Trabajo'
      }
    ],
    locale: 'es_MX'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LTC Bolsa de Trabajo',
    description: 'Encuentra las mejores oportunidades laborales y conecta con empresas líderes en el mercado.',
    images: ['/og-image.png'],
    creator: '@ltcbolsatrabajo'
  },
  other: {
    'msapplication-TileColor': '#1e40af',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'whatsapp-image': '/og-image-square.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LTC Bolsa de Trabajo'
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
