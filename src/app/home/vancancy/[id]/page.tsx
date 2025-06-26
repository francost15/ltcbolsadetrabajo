import { getVacancyById } from "@/actions";
import { BackButton } from "@/components";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VacancyByIdPage({ params }: PageProps) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Vacante no encontrada</h1>
          <p className="text-gray-600">La vacante que buscas no existe o ha sido eliminada.</p>
          <Link 
            href="/home" 
            className="inline-block px-6 py-3 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  const formatSalario = (salario: number | null) => {
    if (!salario) return 'Salario no especificado';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salario);
  };

  return (
    <div className="container px-3 sm:px-4 py-4 sm:py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <BackButton />
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Cabecera de la vacante */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
            <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{vacancy.titulo}</h1>
              <span className="inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-50 text-blue-700 whitespace-normal text-center max-w-full">
                {vacancy.categoria}
              </span>
            </div>
            
            <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-4 text-gray-600 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-blue-600 flex-shrink-0 w-4 h-4" />
                <span className="font-medium">{vacancy.empresa?.nombre}</span>
              </div>
              <div className="hidden sm:block text-gray-300">|</div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 w-4 h-4" />
                <span>{vacancy.ubicacion || 'Ubicación no especificada'}</span>
              </div>
            </div>
          </div>

          {/* Detalles principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-6 md:p-8">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white ">
              <FaMoneyBillWave className="text-lg sm:text-xl text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Salario</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{formatSalario(vacancy.salario)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white ">
              <FaClock className="text-lg sm:text-xl text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Tipo de empleo</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{vacancy.tipoEmpleo || 'No especificado'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white ">
              <FaBriefcase className="text-lg sm:text-xl text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Categoría</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{vacancy.categoria}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-white ">
              <FaCalendarAlt className="text-lg sm:text-xl text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Fecha de publicación</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{formatDate(vacancy.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Información de la empresa */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Sobre la empresa</h2>
            <div className="flex flex-row sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                <FaBuilding className="text-2xl sm:text-3xl text-gray-400" />
              </div>
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">{vacancy.empresa?.nombre}</h3>
                <p className="text-sm sm:text-base text-gray-600">{vacancy.empresa?.giro || 'Sin información disponible'}</p>
                {vacancy.empresa?.ubicacion && (
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 w-4 h-4" />
                    <span className="break-words">{vacancy.empresa.ubicacion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción de la vacante */}
          <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Descripción del puesto</h2>
            <div className="prose max-w-none">
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">{vacancy.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}