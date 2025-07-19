'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const editProfileSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  telefono: z.string().optional().nullable(),
  linkedinUrl: z.string().url('URL de LinkedIn inválida').optional().or(z.literal('')),
  portfolioUrl: z.string().url('URL de portafolio inválida').optional().or(z.literal('')),
  resumenProfesional: z.string().optional().nullable(),
  tituloProfesional: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  pais: z.string().optional().nullable(),
  disponibleReubicacion: z.enum(['SI', 'NO', 'ABIERTO']).optional().nullable(),
  salarioMinimo: z.coerce.number().positive('El salario mínimo debe ser positivo').optional().nullable(),
  salarioMaximo: z.coerce.number().positive('El salario máximo debe ser positivo').optional().nullable(),
  monedaSalario: z.string().optional().nullable(),
});

export const editProfile = async (formData: FormData) => {
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

    // Convertir FormData a objeto
    const data = Object.fromEntries(formData);
    
    // Limpiar campos vacíos
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key, 
        value === '' ? null : value
      ])
    );

    // Validar datos
    const validatedData = editProfileSchema.parse(cleanedData);

    // Validar que salario máximo sea mayor que mínimo si ambos están presentes
    if (validatedData.salarioMinimo && validatedData.salarioMaximo && 
        validatedData.salarioMinimo > validatedData.salarioMaximo) {
      return {
        ok: false,
        message: "El salario máximo debe ser mayor que el salario mínimo"
      };
    }

    // Actualizar el candidato
    const updatedCandidato = await prisma.candidatos.update({
      where: {
        usuarioId: session.user.id
      },
      data: validatedData
    });

    // Revalidar la página del perfil
    revalidatePath('/home/candidate/profile');

    return {
      ok: true,
      message: "Perfil actualizado correctamente",
      candidato: updatedCandidato
    };

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    
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