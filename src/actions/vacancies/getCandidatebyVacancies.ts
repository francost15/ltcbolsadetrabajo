'use server'

import prisma from "@/lib/prisma";
import { getMatchFromAPI } from "./getMatchFromAPI";

export interface CandidateResponse {
  id: string;
  nombre: string;
  email: string;
  tituloProfesional: string | null;
  resumenProfesional: string | null;
  porcentajeMatch: number;
  ciudad: string | null;
  pais: string | null;
  linkedinUrl: string | null;
}

export const getCandidatesByVacancy = async (vacanteId: string) => {
  try {
    console.log('🔍 Obteniendo candidatos para vacante:', vacanteId);

    // Obtener todos los candidatos que se postularon a esta vacante
    const matches = await prisma.matches.findMany({
      where: {
        vacanteId,
        candidatoEnvioInfo: true
      },
      include: {
        candidato: {
          include: {
            usuario: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    console.log(`📋 Encontrados ${matches.length} candidatos postulados`);

    // Obtener los matches actualizados desde la API de Python para cada candidato
    const candidatesWithUpdatedMatches: CandidateResponse[] = [];

    for (const match of matches) {
      try {
        // Obtener el match actualizado desde la API de Python
        const matchResponse = await getMatchFromAPI(vacanteId);
        let porcentajeMatch = Number(match.porcentajeMatch); // Usar el valor de la BD como fallback

        if (matchResponse.ok) {
          porcentajeMatch = matchResponse.match;
          console.log(`✅ Match actualizado para ${match.candidato.nombre}: ${porcentajeMatch}%`);
        } else {
          console.log(`⚠️ No se pudo obtener match actualizado para ${match.candidato.nombre}: ${matchResponse.message}`);
          // Si hay error específico de conexión, usar el valor de la BD sin mostrar error
          if (matchResponse.error?.includes('ECONNREFUSED') || matchResponse.error?.includes('fetch failed')) {
            console.log(`🔄 Usando match de BD para ${match.candidato.nombre}: ${porcentajeMatch}%`);
          }
        }

        candidatesWithUpdatedMatches.push({
          id: match.candidato.id,
          nombre: match.candidato.nombre,
          email: match.candidato.usuario.email,
          tituloProfesional: match.candidato.tituloProfesional,
          resumenProfesional: match.candidato.resumenProfesional,
          porcentajeMatch: porcentajeMatch,
          ciudad: match.candidato.ciudad,
          pais: match.candidato.pais,
          linkedinUrl: match.candidato.linkedinUrl
        });

      } catch (error) {
        console.error(`❌ Error al obtener match para candidato ${match.candidato.nombre}:`, error);
        
        // Si hay error, usar el valor de la BD
        candidatesWithUpdatedMatches.push({
          id: match.candidato.id,
          nombre: match.candidato.nombre,
          email: match.candidato.usuario.email,
          tituloProfesional: match.candidato.tituloProfesional,
          resumenProfesional: match.candidato.resumenProfesional,
          porcentajeMatch: Number(match.porcentajeMatch),
          ciudad: match.candidato.ciudad,
          pais: match.candidato.pais,
          linkedinUrl: match.candidato.linkedinUrl
        });
      }
    }

    // Ordenar por porcentaje de match de mayor a menor
    candidatesWithUpdatedMatches.sort((a, b) => b.porcentajeMatch - a.porcentajeMatch);

    console.log(`📊 Candidatos ordenados por match (mayor a menor):`);
    candidatesWithUpdatedMatches.forEach((candidate, index) => {
      console.log(`  ${index + 1}. ${candidate.nombre}: ${candidate.porcentajeMatch}%`);
    });

    return {
      ok: true,
      candidates: candidatesWithUpdatedMatches
    };

  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return {
      ok: false,
      error: 'Error al obtener los candidatos'
    };
  }
};

