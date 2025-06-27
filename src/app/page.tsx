'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';
import { Footer, NavbarHome} from '@/components';


export default function Home() {
  const [openStates, setOpenStates] = useState(Array(10).fill(false));

  return (
    <main className="min-h-screen">
      <NavbarHome />

      {/* Hero Section */}
      <section className="overflow-hidden relative">
        <div className="relative px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
          <div className="flex flex-col gap-12 justify-between items-center lg:flex-row">
            {/* Text content */}
            <div className="flex-1 mt-10 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Tu nuevo empleo a solo
                <span className="relative whitespace-nowrap">
                  <span className="relative text-blue-900"> un click </span>
                </span>
                de distancia
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Conectamos el talento con las mejores oportunidades laborales. Encuentra el trabajo de tus sueños o al candidato perfecto para tu empresa.
              </p>
              <div className="flex flex-col gap-4 items-center mt-10 sm:flex-row sm:gap-x-6">
                <Link
                  href="/auth/register/company"
                  className="inline-flex justify-center items-center px-6 py-3 w-full text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm transition-all duration-300 sm:w-auto hover:bg-blue-700 hover:scale-105"
                >
                  Comenzar ahora
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  href="/auth/login"
                  className="w-full text-sm font-semibold leading-6 text-center text-gray-700 sm:w-auto sm:text-left hover:text-blue-800"
                >
                  Ya tengo cuenta <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Image/Illustration */}
            <div className="hidden relative flex-1 md:block">
              <div className="absolute inset-0 z-20 bg-gradient-to-r to-transparent from-white/50" />
              <Image
                src="/foto1.svg"
                alt="Encuentra tu próximo empleo"
                width={600}
                height={600}
                className="object-cover object-center relative ml-auto transition-transform duration-500 transform hover:scale-105"
                priority
              />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 rounded-full filter blur-3xl bg-blue-100/30" />
              <div className="absolute -top-4 -right-4 w-72 h-72 rounded-full filter blur-3xl bg-blue-50/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="overflow-hidden py-8">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <h2 className="mb-8 text-lg font-semibold leading-8 text-center text-blue-800">
            Empresas que confían en nosotros
          </h2>
          <div className="relative w-full">
            {/* Carrusel container */}
            <div className="overflow-hidden relative w-full">
              <div className="flex animate-scroll">
                {/* Primera copia de logos */}
                {[...Array(8)].map((_, index) => {
                  const logoNumber = index + 1;
                  const extension = logoNumber <= 3 ? 'svg' : 'jpeg';
                  return (
                    <div key={`first-${logoNumber}`} className="flex-none w-[120px] sm:w-[200px] mx-2 sm:mx-4">
                      <Image
                        src={`/logo/${logoNumber}.${extension}`}
                        alt={`Logo empresa ${logoNumber}`}
                        width={150}
                        height={150}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  );
                })}
                {/* Segunda copia de logos para el efecto infinito */}
                {[...Array(8)].map((_, index) => {
                  const logoNumber = index + 1;
                  const extension = logoNumber <= 3 ? 'svg' : 'jpeg';
                  return (
                    <div key={`second-${logoNumber}`} className="flex-none w-[120px] sm:w-[200px] mx-2 sm:mx-4">
                      <Image
                        src={`/logo/${logoNumber}.${extension}`}
                        alt={`Logo empresa ${logoNumber}`}
                        width={150}
                        height={150}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Gradientes para efecto de fade */}
            <div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent sm:w-48"></div>
            <div className="absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent sm:w-48"></div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-24">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Consejos para tu éxito
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Optimiza tu búsqueda laboral con estos consejos profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-16 lg:grid-cols-2">
            {/* CV Tips */}
            <div className="relative p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex gap-4 items-center mb-8">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-50 rounded-xl">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Optimiza tu CV</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Estructura clara y diseño profesional",
                  "Destaca logros cuantificables",
                  "Personaliza para cada postulación",
                  "Incluye palabras clave del sector",
                  "Mantén la información relevante"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex justify-center items-center mr-4 w-6 h-6 font-mono text-sm text-blue-600 transition-colors duration-300 group-hover:text-blue-800">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Tips */}
            <div className="relative p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex gap-4 items-center mb-8">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Destaca en la entrevista</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Investiga la empresa previamente",
                  "Prepara ejemplos de experiencias",
                  "Muestra interés y entusiasmo",
                  "Haz preguntas relevantes",
                  "Da seguimiento post-entrevista"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex justify-center items-center mr-4 w-6 h-6 font-mono text-sm text-blue-600 transition-colors duration-300 group-hover:text-blue-800">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      


      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Todo lo que necesitas saber sobre nuestra plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-16 lg:grid-cols-2">
            {/* Para Candidatos */}
            <div className="space-y-6">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Para Candidatos</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "¿Qué es esta plataforma y para quién está diseñada?",
                    a: "Una red profesional que conecta empresas y candidatos directamente. Permite que el trabajo te encuentre a ti a través de un sistema de emparejamiento automático."
                  },
                  {
                    q: "¿Cómo creo mi perfil como candidato?",
                    a: "Solo debes completar un formulario breve con tu nombre, correo, ocupación, currículum y perfil profesional. Luego el sistema te posiciona ante las vacantes que se ajustan a tu perfil."
                  },
                  {
                    q: "¿Cómo funciona el match entre empresas y candidatos?",
                    a: "El sistema compara automáticamente tu perfil con los requisitos de las vacantes. Si coincide, la empresa recibe una notificación y tú también obtienes un aviso para aceptar o postular directamente."
                  },
                  {
                    q: "¿Tengo que buscar vacantes activamente?",
                    a: "No. Si tu perfil coincide con alguna vacante, serás notificado por correo y podrás aplicar dando un solo clic."
                  }
                ].map((faq, index) => (
                  <div key={index} className="overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md">
                    <button
                      onClick={() => {
                        const newOpenStates = [...openStates];
                        newOpenStates[index] = !newOpenStates[index];
                        setOpenStates(newOpenStates);
                      }}
                      className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="text-base font-medium text-gray-900">{faq.q}</span>
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 transform transition-all duration-200 ${openStates[index] ? 'bg-blue-100 rotate-180' : ''}`}>
                        <svg className={`w-5 h-5 ${openStates[index] ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${openStates[index] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Empresas */}
            <div className="space-y-6">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Para Empresas</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "¿Cómo publico una vacante?",
                    a: "Crea tu cuenta empresarial, completa el perfil de tu empresa y usa nuestro formulario intuitivo para publicar vacantes. Podrás especificar requisitos, beneficios y detalles del puesto."
                  },
                  {
                    q: "¿Cómo funciona el proceso de selección?",
                    a: "Recibirás candidatos preseleccionados que coincidan con tus requisitos. Puedes revisar perfiles, programar entrevistas y gestionar todo el proceso desde la plataforma."
                  },
                  {
                    q: "¿Qué beneficios obtengo como empresa?",
                    a: "Acceso a candidatos calificados, herramientas de gestión de talento, análisis de mercado laboral y soporte personalizado para optimizar tus procesos de reclutamiento."
                  }
                ].map((faq, index) => (
                  <div key={index} className="overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md">
                    <button
                      onClick={() => {
                        const newOpenStates = [...openStates];
                        newOpenStates[index + 4] = !newOpenStates[index + 4];
                        setOpenStates(newOpenStates);
                      }}
                      className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="text-base font-medium text-gray-900">{faq.q}</span>
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 transform transition-all duration-200 ${openStates[index + 4] ? 'rotate-180 bg-blue-100' : ''}`}>
                        <svg className={`w-5 h-5 ${openStates[index + 4] ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${openStates[index + 4] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seguridad y Privacidad */}
            <div className="space-y-6">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Seguridad y Privacidad</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "¿Cómo protegen mis datos personales?",
                    a: "Implementamos encriptación de datos, autenticación segura y cumplimos con todas las regulaciones de protección de datos. Tu información solo es visible para las empresas cuando decides postularte."
                  },
                  {
                    q: "¿Quién puede ver mi perfil?",
                    a: "Tu perfil solo es visible para las empresas cuando hay una coincidencia con sus vacantes y tú aceptas mostrar tu información. Mantienes el control total de tu privacidad."
                  }
                ].map((faq, index) => (
                  <div key={index} className="overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md">
                    <button
                      onClick={() => {
                        const newOpenStates = [...openStates];
                        newOpenStates[index + 7] = !newOpenStates[index + 7];
                        setOpenStates(newOpenStates);
                      }}
                      className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="text-base font-medium text-gray-900">{faq.q}</span>
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 transform transition-all duration-200 ${openStates[index + 7] ? 'rotate-180 bg-blue-100' : ''}`}>
                        <svg className={`w-5 h-5 ${openStates[index + 7] ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${openStates[index + 7] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soporte Técnico */}
            <div className="space-y-6">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Soporte Técnico</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: "¿Dónde puedo recibir soporte?",
                    a: "Contamos con un sistema de soporte vía chat y correo en la sección Contacto. También incluimos una sección de Ayuda con guías rápidas."
                  },
                  {
                    q: "¿Qué hago si tengo problemas técnicos?",
                    a: "Nuestro equipo de soporte está disponible 24/7. Puedes reportar cualquier problema técnico a través del chat o enviando un correo a soporte@ltc.com"
                  }
                ].map((faq, index) => (
                  <div key={index} className="overflow-hidden bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md">
                    <button
                      onClick={() => {
                        const newOpenStates = [...openStates];
                        newOpenStates[index + 9] = !newOpenStates[index + 9];
                        setOpenStates(newOpenStates);
                      }}
                      className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span className="text-base font-medium text-gray-900">{faq.q}</span>
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 transform transition-all duration-200 ${openStates[index + 9] ? 'rotate-180 bg-blue-100' : ''}`}>
                        <svg className={`w-5 h-5 ${openStates[index + 9] ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${openStates[index + 9] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
} 