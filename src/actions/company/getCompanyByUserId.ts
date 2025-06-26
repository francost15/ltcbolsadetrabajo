'use server'

import prisma from "@/lib/prisma";

export const getCompanyByUserId = async (userId: string) => {
    try {
        const company = await prisma.empresas.findUnique({
            where: { usuarioId: userId },
        });

        if (!company) {
            return {
                ok: false,
                error: 'Empresa no encontrada'
            }
        }

        return {
            ok: true,
            company
        }
    } catch (error) {
        console.error('Error al obtener la empresa:', error);
        return {
            ok: false,
            error: 'Error al obtener la empresa'
        }
    }
} 