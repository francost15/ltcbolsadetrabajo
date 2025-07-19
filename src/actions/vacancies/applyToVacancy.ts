'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getMatchFromAPI } from "./getMatchFromAPI";

export async function applyToVacancy(vacancyId: string) {
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

    // Obtener la vacante
    const vacante = await prisma.vacantes.findUnique({
      where: {
        id: vacancyId
      }
    });

    if (!vacante) {
      return {
        ok: false,
        message: "Vacante no encontrada"
      };
    }

    // Obtener el match desde la API de Python
    const matchResponse = await getMatchFromAPI(vacancyId);
    let porcentajeMatch = 0;

    if (matchResponse.ok) {
      porcentajeMatch = matchResponse.match;
      console.log(`🎯 Match obtenido desde API de Python para ${candidato.nombre} en ${vacante.titulo}: ${porcentajeMatch}%`);
    } else {
      console.log(`⚠️ No se pudo obtener match desde API: ${matchResponse.message}`);
      // Si no se puede obtener desde la API, usar 0 como fallback
      porcentajeMatch = 0;
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
      // Si no existe el match, lo creamos con el porcentaje de la API
      await prisma.matches.create({
        data: {
          candidatoId: candidato.id,
          vacanteId: vacancyId,
          porcentajeMatch: porcentajeMatch,
          empresaInteresada: false,
          candidatoEnvioInfo: true,
          fechaCandidatoEnvio: new Date()
        }
      });
    } else {
      // Si existe, lo actualizamos con el nuevo porcentaje de la API
      await prisma.matches.update({
        where: {
          candidatoId_vacanteId: {
            candidatoId: candidato.id,
            vacanteId: vacancyId
          }
        },
        data: {
          porcentajeMatch: porcentajeMatch,
          candidatoEnvioInfo: true,
          fechaCandidatoEnvio: new Date()
        }
      });
    }

    return {
      ok: true,
      message: `Postulación enviada exitosamente. Tu match con esta vacante es del ${porcentajeMatch}%`,
      porcentajeMatch: porcentajeMatch
    };

  } catch (error) {
    console.error("Error al postularse a la vacante:", error);
    return {
      ok: false,
      message: "Error al postularse a la vacante"
    };
  }
} 