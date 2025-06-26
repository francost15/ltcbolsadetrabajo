import { Profile } from "@/interfaces"
import { FaPencil } from "react-icons/fa6"
import { es } from "date-fns/locale"
import { format } from "date-fns"

interface Props{
  profile: Profile
}
export const Education = ({ profile }: Props) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Presente';
    return format(new Date(date), 'MMMM yyyy', { locale: es });
  };
  return (
    <div className="space-y-6">
    {profile.educacion.length === 0 ? (
      <p className="text-gray-600">No hay educación registrada</p>
    ) : (
      profile.educacion.map((edu) => (
        <div key={edu.id} className="border-b pb-4 last:border-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{edu.titulo}</h3>
              <p className="text-gray-600">{edu.institucion}</p>
              <p className="text-sm text-gray-500">
                {formatDate(new Date(edu.fechaInicio))} - {formatDate(edu.fechaFin ? new Date(edu.fechaFin) : null)}
              </p>
              <p className="text-gray-600">{edu.campoEstudio}</p>
            </div>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <FaPencil />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
  )
}
