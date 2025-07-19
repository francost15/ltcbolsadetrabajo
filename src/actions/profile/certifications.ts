'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const certificationSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la certificación es requerido'),
  entidadEmisora: z.string().min(1, 'La entidad emisora es requerida'),
  anioObtencion: z.coerce.number().min(1900, 'Año inválido').max(new Date().getFullYear(), 'El año no puede ser futuro'),
});

// Crear nueva certificación
export const createCertification = async (formData: FormData) => {
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
    const validatedData = certificationSchema.parse(data);

    // Crear la certificación
    const certificacion = await prisma.certificaciones.create({
      data: {
        candidatoId: candidato.id,
        nombre: validatedData.nombre,
        entidadEmisora: validatedData.entidadEmisora,
        anioObtencion: validatedData.anioObtencion,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Certificación agregada correctamente",
      certificacion
    };

  } catch (error) {
    console.error("Error al crear certificación:", error);
    
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

// Actualizar certificación existente
export const updateCertification = async (certificationId: string, formData: FormData) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la certificación pertenece al usuario
    const certificacion = await prisma.certificaciones.findFirst({
      where: {
        id: certificationId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!certificacion) {
      return {
        ok: false,
        message: "Certificación no encontrada"
      };
    }

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);

    // Validar datos
    const validatedData = certificationSchema.parse(data);

    // Actualizar la certificación
    const updatedCertificacion = await prisma.certificaciones.update({
      where: { id: certificationId },
      data: {
        nombre: validatedData.nombre,
        entidadEmisora: validatedData.entidadEmisora,
        anioObtencion: validatedData.anioObtencion,
      }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Certificación actualizada correctamente",
      certificacion: updatedCertificacion
    };

  } catch (error) {
    console.error("Error al actualizar certificación:", error);
    
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

// Eliminar certificación
export const deleteCertification = async (certificationId: string) => {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        ok: false,
        message: "No autorizado"
      };
    }

    // Verificar que la certificación pertenece al usuario
    const certificacion = await prisma.certificaciones.findFirst({
      where: {
        id: certificationId,
        candidato: {
          usuarioId: session.user.id
        }
      }
    });

    if (!certificacion) {
      return {
        ok: false,
        message: "Certificación no encontrada"
      };
    }

    // Eliminar la certificación
    await prisma.certificaciones.delete({
      where: { id: certificationId }
    });

    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Certificación eliminada correctamente"
    };

  } catch (error) {
    console.error("Error al eliminar certificación:", error);
    
    return {
      ok: false,
      message: "Error interno del servidor"
    };
  }
}; 