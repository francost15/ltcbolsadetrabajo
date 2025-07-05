import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { inter } from "@/config/fonts";
import StructuredData from '@/components/StructuredData';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ltcbolsadetrabajo.com'),
  title: {
    template: '%s | LTC Bolsa de Trabajo - Empleo en México con IA',
    default: 'LTC Bolsa de Trabajo - Encuentra Empleo en México con Inteligencia Artificial'
  },
  description: "La mejor bolsa de trabajo en México con inteligencia artificial. Conectamos talento con empresas. Vacantes disponibles, trabajos bien pagados, empleo remoto y oportunidades laborales. ¡Encuentra tu trabajo ideal o publica vacantes gratis!",
  keywords: [
    // Palabras clave generales
    "bolsa de trabajo",
    "empleo en México", 
    "ofertas de trabajo",
    "trabajos disponibles",
    "buscar trabajo online",
    "encontrar empleo rápido",
    "vacantes laborales México",
    // Para candidatos
    "vacantes cerca de mí",
    "trabajos bien pagados",
    "empleo sin experiencia", 
    "trabajos para jóvenes",
    "trabajos medio tiempo",
    "trabajos tiempo completo",
    "trabajo remoto México",
    "subir CV en línea",
    // Para empresas
    "publicar vacante gratis",
    "encontrar candidatos en México",
    "reclutamiento en línea",
    "plataforma de reclutamiento",
    "contratar empleados rápido",
    // Palabras clave diferenciadoras
    "bolsa de trabajo con inteligencia artificial",
    "selección de personal eficiente",
    "plataforma de empleo moderna",
    "tecnología para encontrar empleo",
    "bolsa de trabajo innovadora"
  ],
  authors: [{ name: "LTC Bolsa de Trabajo" }],
  creator: "LTC Bolsa de Trabajo",
  publisher: "LTC Bolsa de Trabajo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://ltcbolsadetrabajo.com',
    siteName: 'LTC Bolsa de Trabajo',
    title: 'LTC Bolsa de Trabajo - Encuentra Empleo en México con IA',
    description: 'La plataforma de empleo más avanzada de México. Encuentra trabajo con inteligencia artificial, vacantes disponibles, empleos bien pagados y oportunidades laborales únicas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LTC Bolsa de Trabajo - Empleo en México',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'LTC Bolsa de Trabajo - Encuentra tu empleo ideal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LTCBolsaTrabajo',
    creator: '@LTCBolsaTrabajo',
    title: 'LTC Bolsa de Trabajo - Empleo en México con IA',
    description: 'Conectamos talento con empresas usando inteligencia artificial. Encuentra trabajo, publica vacantes gratis y accede a las mejores oportunidades laborales en México.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ltcbolsadetrabajo.com',
    languages: {
      'es-MX': 'https://ltcbolsadetrabajo.com',
      'es': 'https://ltcbolsadetrabajo.com',
    },
  },
  category: 'Employment',
  classification: 'Job Board Platform',
  other: {
    'google-site-verification': 'your-google-verification-code', // Agregar código real
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
        <meta name="theme-color" content="#1e40af" />
        <meta name="geo.region" content="MX" />
        <meta name="geo.placename" content="México" />
        <meta name="language" content="es" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="1 days" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "LTC Bolsa de Trabajo",
              "description": "Plataforma de empleo con inteligencia artificial en México",
              "url": "https://ltcbolsadetrabajo.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ltcbolsadetrabajo.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "LTC Bolsa de Trabajo",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://ltcbolsadetrabajo.com/logo.svg"
                }
              },
              "sameAs": [
                "https://www.facebook.com/share/16qJ5Ax9bY/?mibextid=wwXIfr",
                "https://www.instagram.com/ltcbolsadetrabajo?igsh=MTlvam10aGxheDI1Nw%3D%3D&utm_source=qr"
              ]
            })
          }}
        />
        <StructuredData type="organization" />
        <StructuredData type="jobPosting" />
      </head>
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
