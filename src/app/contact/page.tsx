import { NavbarHome, Footer } from '@/components'
import Link from 'next/link'
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarker, FaPhone } from 'react-icons/fa'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarHome />
      
      <main className="pt-16">
        {/* Contact Information */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Información de Contacto
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Más de 20 años de experiencia conectando talento con empresas en México
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Email */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope size={24} className="text-blue-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-2 text-sm break-words">direccion@ltcbolsadetrabajo.com</p>
                <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
              </div>

              {/* Teléfono */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone size={24} className="text-blue-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600 mb-2 text-sm">+52 1 55 6120 4092</p>
                <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 AM - 6:00 PM</p>
              </div>

              {/* Ubicación */}
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarker size={24} className="text-blue-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación</h3>
                <p className="text-gray-600 mb-2 text-sm">Ciudad de México, México</p>
                <p className="text-sm text-gray-500">Servicio a nivel nacional</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Síguenos en nuestras redes</h3>
              <div className="flex justify-center space-x-6">
                <Link 
                  href="https://www.facebook.com/share/16qJ5Ax9bY/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-blue-700 group-hover:scale-110">
                    <FaFacebook size={28}/>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">Facebook</p>
                </Link>

                <Link 
                  href="https://www.instagram.com/ltcbolsadetrabajo?igsh=MTlvam10aGxheDI1Nw%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:from-purple-600 group-hover:to-pink-600 group-hover:scale-110">
                    <FaInstagram size={28}/>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 group-hover:text-purple-600 transition-colors">Instagram</p>
                </Link>
              </div>
              <p className="mt-8 text-gray-500 max-w-md mx-auto">
                Síguenos para las últimas actualizaciones y oportunidades laborales
              </p>
            </div>
            </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-800">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para encontrar tu próximo talento o empleo?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a nuestra plataforma y experimenta el futuro del reclutamiento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register/company"
                className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Registrar Empresa
              </a>
              <a
                href="/auth/register/candidate"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors"
              >
                Buscar Empleo
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 