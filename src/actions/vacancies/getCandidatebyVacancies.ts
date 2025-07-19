'use server'

import prisma from "@/lib/prisma";

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
    const matches = await prisma.matches.findMany({
      where: {
        vacanteId,
        // Mostrar todos los candidatos que se postularon
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
      },
      orderBy: {
        porcentajeMatch: 'desc'
      }
    });

    const candidates: CandidateResponse[] = matches.map(match => ({
      id: match.candidato.id,
      nombre: match.candidato.nombre,
      email: match.candidato.usuario.email,
      tituloProfesional: match.candidato.tituloProfesional,
      resumenProfesional: match.candidato.resumenProfesional,
      porcentajeMatch: Number(match.porcentajeMatch),
      ciudad: match.candidato.ciudad,
      pais: match.candidato.pais,
      linkedinUrl: match.candidato.linkedinUrl
    }));

    return {
      ok: true,
      candidates
    };

  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return {
      ok: false,
      error: 'Error al obtener los candidatos'
    };
  }
};

