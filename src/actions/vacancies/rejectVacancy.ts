'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function rejectVacancy(vacancyId: string) {
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

    // Buscar el match existente
    const existingMatch = await prisma.matches.findUnique({
      where: {
        candidatoId_vacanteId: {
          candidatoId: candidato.id,
          vacanteId: vacancyId
        }
      }
    });

    if (!existingMatch) {
      // Si no existe el match, lo creamos
      await prisma.matches.create({
        data: {
          candidatoId: candidato.id,
          vacanteId: vacancyId,
          porcentajeMatch: 0,
          empresaInteresada: false,
          candidatoEnvioInfo: false
        }
      });
    } else {
      // Si existe, lo actualizamos
      await prisma.matches.update({
        where: {
          candidatoId_vacanteId: {
            candidatoId: candidato.id,
            vacanteId: vacancyId
          }
        },
        data: {
          empresaInteresada: false,
          candidatoEnvioInfo: false
        }
      });
    }

    return {
      ok: true,
      message: "Vacante rechazada exitosamente"
    };

  } catch (error) {
    console.error("Error al rechazar la vacante:", error);
    return {
      ok: false,
      message: "Error al rechazar la vacante"
    };
  }
} 