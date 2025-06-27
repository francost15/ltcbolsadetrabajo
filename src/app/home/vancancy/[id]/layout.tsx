import { getVacancyById } from "@/actions";
import { Metadata } from "next";

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vacancy = await getVacancyById(params.id);

  if (!vacancy) {
    return {
      title: "Vacante no encontrada | LTC Bolsa de Trabajo",
      description: "La vacante que buscas no existe o ha sido eliminada.",
    };
  }

  const salary = vacancy.salario
    ? new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(vacancy.salario)
    : "Salario no especificado";

  const description = `${vacancy.titulo} en ${vacancy.empresa?.nombre}. ${vacancy.ubicacion}. ${salary}. ${vacancy.descripcion?.substring(0, 150)}...`;

  return {
    title: `${vacancy.titulo} en ${vacancy.empresa?.nombre} | LTC Bolsa de Trabajo`,
    description,
    openGraph: {
      title: `${vacancy.titulo} - ${vacancy.empresa?.nombre}`,
      description,
      images: [
        {
          url: '/logo.svg',
          width: 1200,
          height: 630,
          alt: 'LTC Bolsa de Trabajo Logo'
        }
      ],
      locale: 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vacancy.titulo} - ${vacancy.empresa?.nombre}`,
      description,
      images: ['/logo.jpeg'],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/home/vancancy/${params.id}`,
    },
  };
}

export default function VacancyLayout({ children }: Props) {
  return <>{children}</>;
} 