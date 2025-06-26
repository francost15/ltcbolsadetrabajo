'use server'

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const companySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  giro: z.string().min(1, 'El giro es requerido'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  logo: z.string().optional().nullable(),
});

const uploadLogo = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: 'ltc/companies'
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editCompany = async (id: string, formData: FormData) => {
    try {
        let logoUrl = formData.get('logo') as string;

        // Si hay un nuevo archivo de logo, súbelo
        const logoFile = formData.get('logoFile') as File;
        if (logoFile && logoFile.size > 0) {
            const uploadedLogoUrl = await uploadLogo(logoFile);
            if (uploadedLogoUrl) {
                logoUrl = uploadedLogoUrl;
            }
        }

        // Validar los datos
        const validatedData = companySchema.parse({
            nombre: formData.get('nombre'),
            giro: formData.get('giro'),
            ubicacion: formData.get('ubicacion'),
            logo: logoUrl,
        });

        const company = await prisma.empresas.update({
            where: { id },
            data: validatedData
        });

        revalidatePath(`/home/company/profile/${id}`);
        revalidatePath(`/home/company/profile/${id}/edit`);

        return {
            ok: true,
            company
        }
    } catch (error) {
        console.error('Error al editar la empresa:', error);
        if (error instanceof z.ZodError) {
            return {
                ok: false,
                error: 'Datos de empresa inválidos',
                validationErrors: error.errors
            }
        }
        return {
            ok: false,
            error: 'Error al editar la empresa'
        }
    }
}