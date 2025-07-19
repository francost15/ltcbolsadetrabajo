'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Verificar si una vacante pertenece a la empresa del usuario actual
export const verifyVacancyOwnership = async (vacancyId: string) => {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return {
        ok: false,
        message: 'No autorizado'
      };
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
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

    // Buscar la vacante y verificar que pertenezca a la empresa del usuario
    const vacante = await prisma.vacantes.findFirst({
      where: { 
        id: vacancyId,
        empresaId: usuario.empresa.id
      }
    });

    if (!vacante) {
      return {
        ok: false,
        message: 'No tienes permiso para acceder a esta vacante'
      };
    }

    return {
      ok: true,
      vacante: vacante
    };

  } catch (error) {
    console.error('Error al verificar propiedad de la vacante:', error);
    return {
      ok: false,
      message: 'Error al verificar permisos'
    };
  }
}; 