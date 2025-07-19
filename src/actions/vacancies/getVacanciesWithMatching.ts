'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PYTHON_API_URL, API_ENDPOINTS, TIMEOUTS, createRequest, withRetry } from "@/config/api";

export const getVacanciesWithMatching = async () => {
  const startTime = Date.now();
  
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
      },
      select: {
        id: true,
        curriculum: true,
        experiencias: true
      }
    });

    if (!candidato) {
      return {
        ok: false,
        message: "Candidato no encontrado"
      };
    }

    if (!candidato.curriculum) {
      console.log('⚠️ El candidato no tiene CV subido');
      return {
        ok: true,
        vacantes: [],
        message: "Por favor, sube tu CV primero para ver vacantes que coincidan con tu perfil"
      };
    }

    // Intentar conectar con tu API de Python
    try {
      console.log('🐍 Conectando con API de Python...', PYTHON_API_URL);
      
      // Verificar que la API esté disponible
      const healthResponse = await createRequest(
        API_ENDPOINTS.HEALTH,
        { method: 'GET' },
        TIMEOUTS.HEALTH_CHECK
      );

      if (!healthResponse.ok) {
        throw new Error('API de Python no disponible');
      }

      console.log('✅ API de Python disponible, obteniendo matches...');

      // Obtener matches con retry
      const matchingResponse = await withRetry(async () => {
        console.log('🔄 Solicitando matches a la API de Python...');
        
        const response = await createRequest(
          API_ENDPOINTS.GET_MATCHES(session.user.id),
          { method: 'GET' },
          TIMEOUTS.MATCHING
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Error HTTP ${response.status}:`, errorText);
          
          if (response.status === 404) {
            throw new Error('Candidato no encontrado en la API');
          }
          
          throw new Error(`Error en API: ${response.status} - ${errorText}`);
        }

        return response.json();
      });

      console.log('📥 Respuesta recibida de la API de Python');

      if (!matchingResponse.matches || !Array.isArray(matchingResponse.matches)) {
        console.log('⚠️ Respuesta sin matches válidos');
        throw new Error('Respuesta inválida de la API');
      }

      // Filtrar matches con score >= 60%
      const goodMatches = matchingResponse.matches.filter((match: any) => match.score >= 60);
      const vacanteIds = goodMatches.map((match: any) => match.vacante.id);

      console.log('🎯 Matches encontrados:', goodMatches.length);

      if (vacanteIds.length === 0) {
        return {
          ok: true,
          vacantes: [],
          message: "No hay vacantes que coincidan con tu perfil (score >= 60%)"
        };
      }

      // Obtener detalles de vacantes desde la base de datos
      const vacantes = await prisma.vacantes.findMany({
        where: {
          id: { in: vacanteIds },
          activa: true,
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
              candidatoEnvioInfo: true,
              fechaCandidatoEnvio: true,
              empresaInteresada: true
            }
          }
        }
      });

      console.log('🏢 Vacantes encontradas en BD:', vacantes.length);

      // Combinar información
      const vacantesConMatch = vacantes.map(vacante => {
        const matchInfo = goodMatches.find(
          (match: any) => match.vacante.id === vacante.id
        );
        
        const matchRecord = vacante.matches[0]; // Solo hay un match por candidato/vacante
        
        return {
          id: vacante.id,
          titulo: vacante.titulo,
          descripcion: vacante.descripcion,
          categoria: vacante.categoria,
          empresa: {
            nombre: vacante.empresa.nombre,
            logo: vacante.empresa.logo,
            ubicacion: vacante.empresa.ubicacion || 'No especificada'
          },
          salario: vacante.salario ? Number(vacante.salario) : null,
          ubicacion: vacante.ubicacion || 'No especificada',
          fechaPublicacion: vacante.createdAt,
          fechaActualizacion: vacante.updatedAt,
          activa: vacante.activa,
          tipoEmpleo: vacante.tipoEmpleo || 'No especificado',
          match: matchInfo?.score || 0,
          analisis: matchInfo?.analisis || null,
          areas_mejora: matchInfo?.areas_mejora || [],
          habilidades_match: matchInfo?.habilidades_match || null,
          // Información del estado de postulación
          yaPostulado: matchRecord?.candidatoEnvioInfo || false,
          fechaPostulacion: matchRecord?.fechaCandidatoEnvio || null,
          empresaInteresada: matchRecord?.empresaInteresada || false
        };
      });

      // Ordenar por match descendente
      vacantesConMatch.sort((a, b) => b.match - a.match);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Matching desde API de Python completado en ${processingTime}ms`);

      return {
        ok: true,
        vacantes: vacantesConMatch,
        candidato_info: matchingResponse.candidato || null,
        matches_encontrados: vacantesConMatch.length,
        score_minimo: '60%',
        tiempo_procesamiento: processingTime,
        source: 'python_api'
      };

    } catch (apiError) {
      console.error('❌ Error con API de Python:', apiError);
      console.log('🔄 Usando sistema local como fallback...');
      
      // Fallback: devolver array vacío para mostrar mensaje de "no hay vacantes"
      // En lugar de mostrar vacantes sin match real
      const processingTime = Date.now() - startTime;
      console.log(`🔄 Fallback local completado en ${processingTime}ms`);

      return {
        ok: true,
        vacantes: [], // Array vacío para mostrar mensaje amigable
        fallback: true,
        tiempo_procesamiento: processingTime,
        source: 'local_database',
        message: "No hay vacantes disponibles en este momento"
      };
    }

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Error general:', error);
    return {
      ok: false,
      message: 'Error al obtener las vacantes con matching',
      tiempo_procesamiento: processingTime
    };
  }
}; 