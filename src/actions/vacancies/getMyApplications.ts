'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getMyApplications = async () => {
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

    // Obtener todas las vacantes a las que el candidato se ha postulado
    const matches = await prisma.matches.findMany({
      where: {
        candidatoId: candidato.id,
        candidatoEnvioInfo: true // Solo las que se ha postulado
      },
      include: {
        vacante: {
          include: {
            empresa: {
              select: {
                nombre: true,
                logo: true,
                ubicacion: true
              }
            }
          }
        }
      },
      orderBy: {
        fechaCandidatoEnvio: 'desc'
      }
    });

    return {
      ok: true,
      postulaciones: matches.map(m => ({
        id: m.vacante.id,
        titulo: m.vacante.titulo,
        descripcion: m.vacante.descripcion,
        categoria: m.vacante.categoria,
        empresa: {
          nombre: m.vacante.empresa.nombre,
          logo: m.vacante.empresa.logo,
          ubicacion: m.vacante.empresa.ubicacion || 'No especificada'
        },
        salario: m.vacante.salario ? Number(m.vacante.salario) : null,
        ubicacion: m.vacante.ubicacion || 'No especificada',
        fechaPublicacion: m.vacante.createdAt,
        fechaActualizacion: m.vacante.updatedAt,
        activa: m.vacante.activa,
        tipoEmpleo: m.vacante.tipoEmpleo || 'No especificado',
        match: Number(m.porcentajeMatch),
        estado: m.empresaInteresada ? 'Interesado' : 'Pendiente',
        fechaPostulacion: m.fechaCandidatoEnvio
      }))
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al obtener las postulaciones'
    };
  }
}; 