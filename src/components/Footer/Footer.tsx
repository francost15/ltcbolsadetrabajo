import Link from 'next/link'
import Image from 'next/image'

const footerStyles = {
  link: "transition-colors hover:text-white",
  title: "mb-6 text-sm font-semibold text-white uppercase",
  socialIcon: "text-gray-400 transition-colors hover:text-white",
};

const footerLinks = {
  company: [
    { href: '/about', label: 'Sobre Nosotros' },
    { href: '/contact', label: 'Contacto' },
  ],
  candidates: [
    { href: '/auth/register/candidate', label: 'Registro Candidato' },
    { href: '/auth/login', label: 'Buscar Empleo' },
  ],
  companies: [
    { href: '/auth/register/company', label: 'Registro Empresa' },
    { href: '/auth/login', label: 'Publicar Vacantes' },
  ],
};

const FooterLinkSection = ({ title, links }: { title: string; links: typeof footerLinks.company }) => (
  <div className="lg:col-span-2">
    <h3 className={footerStyles.title}>{title}</h3>
    <ul className="space-y-4 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={footerStyles.link}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="px-6 py-12 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-4">
            <div className="flex gap-2 items-center mb-6">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-white">LTC Bolsa de Trabajo</span>
                <p className="text-sm font-extralight text-gray-400">Por López Tamayo Consultores</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Más de 20 años de experiencia conectando talento con empresas. 
              Plataforma moderna con inteligencia artificial para el reclutamiento del futuro.
            </p>
            
            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-400">direccion@ltcbolsadetrabajo.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-400">+52 1 55 6120 4092</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-400">Ciudad de México, México</span>
              </div>
            </div>
          </div>

          <FooterLinkSection title="Empresa" links={footerLinks.company} />
          <FooterLinkSection title="Candidatos" links={footerLinks.candidates} />
          <FooterLinkSection title="Empresas" links={footerLinks.companies} />

          {/* Redes sociales */}
          <div className="lg:col-span-2">
            <h3 className={footerStyles.title}>Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/16qJ5Ax9bY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className={footerStyles.socialIcon}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ltcbolsadetrabajo?igsh=MTlvam10aGxheDI1Nw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className={footerStyles.socialIcon}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Síguenos para las últimas actualizaciones y oportunidades laborales
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LTC Bolsa de Trabajo. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
