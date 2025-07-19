'use server'

import { auth } from "@/auth";
import { PYTHON_API_URL, API_ENDPOINTS, TIMEOUTS, createRequest, withRetry } from "@/config/api";

export async function getMatchFromAPI(vacancyId: string) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    console.log('🐍 Obteniendo match desde API de Python para vacante:', vacancyId);

    // Obtener todos los matches del candidato desde la API
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
        throw new Error(`Error en API: ${response.status} - ${errorText}`);
      }

      return response.json();
    });

    if (!matchingResponse.matches || !Array.isArray(matchingResponse.matches)) {
      console.log('⚠️ Respuesta sin matches válidos');
      return {
        ok: false,
        message: "No se encontraron matches en la API"
      };
    }

    // Buscar el match específico para esta vacante
    const matchInfo = matchingResponse.matches.find((match: any) => match.vacante.id === vacancyId);

    if (!matchInfo) {
      console.log('⚠️ No se encontró match para esta vacante en la API');
      return {
        ok: false,
        message: "No se encontró match para esta vacante"
      };
    }

    console.log(`✅ Match encontrado: ${matchInfo.score}% para vacante: ${matchInfo.vacante.titulo}`);

    return {
      ok: true,
      match: matchInfo.score,
      analisis: matchInfo.analisis || null,
      areas_mejora: matchInfo.areas_mejora || [],
      habilidades_match: matchInfo.habilidades_match || null
    };

  } catch (error) {
    console.error('❌ Error al obtener match desde API:', error);
    
    // Detectar el tipo específico de error
    let errorMessage = "Error al obtener el match desde la API";
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        errorMessage = "Servicio de matching temporalmente no disponible";
        console.log('🔴 API de Python no disponible - usando fallback');
      } else if (error.message.includes('timeout')) {
        errorMessage = "Tiempo de espera agotado al conectar con el servicio";
        console.log('⏰ Timeout en API de Python - usando fallback');
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = "No se puede resolver el dominio del servicio";
        console.log('🌐 Error de DNS en API de Python - usando fallback');
      }
    }
    
    return {
      ok: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
} 