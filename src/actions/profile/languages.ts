'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const languageSchema = z.object({
  nombre: z.string().min(1, 'El nombre del idioma es requerido'),
  nivel: z.enum(['NATIVO', 'AVANZADO_C2', 'AVANZADO_C1', 'INTERMEDIO_B2', 'INTERMEDIO_B1', 'BASICO_A2', 'BASICO_A1']),
});

// Crear nuevo idioma
export const createLanguage = async (formData: FormData) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que el candidato existe
    const candidato = await prisma.candidatos.findUnique({
      where: { usuarioId: session.user.id }
    });

    if (!candidato) {
      return {
        ok: false,
        message: "Candidato no encontrado"
      };
    }

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);

    // Validar datos
    const validatedData = languageSchema.parse(data);

    // Crear el idioma
    const idioma = await prisma.idiomas.create({
      data: {
        candidatoId: candidato.id,
        nombre: validatedData.nombre,
        nivel: validatedData.nivel,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Idioma agregado correctamente",
      idioma
    };

  } catch (error) {
    console.error("Error al crear idioma:", error);
    
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        message: "Datos inválidos",
        errors: error.errors
      };
    }

    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
};

// Actualizar idioma existente
export const updateLanguage = async (languageId: string, formData: FormData) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que el idioma pertenece al usuario
    const idioma = await prisma.idiomas.findFirst({
      where: {
        id: languageId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!idioma) {
      return {
        ok: false,
        message: "Idioma no encontrado"
      };
    }

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);

    // Validar datos
    const validatedData = languageSchema.parse(data);

    // Actualizar el idioma
    const updatedIdioma = await prisma.idiomas.update({
      where: { id: languageId },
      data: {
        nombre: validatedData.nombre,
        nivel: validatedData.nivel,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Idioma actualizado correctamente",
      idioma: updatedIdioma
    };

  } catch (error) {
    console.error("Error al actualizar idioma:", error);
    
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        message: "Datos inválidos",
        errors: error.errors
      };
    }

    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
};

// Eliminar idioma
export const deleteLanguage = async (languageId: string) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que el idioma pertenece al usuario
    const idioma = await prisma.idiomas.findFirst({
      where: {
        id: languageId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!idioma) {
      return {
        ok: false,
        message: "Idioma no encontrado"
      };
    }

    // Eliminar el idioma
    await prisma.idiomas.delete({
      where: { id: languageId }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Idioma eliminado correctamente"
    };

  } catch (error) {
    console.error("Error al eliminar idioma:", error);
    
    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
}; 