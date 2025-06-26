import { getCompany } from "@/actions";
import { auth } from "@/auth";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BackButton } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { FaBuilding, FaMapMarkerAlt, FaEnvelope, FaClock, FaIdCard, FaPen } from "react-icons/fa";

interface Props {
  params: {
    id: string;
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const session = await auth();
  const id = params.id;
  const { company } = await getCompany(id);
  const isOwner = session?.user?.id === company?.usuarioId;

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Perfil no encontrado</h1>
          <p className="mt-2 text-gray-600">No se pudo cargar la información de la empresa.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cabecera con logo e información principal */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <BackButton/>
              {isOwner && (
                <Link
                  href={`/home/company/profile/${id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPen className="w-4 h-4" />
                  Editar Perfil
                </Link>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FaBuilding className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{company.nombre}</h1>
                <div className="mt-4 space-y-2">
                  {company.giro && (
                    <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                      <FaIdCard className="text-blue-600" />
                      <span>{company.giro}</span>
                    </p>
                  )}
                  {company.ubicacion && (
                    <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{company.ubicacion}</span>
                    </p>
                  )}
                  <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <FaEnvelope className="text-blue-600" />
                    <span>{company.usuario.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Información de registro</h2>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-600" />
                    <span>Registrado el: {formatDate(company.createdAt)}</span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-600" />
                    <span>Última actualización: {formatDate(company.updatedAt)}</span>
                  </p>
                </div>
              </div>

              {/* Suscripción activa */}
              {company.usuario.suscripciones.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Plan actual</h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium text-blue-900">
                      {company.usuario.suscripciones[0].plan.nombre}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {company.usuario.suscripciones[0].plan.descripcion}
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      Vence el: {formatDate(company.usuario.suscripciones[0].fechaFin)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}