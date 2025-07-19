'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getVacancyById = async (id: string) => {
  try {
    const session = await auth();
    
    const vacancy = await prisma.vacantes.findFirst({
      where: {
        id: id,
      },
      include: {
        empresa: true
      }
    });

    if (!vacancy) return null;

    // Verificar si la vacante pertenece a la empresa del usuario actual
    let isOwner = false;
    if (session?.user?.email) {
      const usuario = await prisma.usuarios.findUnique({
        where: { email: session.user.email },
        include: { empresa: true }
      });
      
      isOwner = usuario?.empresa?.id === vacancy.empresaId;
    }

    return {
      ...vacancy,
      salario: vacancy.salario ? Number(vacancy.salario) : null,
      fechaPublicacion: vacancy.createdAt,
      isOwner
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener vacante por id");
  }
}; 