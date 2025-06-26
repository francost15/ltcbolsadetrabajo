import { Profile } from "@/interfaces"
import { FaPencil } from "react-icons/fa6"

interface Props{
  profile: Profile
}
export const Skills = ({ profile }: Props) => {
  return (
    <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">Idiomas</h3>
      {profile.idiomas.length === 0 ? (
        <p className="text-gray-600">No hay idiomas registrados</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {profile.idiomas.map((idioma) => (
            <div key={idioma.id} className="flex justify-between items-center">
              <span className="text-gray-600">{idioma.nombre}</span>
              <span className="text-gray-500">{idioma.nivel}</span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div>
      <h3 className="font-semibold text-gray-700 mb-2">Certificaciones</h3>
      {profile.certificaciones.length === 0 ? (
        <p className="text-gray-600">No hay certificaciones registradas</p>
      ) : (
        <div className="space-y-4">
          {profile.certificaciones.map((cert) => (
            <div key={cert.id} className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-700">{cert.nombre}</p>
                <p className="text-gray-600">{cert.entidadEmisora}</p>
                <p className="text-sm text-gray-500">{cert.anioObtencion}</p>
              </div>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <FaPencil />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {profile.preferencias && (
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Preferencias Laborales</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 font-medium">Tipos de Empleo</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.preferencias.tiposEmpleo.map((tipo, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {tipo}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Modalidades de Trabajo</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.preferencias.modalidadesTrabajo.map((modalidad, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {modalidad}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}
