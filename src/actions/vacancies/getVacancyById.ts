'use server'

import prisma from "@/lib/prisma";

export const getVacancyById = async (id: string) => {
  try {
    const vacancy = await prisma.vacantes.findFirst({
      where: {
        id: id,
      },
      include: {
        empresa: true
      }
    });

    if (!vacancy) return null;

    return {
      ...vacancy,
      salario: vacancy.salario ? Number(vacancy.salario) : null,
      fechaPublicacion: vacancy.createdAt
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener vacante por id");
  }
}; 