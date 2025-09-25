import { getVacancyById } from "@/actions";
import { NavbarHome } from "@/components/Navbar/NavbarHome";
import { ApplyButton } from "./ui/ApplyButton";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { formatearCategoria } from '@/types/vacancy';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VacancyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarHome />
        <main className="pt-20">
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Vacante no encontrada</h1>
              <p className="text-gray-600">La vacante que buscas no existe o ha sido eliminada.</p>
              <Link
                href="/vacancies"
                className="inline-block px-6 py-3 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Ver todas las vacantes
              </Link>
            </div>
          </div>
        </main>
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
    <div className="min-h-screen bg-gray-50">
      <NavbarHome />

      <main className="pt-20 pb-12">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/vacancies"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Volver a vacantes
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {vacancy.titulo}
                  </h1>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {formatearCategoria(vacancy.categoria)}
                  </span>
                </div>
              </div>

              {/* Company Info */}
              <div className="flex items-center gap-4">
                {vacancy.empresa?.logo ? (
                  <Image
                    src={vacancy.empresa.logo}
                    alt={`Logo de ${vacancy.empresa.nombre}`}
                    width={64}
                    height={64}
                    className="rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <FaBuilding className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{vacancy.empresa?.nombre}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{vacancy.empresa?.ubicacion || 'Ubicación no especificada'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 md:p-8 bg-gray-50">
              <div className="flex items-start gap-3">
                <FaMoneyBillWave className="text-xl text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Salario</p>
                  <p className="text-base font-medium text-gray-900">{formatSalario(vacancy.salario)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-xl text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="text-base font-medium text-gray-900">{vacancy.ubicacion || 'No especificada'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaClock className="text-xl text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de empleo</p>
                  <p className="text-base font-medium text-gray-900">{vacancy.tipoEmpleo || 'No especificado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-xl text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Publicado</p>
                  <p className="text-base font-medium text-gray-900">{formatDate(vacancy.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción del puesto</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{vacancy.descripcion}</p>
              </div>
            </div>

            {/* Apply Section */}
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    ¿Te interesa esta vacante?
                  </h3>
                
                </div>
                <div className="flex-shrink-0">
                  <ApplyButton vacancyId={vacancy.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}