
import { NavbarHome, Footer } from '@/components'


export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarHome />
      
      <main className="pt-16">
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Política de Privacidad
            </h1>
            
             <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
                <div className="space-y-8 text-gray-700">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Aviso de Privacidad
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
                      1. IDENTIDAD Y DOMICILIO DEL RESPONSABLE
                    </h3>
                    <p>
                      LTC Bolsa de Trabajo, con domicilio en Puebla, Puebla, México, es 
                      responsable del tratamiento de los datos personales que nos 
                      proporciones, conforme a lo dispuesto en la Ley Federal de Protección 
                      de Datos Personales en Posesión de los Particulares (LFPDPPP).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      2. DATOS PERSONALES RECABADOS
                    </h3>
                    <p>
                      Podremos recabar los siguientes datos: identificación, contacto, 
                      laborales, académicos, experiencia profesional, referencias, preferencias 
                      laborales, y en caso de empresas, datos de contacto corporativo y datos 
                      de facturación.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      3. FINALIDADES DEL TRATAMIENTO
                    </h3>
                    <p className="mb-3">Tus datos serán utilizados para:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Creación de cuenta y perfil.</li>
                      <li>Publicación y postulación a vacantes.</li>
                      <li>Comunicación entre candidatos y empresas.</li>
                      <li>Envío de notificaciones relacionadas con el servicio.</li>
                      <li>Estadísticas y mejora de la plataforma.</li>
                    </ul>
                    <p className="mt-3">
                      <strong>Finalidades secundarias:</strong> envío de promociones, boletines y publicidad 
                      (puedes oponerte en cualquier momento).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      4. TRANSFERENCIA DE DATOS PERSONALES
                    </h3>
                    <p>
                      Tus datos podrán ser compartidos con empresas que publiquen vacantes 
                      en la Plataforma, exclusivamente con fines de reclutamiento. No se 
                      transferirán datos a terceros sin tu consentimiento, salvo las excepciones 
                      previstas en la ley.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      5. DERECHOS ARCO
                    </h3>
                    <p>
                      Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación u 
                      Oposición (ARCO), así como revocar tu consentimiento, enviando una 
                      solicitud al correo: <a href="mailto:contacto@ltcbolsadetrabajo.com" className="text-blue-600 hover:underline">contacto@ltcbolsadetrabajo.com</a>. 
                      Tu solicitud deberá contener: nombre completo, correo registrado, descripción clara de la 
                      solicitud y, en su caso, documentos que acrediten tu identidad.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      6. MEDIDAS DE SEGURIDAD
                    </h3>
                    <p>
                      Hemos implementado medidas administrativas, técnicas y físicas para 
                      proteger tus datos contra daño, pérdida, alteración, destrucción o uso no 
                      autorizado.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      7. USO DE COOKIES Y TECNOLOGÍAS SIMILARES
                    </h3>
                    <p>
                      Utilizamos cookies para mejorar tu experiencia, recordar preferencias, 
                      analizar tráfico y mostrar publicidad relevante. Puedes deshabilitarlas en 
                      tu navegador; sin embargo, algunas funciones del sitio podrían verse 
                      afectadas.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      8. CAMBIOS AL AVISO DE PRIVACIDAD
                    </h3>
                    <p>
                      Podremos modificar el presente Aviso para adaptarlo a cambios 
                      legislativos, políticas internas o nuevos requerimientos. Las modificaciones 
                      estarán disponibles en <a href="https://www.ltcbolsadetrabajo.com" className="text-blue-600 hover:underline">https://www.ltcbolsadetrabajo.com</a>.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      9. CONTACTO
                    </h3>
                    <p>
                      Si tienes dudas sobre este Aviso de Privacidad, contáctanos en 
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