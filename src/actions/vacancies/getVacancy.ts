'use server'

import prisma from "@/lib/prisma";

export const getVacancy = async (id: string) => {
  try {
    const vacancy = await prisma.vacantes.findUnique({
      where: { id },
      include: {
        empresa: true
      }
    });

    if (!vacancy) {
      return {
        ok: false,
        error: 'Vacante no encontrada'
      }
    }

    return {
      ok: true,
      vacancy
    }
  } catch (error) {
    console.error('Error al obtener la vacante:', error);
    return {
      ok: false,
      error: 'Error al obtener la vacante'
    }
  }
} 