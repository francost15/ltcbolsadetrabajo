import { NavbarHome, Footer } from '@/components'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarHome />
      
      <main className="pt-16">
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Términos de Uso
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
                <div className="space-y-8 text-gray-700">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Términos y Condiciones
                    </h2>
                    <p className="text-xl font-semibold text-blue-600">
                      LTC Bolsa de Trabajo
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Última actualización: 18/09/2025
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      1. OBJETO
                    </h3>
                    <p>
                      Estos Términos y Condiciones regulan el uso de la Plataforma por parte de 
                      Candidatos y Empresas. LTC funge únicamente como intermediario 
                      tecnológico.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      2. REGISTRO Y CUENTAS DE USUARIO
                    </h3>
                    <p>
                      Para acceder a funciones avanzadas, deberás crear una cuenta como 
                      Candidato o Empresa. Eres responsable de la veracidad de la 
                      información y de la confidencialidad de tus credenciales.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      3. PUBLICACIÓN DE VACANTES Y PERFILES
                    </h3>
                    <p>
                      Las empresas deben publicar vacantes reales y cumplir con la legislación 
                      laboral. Los candidatos deben proporcionar información verídica y 
                      relevante.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      4. USO ADECUADO DE LA PLATAFORMA
                    </h3>
                    <p>
                      No está permitido usar los Servicios para actividades ilegales, publicar 
                      contenido ofensivo, infringir derechos de terceros o intentar acceder de 
                      forma no autorizada a otros sistemas.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      5. PRIVACIDAD Y DATOS PERSONALES
                    </h3>
                    <p>
                      El tratamiento de tus datos personales se realiza conforme a nuestra 
                      Política de Privacidad y en cumplimiento de la Ley Federal de Protección 
                      de Datos Personales en Posesión de los Particulares (LFPDPPP). Puedes 
                      ejercer tus derechos ARCO enviando solicitud a 
                      <a href="mailto:contacto@ltcbolsadetrabajo.com" className="text-blue-600 hover:underline ml-1">
                        contacto@ltcbolsadetrabajo.com
                      </a>.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      6. LICENCIA DE USO DEL CONTENIDO
                    </h3>
                    <p>
                      Concedes a LTC una licencia no exclusiva, gratuita y revocable para usar 
                      tu información únicamente para prestar los Servicios.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      7. LIMITACIÓN DE RESPONSABILIDAD
                    </h3>
                    <p>
                      LTC no garantiza que una postulación resulte en empleo ni que una 
                      vacante sea cubierta. No es responsable de las condiciones de trabajo 
                      ofrecidas por las empresas.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      8. TARIFAS Y PAGOS
                    </h3>
                    <p>
                      Algunas funciones pueden requerir pago. Los precios se publicarán de 
                      forma clara y, salvo indicación contraria, no son reembolsables.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      9. SUSPENSIÓN O TERMINACIÓN DEL SERVICIO
                    </h3>
                    <p>
                      Podemos suspender o cancelar el acceso a los Servicios en caso de 
                      incumplimiento de los Términos o conducta fraudulenta.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      10. MODIFICACIONES
                    </h3>
                    <p>
                      LTC podrá actualizar estos Términos en cualquier momento. El uso 
                      posterior de la Plataforma implica aceptación de los cambios.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      11. LEY APLICABLE Y JURISDICCIÓN
                    </h3>
                    <p>
                      Estos Términos se rigen por las leyes de México. Para disputas, las partes se 
                      someten a los tribunales competentes de Puebla, Puebla.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      CONTACTO
                    </h3>
                    <p>
                      Para dudas, escríbenos a 
                      <a href="mailto:contacto@ltcbolsadetrabajo.com" className="text-blue-600 hover:underline ml-1">
                        contacto@ltcbolsadetrabajo.com
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}