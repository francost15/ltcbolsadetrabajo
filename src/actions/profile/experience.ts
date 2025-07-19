'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const experienceSchema = z.object({
  cargo: z.string().min(1, 'El cargo es requerido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
  trabajoActual: z.boolean().default(false),
  descripcion: z.string().min(1, 'La descripción es requerida'),
}).refine((data) => {
  if (!data.trabajoActual && !data.fechaFin) {
    return false;
  }
  return true;
}, {
  message: "Si no es trabajo actual, debe especificar fecha de fin",
  path: ["fechaFin"]
});

// Crear nueva experiencia
export const createExperience = async (formData: FormData) => {
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
    const trabajoActual = formData.get('trabajoActual') === 'true';

    // Validar datos
    const validatedData = experienceSchema.parse({
      ...data,
      trabajoActual
    });

    // Crear la experiencia
    const experiencia = await prisma.experiencias.create({
      data: {
        candidatoId: candidato.id,
        cargo: validatedData.cargo,
        empresa: validatedData.empresa,
        fechaInicio: new Date(validatedData.fechaInicio),
        fechaFin: validatedData.fechaFin ? new Date(validatedData.fechaFin) : null,
        trabajoActual: validatedData.trabajoActual,
        descripcion: validatedData.descripcion,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Experiencia agregada correctamente",
      experiencia
    };

  } catch (error) {
    console.error("Error al crear experiencia:", error);
    
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

// Actualizar experiencia existente
export const updateExperience = async (experienceId: string, formData: FormData) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la experiencia pertenece al usuario
    const experiencia = await prisma.experiencias.findFirst({
      where: {
        id: experienceId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!experiencia) {
      return {
        ok: false,
        message: "Experiencia no encontrada"
      };
    }

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);
    const trabajoActual = formData.get('trabajoActual') === 'true';

    // Validar datos
    const validatedData = experienceSchema.parse({
      ...data,
      trabajoActual
    });

    // Actualizar la experiencia
    const updatedExperiencia = await prisma.experiencias.update({
      where: { id: experienceId },
      data: {
        cargo: validatedData.cargo,
        empresa: validatedData.empresa,
        fechaInicio: new Date(validatedData.fechaInicio),
        fechaFin: validatedData.fechaFin ? new Date(validatedData.fechaFin) : null,
        trabajoActual: validatedData.trabajoActual,
        descripcion: validatedData.descripcion,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Experiencia actualizada correctamente",
      experiencia: updatedExperiencia
    };

  } catch (error) {
    console.error("Error al actualizar experiencia:", error);
    
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

// Eliminar experiencia
export const deleteExperience = async (experienceId: string) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la experiencia pertenece al usuario
    const experiencia = await prisma.experiencias.findFirst({
      where: {
        id: experienceId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!experiencia) {
      return {
        ok: false,
        message: "Experiencia no encontrada"
      };
    }

    // Eliminar la experiencia
    await prisma.experiencias.delete({
      where: { id: experienceId }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Experiencia eliminada correctamente"
    };

  } catch (error) {
    console.error("Error al eliminar experiencia:", error);
    
    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
}; 