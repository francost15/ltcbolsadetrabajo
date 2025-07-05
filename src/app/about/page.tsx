
import { NavbarHome, Footer } from '@/components'



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarHome />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Sobre Nosotros
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Más de 20 años de experiencia transformando el reclutamiento en México
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Nuestra Historia
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      En LTC contamos con más de <strong className="text-blue-800">20 años de experiencia</strong> en el ámbito del reclutamiento y selección de personal, colaborando con empresas de todos los tamaños a nivel nacional. A lo largo de nuestra trayectoria, hemos participado en la contratación de talento para una amplia variedad de puestos, desde directivos hasta posiciones junior.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Transformación Digital
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Hoy, estamos dando un paso firme hacia la <strong className="text-blue-800">transformación digital</strong>, evolucionando del modelo tradicional al mundo digital. Nuestra plataforma utiliza <strong className="text-blue-800">inteligencia artificial</strong> para conectar de forma más precisa y eficiente a empresas con los candidatos ideales, optimizando el match entre vacantes y perfiles.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Nuestro Compromiso
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      En LTC trabajamos para que tanto las empresas como los candidatos vivan una <strong className="text-blue-800">experiencia positiva, transparente y eficiente</strong> en cada etapa del proceso de atracción de talento.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                      <strong className="text-blue-800">Confiar en LTC</strong> es contar con un aliado estratégico para el presente y futuro del talento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-800 mb-2">+20</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Años de Experiencia</div>
                <div className="text-gray-600">En reclutamiento y selección de personal</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-800 mb-2">100%</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Digital</div>
                <div className="text-gray-600">Plataforma moderna con inteligencia artificial</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-800 mb-2">∞</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Oportunidades</div>
                <div className="text-gray-600">Para empresas y candidatos en México</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
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