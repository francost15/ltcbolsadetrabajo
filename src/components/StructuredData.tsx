interface StructuredDataProps {
  type?: 'website' | 'organization' | 'jobPosting' | 'breadcrumbList'
  data?: any
}

export default function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = 'https://ltcbolsadetrabajo.com'
    
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "LTC Bolsa de Trabajo",
          "description": "Plataforma de empleo con inteligencia artificial en México",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.svg`,
          "image": `${baseUrl}/og-image.png`,
          "sameAs": [
            "https://www.facebook.com/share/16qJ5Ax9bY/?mibextid=wwXIfr",
            "https://www.instagram.com/ltcbolsadetrabajo?igsh=MTlvam10aGxheDI1Nw%3D%3D&utm_source=qr"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MX",
            "addressRegion": "México"
          },
          "areaServed": {
            "@type": "Country",
            "name": "México"
          },
          "knowsAbout": [
            "Bolsa de trabajo",
            "Reclutamiento",
            "Recursos humanos",
            "Inteligencia artificial",
            "Selección de personal",
            "Empleo en México"
          ],
          "slogan": "Conectamos talento con oportunidades usando inteligencia artificial"
        }

      case 'jobPosting':
        return {
          "@context": "https://schema.org",
          "@type": "JobBoard",
          "name": "LTC Bolsa de Trabajo",
          "description": "Plataforma de empleos con inteligencia artificial",
          "url": baseUrl,
          "provider": {
            "@type": "Organization",
            "name": "LTC Bolsa de Trabajo"
          },
          "hiringOrganization": {
            "@type": "Organization", 
            "name": "LTC Bolsa de Trabajo"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MX"
            }
          },
          "employmentType": [
            "FULL_TIME",
            "PART_TIME", 
            "CONTRACTOR",
            "TEMPORARY",
            "INTERN",
            "VOLUNTEER"
          ],
          "industry": "Human Resources Services"
        }

      case 'breadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data || [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": baseUrl
            }
          ]
        }

      default: // website
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "LTC Bolsa de Trabajo",
          "description": "La mejor plataforma de empleo en México con inteligencia artificial",
          "url": baseUrl,
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "publisher": {
            "@type": "Organization",
            "name": "LTC Bolsa de Trabajo",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.svg`
            }
          },
          "mainEntity": {
            "@type": "WebPage",
            "@id": baseUrl,
            "name": "LTC Bolsa de Trabajo - Empleo en México con IA",
            "description": "Encuentra trabajo o publica vacantes gratis. Conectamos talento con empresas usando inteligencia artificial.",
            "keywords": "bolsa de trabajo, empleo México, vacantes, trabajos, inteligencia artificial, reclutamiento"
          },
          "offers": {
            "@type": "Offer",
            "description": "Servicios gratuitos de bolsa de trabajo",
            "price": "0",
            "priceCurrency": "MXN",
            "availability": "https://schema.org/InStock"
          }
        }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
} 