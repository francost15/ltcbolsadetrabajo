import Link from 'next/link';
import { IoWarningOutline, IoPersonAddOutline, IoDocumentTextOutline } from 'react-icons/io5';

interface CompleteProfilePromptProps {
  missingFields: string[];
  hasCV: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasBasicInfo: boolean;
}

export default function CompleteProfilePrompt({ 
  missingFields, 
  hasCV, 
  hasExperience, 
  hasEducation, 
  hasBasicInfo 
}: CompleteProfilePromptProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <IoPersonAddOutline className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Completa tu perfil para encontrar las mejores oportunidades!
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Para obtener recomendaciones de vacantes personalizadas y mejorar tu matching con empleadores, 
            necesitas completar algunos datos importantes en tu perfil.
          </p>

          {/* Estado del perfil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg border-2 ${hasCV ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <IoDocumentTextOutline className={`h-8 w-8 mx-auto mb-2 ${hasCV ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`font-medium ${hasCV ? 'text-green-800' : 'text-red-800'}`}>
                CV/Currículum
              </p>
              <p className={`text-sm ${hasCV ? 'text-green-600' : 'text-red-600'}`}>
                {hasCV ? 'Completado ✓' : 'Pendiente'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${hasBasicInfo ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <IoPersonAddOutline className={`h-8 w-8 mx-auto mb-2 ${hasBasicInfo ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`font-medium ${hasBasicInfo ? 'text-green-800' : 'text-red-800'}`}>
                Información Básica
              </p>
              <p className={`text-sm ${hasBasicInfo ? 'text-green-600' : 'text-red-600'}`}>
                {hasBasicInfo ? 'Completado ✓' : 'Pendiente'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${hasExperience && hasEducation ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <IoWarningOutline className={`h-8 w-8 mx-auto mb-2 ${hasExperience && hasEducation ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`font-medium ${hasExperience && hasEducation ? 'text-green-800' : 'text-red-800'}`}>
                Experiencia y Educación
              </p>
              <p className={`text-sm ${hasExperience && hasEducation ? 'text-green-600' : 'text-red-600'}`}>
                {hasExperience && hasEducation ? 'Completado ✓' : 'Pendiente'}
              </p>
            </div>
          </div>


          {/* Botón de acción */}
          <div className="space-y-4">
            <Link 
              href="/home/candidate/profile"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
            >
              <IoPersonAddOutline className="h-5 w-5 mr-2" />
              Completar mi perfil
            </Link>
            
            <p className="text-sm text-gray-500">
              Una vez que completes tu perfil, podrás ver vacantes personalizadas y aplicar a empleos que coincidan con tu experiencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 