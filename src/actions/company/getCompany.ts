'use server'

import prisma from "@/lib/prisma";

export const getCompany = async (id: string) => {
    try {
        const company = await prisma.empresas.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: {
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                        suscripciones: {
                            where: {
                                estado: 'activa'
                            },
                            include: {
                                plan: true
                            }
                        }
                    }
                }
            }
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