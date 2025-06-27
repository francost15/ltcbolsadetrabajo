import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCompany } from "@/actions";
import { BackButton } from "@/components";
import { CompanyEditForm } from "./ui/CompanyEditForm";

type PageParams = {
  id: string;
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Editar Perfil de Empresa - ${resolvedParams.id}`,
  };
}

export default async function EditCompanyProfilePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const session = await auth();
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { company } = await getCompany(id);

  // Verificar que el usuario sea el dueño de la empresa
  if (!company || session?.user?.id !== company.usuarioId) {
    redirect("/home/company");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container px-4 py-6 mx-auto sm:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Editar Perfil de Empresa</h1>
            <div className="w-10"></div>
          </div>

          <div className="overflow-hidden bg-white rounded-xl shadow-lg">
            <div className="p-6 sm:p-8">
              <CompanyEditForm company={company} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 