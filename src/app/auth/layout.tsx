import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | LTC Bolsa de Trabajo - Empleo en México',
    default: 'Acceso - LTC Bolsa de Trabajo'
  },
  description: 'Accede a tu cuenta en LTC Bolsa de Trabajo. Inicia sesión o regístrate gratis para encontrar empleo en México, publicar vacantes y conectar con las mejores oportunidades laborales.',
  keywords: [
    'login bolsa de trabajo',
    'registro empleo México',
    'crear cuenta trabajo',
    'acceso plataforma empleo',
    'ingresar bolsa trabajo',
    'registro candidato',
    'registro empresa',
    'cuenta empleo gratis',
    'acceso vacantes trabajo'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Acceso - LTC Bolsa de Trabajo',
    description: 'Inicia sesión o regístrate gratis en la mejor plataforma de empleo de México con inteligencia artificial.',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="relative p-8 w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl">
        {children}
      </div>
    </div>
  );
}
