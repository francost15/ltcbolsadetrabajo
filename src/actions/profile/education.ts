'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const educationSchema = z.object({
  institucion: z.string().min(1, 'La institución es requerida'),
  titulo: z.string().min(1, 'El título es requerido'),
  campoEstudio: z.string().min(1, 'El campo de estudio es requerido'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
});

// Crear nueva educación
export const createEducation = async (formData: FormData) => {
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
    const validatedData = educationSchema.parse(data);

    // Crear la educación
    const educacion = await prisma.educaciones.create({
      data: {
        candidatoId: candidato.id,
        institucion: validatedData.institucion,
        titulo: validatedData.titulo,
        campoEstudio: validatedData.campoEstudio,
        fechaInicio: new Date(validatedData.fechaInicio),
        fechaFin: validatedData.fechaFin ? new Date(validatedData.fechaFin) : null,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Educación agregada correctamente",
      educacion
    };

  } catch (error) {
    console.error("Error al crear educación:", error);
    
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

// Actualizar educación existente
export const updateEducation = async (educationId: string, formData: FormData) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la educación pertenece al usuario
    const educacion = await prisma.educaciones.findFirst({
      where: {
        id: educationId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!educacion) {
      return {
        ok: false,
        message: "Educación no encontrada"
      };
    }

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);

    // Validar datos
    const validatedData = educationSchema.parse(data);

    // Actualizar la educación
    const updatedEducacion = await prisma.educaciones.update({
      where: { id: educationId },
      data: {
        institucion: validatedData.institucion,
        titulo: validatedData.titulo,
        campoEstudio: validatedData.campoEstudio,
        fechaInicio: new Date(validatedData.fechaInicio),
        fechaFin: validatedData.fechaFin ? new Date(validatedData.fechaFin) : null,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Educación actualizada correctamente",
      educacion: updatedEducacion
    };

  } catch (error) {
    console.error("Error al actualizar educación:", error);
    
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

// Eliminar educación
export const deleteEducation = async (educationId: string) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la educación pertenece al usuario
    const educacion = await prisma.educaciones.findFirst({
      where: {
        id: educationId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!educacion) {
      return {
        ok: false,
        message: "Educación no encontrada"
      };
    }

    // Eliminar la educación
    await prisma.educaciones.delete({
      where: { id: educationId }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Educación eliminada correctamente"
    };

  } catch (error) {
    console.error("Error al eliminar educación:", error);
    
    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
}; 