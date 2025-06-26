'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteVacancy = async (id: string) => {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return {
        ok: false,
        message: 'No autorizado'
      };
    }

    // Primero buscamos el usuario y su empresa
    const usuario = await prisma.usuarios.findFirst({
      where: { 
        email: session.user.email,
        rol: 'empresa'
      },
      include: {
        empresa: true
      }
    });

    if (!usuario?.empresa) {
      return {
        ok: false,
        message: 'No se encontró la empresa asociada'
      };
    }

    // Buscamos la vacante y verificamos que pertenezca a la empresa del usuario
    const vacante = await prisma.vacantes.findFirst({
      where: { 
        id,
        empresaId: usuario.empresa.id
      }
    });

    if (!vacante) {
      return {
        ok: false,
        message: 'No tienes permiso para eliminar esta vacante'
      };
    }

    // Si llegamos aquí, el usuario tiene permiso para eliminar
    await prisma.vacantes.delete({
      where: { id }
    });

    revalidatePath('/home/company');

    return {
      ok: true,
      message: 'Vacante eliminada correctamente'
    };

  } catch (error) {
    console.error('Error al eliminar la vacante:', error);
    return {
      ok: false,
      message: 'Error al eliminar la vacante'
    };
  }
}; 