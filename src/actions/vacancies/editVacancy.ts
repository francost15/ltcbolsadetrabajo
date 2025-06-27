'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CategoriaVacante } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vacancySchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  salario: z.coerce.number().min(0, 'El salario debe ser mayor o igual a 0').optional(),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  tipoEmpleo: z.string().min(1, 'El tipo de empleo es requerido'),
  categoria: z.nativeEnum(CategoriaVacante, {
    errorMap: () => ({ message: 'La categoría es requerida' })
  }),
});

const formatearSalario = (monto: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(monto);
};

const generarRangoSalarialTexto = (minimo?: number, maximo?: number): string => {
  if (!minimo && !maximo) return 'Salario a negociar';
  if (minimo && !maximo) return `Desde ${formatearSalario(minimo)}`;
  if (!minimo && maximo) return `Hasta ${formatearSalario(maximo)}`;
  return `${formatearSalario(minimo!)} - ${formatearSalario(maximo!)}`;
};

export const editVacancy = async (id: string, formData: FormData) => {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.email) {
      return {
        ok: false,
        message: 'No autorizado'
      };
    }

    // Obtener el usuario y su empresa
    const usuario = await prisma.usuarios.findUnique({
      where: { 
        email: session.user.email,
        rol: 'empresa'
      },
      include: { 
        empresa: true 
      }
    });

    if (!usuario) {
      return {
        ok: false,
        message: 'No tienes permisos para editar vacantes'
      };
    }

    if (!usuario.empresa) {
      return {
        ok: false,
        message: 'No se encontró la empresa asociada a tu cuenta'
      };
    }

    // Verificar que la vacante exista y pertenezca a la empresa del usuario
    const vacanteExistente = await prisma.vacantes.findFirst({
      where: {
        id,
        empresaId: usuario.empresa.id
      }
    });

    if (!vacanteExistente) {
      return {
        ok: false,
        message: 'No se encontró la vacante o no tienes permisos para editarla'
      };
    }

    // Validar y transformar datos
    const data = Object.fromEntries(formData);
    const vacancyParsed = vacancySchema.safeParse(data);

    if (!vacancyParsed.success) {
      const errors = vacancyParsed.error.errors.map(err => err.message).join(', ');
      return {
        ok: false,
        message: `Datos inválidos: ${errors}`
      };
    }

    const vacancy = vacancyParsed.data;

    // Actualizar la vacante
    const vacanteActualizada = await prisma.vacantes.update({
      where: { id },
      data: vacancy,
      include: {
        empresa: {
          select: {
            nombre: true,
            logo: true,
            ubicacion: true
          }
        }
      }
    });

    // Convertir los Decimal a números antes de devolver la respuesta
    const vacanteFormateada = {
      ...vacanteActualizada,
      salario: vacanteActualizada.salario ? Number(vacanteActualizada.salario) : null
    };

    // Revalidar rutas
    revalidatePath('/home/company');
    revalidatePath('/home/candidate');

    return {
      ok: true,
      vacante: vacanteFormateada
    };

  } catch (error) {
    console.error('Error al editar vacante:', error);
    return {
      ok: false,
      message: 'Error al editar la vacante. Por favor, intenta nuevamente.'
    };
  }
}; 