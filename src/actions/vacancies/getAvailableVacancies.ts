'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getAvailableVacancies = async () => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    const candidato = await prisma.candidatos.findUnique({
      where: {
        usuarioId: session.user.id
      }
    });

    if (!candidato) {
      return {
        ok: false,
        message: "Candidato no encontrado"
      };
    }

    // Obtener todas las vacantes activas que:
    // 1. No han sido rechazadas por el candidato
    // 2. No han sido postuladas por el candidato
    const vacantes = await prisma.vacantes.findMany({
      where: {
        activa: true,
        NOT: {
          matches: {
            some: {
              candidatoId: candidato.id,
              OR: [
                { empresaInteresada: false }, // Rechazada
                { candidatoEnvioInfo: true }  // Postulada
              ]
            }
          }
        }
      },
      include: {
        empresa: {
          select: {
            nombre: true,
            logo: true,
            ubicacion: true
          }
        },
        matches: {
          where: {
            candidatoId: candidato.id
          },
          select: {
            porcentajeMatch: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      ok: true,
      vacantes: vacantes.map(v => ({
        id: v.id,
        titulo: v.titulo,
        descripcion: v.descripcion,
        categoria: v.categoria,
        empresa: {
          nombre: v.empresa.nombre,
          logo: v.empresa.logo,
          ubicacion: v.empresa.ubicacion || 'No especificada'
        },
        salario: v.salario ? Number(v.salario) : null,
        ubicacion: v.ubicacion || 'No especificada',
        fechaPublicacion: v.createdAt,
        fechaActualizacion: v.updatedAt,
        activa: v.activa,
        tipoEmpleo: v.tipoEmpleo || 'No especificado',
        match: v.matches[0]?.porcentajeMatch ? Number(v.matches[0].porcentajeMatch) : 0
      }))
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al obtener las vacantes'
    };
  }
}; 