import { getCompany } from "@/actions";
import { auth } from "@/auth";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BackButton } from "@/components";
import { LogoutButton } from "@/components/ui/LogoutButton";
import Image from "next/image";
import Link from "next/link";
import { FaBuilding, FaMapMarkerAlt, FaEnvelope, FaClock, FaIdCard, FaPen } from "react-icons/fa";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyProfilePage({ params }: Props) {
  const session = await auth();
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { company } = await getCompany(id);
  const isOwner = session?.user?.id === company?.usuarioId;

  if (!company) {
    return (
      <div className="container px-4 py-8 mx-auto">
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
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          {/* Cabecera con logo e información principal */}
          <div className="p-6 border-b border-gray-200 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <BackButton/>
              {isOwner && (
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                  <Link
                    href={`/home/company/profile/${id}/edit`}
                    className="inline-flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 min-h-10 touch-manipulation"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <FaPen className="w-4 h-4" />
                    Editar Perfil
                  </Link>
                  <LogoutButton />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-6 items-center sm:flex-row">
              <div className="flex overflow-hidden relative justify-center items-center w-32 h-32 bg-gray-100 rounded-lg">
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
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{company.nombre}</h1>
                <div className="mt-4 space-y-2">
                  {company.giro && (
                    <p className="flex gap-2 justify-center items-center text-gray-600 sm:justify-start">
                      <FaIdCard className="text-blue-600" />
                      <span>{company.giro}</span>
                    </p>
                  )}
                  {company.ubicacion && (
                    <p className="flex gap-2 justify-center items-center text-gray-600 sm:justify-start">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{company.ubicacion}</span>
                    </p>
                  )}
                  <p className="flex gap-2 justify-center items-center text-gray-600 sm:justify-start">
                    <FaEnvelope className="text-blue-600" />
                    <span>{company.usuario.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">Información de registro</h2>
                <div className="space-y-2">
                  <p className="flex gap-2 items-center text-gray-600">
                    <FaClock className="text-blue-600" />
                    <span>Registrado el: {formatDate(company.createdAt)}</span>
                  </p>
                  <p className="flex gap-2 items-center text-gray-600">
                    <FaClock className="text-blue-600" />
                    <span>Última actualización: {formatDate(company.updatedAt)}</span>
                  </p>
                </div>
              </div>

              {/* Suscripción activa */}
              {company.usuario.suscripciones.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">Plan actual</h2>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">
                      {company.usuario.suscripciones[0].plan.nombre}
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      {company.usuario.suscripciones[0].plan.descripcion}
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
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