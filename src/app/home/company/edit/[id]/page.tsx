import { redirect } from 'next/navigation';
import { getVacancyById, verifyVacancyOwnership } from '@/actions';
import { VacancyForm } from './ui/VacancyForm';
import { BackButton } from '@/components';

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function EditVacancyPage({ params }: Props) {
  const { id } = await params;
  
  // Verificar que la vacante pertenece a la empresa actual
  const ownershipCheck = await verifyVacancyOwnership(id);
  
  if (!ownershipCheck.ok) {
    redirect('/home/company');
  }
  
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    redirect('/home/company');
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 py-4 sm:py-8 mx-auto max-w-2xl">
        <div className="bg-white p-4 sm:p-8">
          <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
            <BackButton />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Vacante</h1>
            <div className="w-10 sm:w-20" />
          </div>
          <VacancyForm vacancy={vacancy} />
        </div>
      </div>
    </div>
  );
}