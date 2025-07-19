'use server'

import prisma from "@/lib/prisma";

export const getVacancy = async (id: string) => {
  try {
    const vacancy = await prisma.vacantes.findUnique({
      where: { id },
      include: {
        empresa: true
      }
    });

    if (!vacancy) {
      return {
        ok: false,
        error: 'Vacante no encontrada'
      }
    }

    // Transformar el objeto para hacerlo serializable
    const serializedVacancy = {
      id: vacancy.id,
      empresaId: vacancy.empresaId,
      titulo: vacancy.titulo,
      descripcion: vacancy.descripcion,
      createdAt: vacancy.createdAt.toISOString(),
      updatedAt: vacancy.updatedAt.toISOString(),
      activa: vacancy.activa,
      tipoEmpleo: vacancy.tipoEmpleo,
      categoria: vacancy.categoria,
      salario: vacancy.salario ? Number(vacancy.salario) : null, // Convertir Decimal a number
      ubicacion: vacancy.ubicacion,
      empresa: {
        id: vacancy.empresa.id,
        usuarioId: vacancy.empresa.usuarioId,
        nombre: vacancy.empresa.nombre,
        giro: vacancy.empresa.giro,
        ubicacion: vacancy.empresa.ubicacion,
        logo: vacancy.empresa.logo,
        createdAt: vacancy.empresa.createdAt.toISOString(),
        updatedAt: vacancy.empresa.updatedAt.toISOString()
      }
    };

    return {
      ok: true,
      vacancy: serializedVacancy
    }
  } catch (error) {
    console.error('Error al obtener la vacante:', error);
    return {
      ok: false,
      error: 'Error al obtener la vacante'
    }
  }
} 