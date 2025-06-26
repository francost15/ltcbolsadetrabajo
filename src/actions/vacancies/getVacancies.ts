'use server'

import prisma from "@/lib/prisma";


// Obtener todas las vacantes
export const getAllVacancies = async () => {
  try {
    const vacantes = await prisma.vacantes.findMany({
      where: { activa: true },
      include: {
        empresa: {
          select: {
            nombre: true,
            logo: true,
            ubicacion: true
          }
        },
        matches: {
          select: {
            candidatoEnvioInfo: true
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
        totalCandidatos: v.matches.length,
        candidatosInteresados: v.matches.filter(m => m.candidatoEnvioInfo).length
      }))
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al obtener las vacantes'
    };
  }
};

