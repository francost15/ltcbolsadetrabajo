import { FaPencil } from "react-icons/fa6"
import { Profile } from "@/interfaces"

interface Props{
  profile: Profile
}

export const PersonalInfo = ({ profile }: Props) => {
  return (
    <div className="space-y-6">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{profile.nombre}</h1>
        <p className="text-gray-600">{profile.tituloProfesional || 'Sin título profesional'}</p>
      </div>
      <button className="p-2 text-gray-600 hover:text-blue-600">
        <FaPencil />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-gray-700">Contacto</h3>
        <p className="text-gray-600">{profile.email}</p>
        <p className="text-gray-600">{profile.telefono}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700">Ubicación</h3>
        <p className="text-gray-600">
          {[profile.ciudad, profile.estado, profile.pais]
            .filter(Boolean)
            .join(', ') || 'Sin ubicación'}
        </p>
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-gray-700">Resumen Profesional</h3>
      <p className="text-gray-600">{profile.resumenProfesional}</p>
    </div>

    <div>
      <h3 className="font-semibold text-gray-700">Enlaces</h3>
      <div className="space-y-2">
        {profile.linkedinUrl && (
          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:underline block">
            LinkedIn
          </a>
        )}
        {profile.portfolioUrl && (
          <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
             className="text-blue-600 hover:underline block">
            Portfolio
          </a>
        )}
      </div>
    </div>
  </div>
  )
}
