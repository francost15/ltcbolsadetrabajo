import CreateVacancyForm from './ui/CreateVacancyForm';
import { BackButton } from '@/components';

export default function CreateVacancyPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 py-4 sm:py-8 mx-auto max-w-2xl">
        <div className="bg-white p-4 sm:p-8">
          <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
            <BackButton className="text-gray-600 hover:text-gray-800"/>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Crear Nueva Vacante</h1>
            <div className="w-10 sm:w-20" />
          </div>
          <CreateVacancyForm />
        </div>
      </div>
    </div>
  );
} 