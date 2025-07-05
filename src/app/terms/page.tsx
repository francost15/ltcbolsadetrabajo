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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Información en construcción
                    </h2>
                    <p>
                      Estamos trabajando en nuestros términos y condiciones completos. 
                      Mientras tanto, si tienes alguna pregunta sobre el uso de nuestra plataforma, 
                      no dudes en contactarnos.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Contacto
                    </h3>
                    <p>
                      Para cualquier duda sobre términos de uso: 
                      <a href="mailto:direccion@ltcbolsadetrabajo.com" className="text-blue-600 hover:underline ml-1">
                        direccion@ltcbolsadetrabajo.com
                      </a>
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