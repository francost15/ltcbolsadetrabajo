"use server";

import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { RolUsuario } from "@/generated/prisma";

type RegisterCompanyData = {
  nombre: string;
  email: string;
  password: string;
  giro?: string;
  ubicacion?: string;
};

export const registerCompany = async (data: RegisterCompanyData) => {
  try {
    // Validar unicidad del email
    const exists = await prisma.usuarios.findUnique({ 
      where: { email: data.email.toLowerCase() } 
    });

    if (exists) {
      return { ok: false, message: "El correo ya está registrado" };
    }

    // Crear usuario y empresa
    const passwordHash = bcryptjs.hashSync(data.password, 10);
    const usuario = await prisma.usuarios.create({
      data: {
        email: data.email.toLowerCase(),
        password: passwordHash,
        rol: "empresa" as RolUsuario,
        empresa: {
          create: {
            nombre: data.nombre,
            giro: data.giro,
            ubicacion: data.ubicacion,
          }
        }
      },
      select: {
        id: true,
        email: true,
        rol: true,
        empresa: {
          select: {
            id: true,
            nombre: true,
            giro: true,
            ubicacion: true
          }
        }
      },
    });

    return {
      ok: true,
      usuario,
      message: "Empresa registrada correctamente",
    };
  } catch (error) {
    console.error("Error al registrar empresa:", error);
    return {
      ok: false,
      message: "No se pudo registrar la empresa",
    };
  }
}; 