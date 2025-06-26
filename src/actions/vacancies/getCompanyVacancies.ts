'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Obtener vacantes de mi empresa
export const getMyCompanyVacancies = async () => {
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

    const vacantes = await prisma.vacantes.findMany({
      where: {
        empresaId: usuario.empresa.id,
        activa: true
      },
      include: {
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
        salario: v.salario ? Number(v.salario) : null,
        ubicacion: v.ubicacion || 'No especificada',
        tipoEmpleo: v.tipoEmpleo || 'No especificado',
        fechaPublicacion: v.createdAt,
        fechaActualizacion: v.updatedAt,
        activa: v.activa,
        totalCandidatos: v.matches.length,
        candidatosInteresados: v.matches.filter(m => m.candidatoEnvioInfo).length
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