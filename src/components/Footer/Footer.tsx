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
            <p className="text-sm text-gray-400">
              Conectamos el talento con las mejores oportunidades laborales. 
              Encuentra el trabajo de tus sueños o al candidato perfecto para tu empresa.
            </p>
          </div>

          <FooterLinkSection title="Empresa" links={footerLinks.company} />

          {/* Newsletter */}
  
        </div>

        {/* Línea divisoria */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LTC Project. Todos los derechos reservados.
            </p>
         
          </div>
        </div>
      </div>
    </footer>
  )
}
