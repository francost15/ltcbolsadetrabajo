import { auth } from "@/auth";
import { getVacancy, getCandidatesByVacancy } from "@/actions";
import { Badge, BackButton } from "@/components";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CandidatesPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;

  // Verificar que la vacante exista y pertenezca a la empresa del usuario
  const vacancyResponse = await getVacancy(id);
  if (!vacancyResponse.ok || !vacancyResponse.vacancy) {
    redirect("/home/company");
  }

  // Verificar que el usuario sea el dueño de la empresa
  if (session?.user?.id !== vacancyResponse.vacancy.empresa.usuarioId) {
    redirect("/home/company");
  }

  const response = await getCandidatesByVacancy(id);

  if (!response.ok || !response.candidates) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error al cargar los candidatos</h1>
          <p className="mt-2 text-gray-600">{response.error || 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const { candidates } = response;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">
            Candidatos para: {vacancyResponse.vacancy.titulo}
          </h1>
          <div className="w-24"></div>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-12 bg-white ">
            <h2 className="text-xl font-semibold text-gray-700">No hay candidatos disponibles</h2>
            <p className="mt-2 text-gray-500">Aún no hay candidatos que hayan compartido su información para esta vacante.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{candidate.nombre}</h3>
                    {candidate.tituloProfesional && (
                      <p className="text-gray-600 mt-1">{candidate.tituloProfesional}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {candidate.porcentajeMatch}% Match
                  </Badge>
                </div>

                <div className="mt-4">
                  {candidate.resumenProfesional && (
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {candidate.resumenProfesional}
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {(candidate.ciudad || candidate.pais) && (
                    <p className="text-gray-600 text-sm">
                      📍 {[candidate.ciudad, candidate.pais].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    ✉️ {candidate.email}
                  </p>
                  {candidate.linkedinUrl && (
                    <a 
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <Link 
                    href={`/home/company/candidates/${candidate.id}`}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
                  >
                    Ver perfil completo
                  </Link>
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {/* TODO: Implementar contacto */}}
                  >
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 