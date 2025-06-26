"use server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { RolUsuario } from "@/generated/prisma";


export const registerUser = async (
  nombre: string,
  email: string,
  password: string,
  rol: RolUsuario
) => {
  try {
    // Validar unicidad del email
    const exists = await prisma.usuarios.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) {
      return { ok: false, message: "El correo ya está registrado" };
    }
    // Crear usuario (y candidato/empresa si aplica)
    const passwordHash = bcryptjs.hashSync(password, 10);
    const usuario = await prisma.usuarios.create({
      data: {
        email: email.toLowerCase(),
        password: passwordHash,
        rol,
        candidato: rol === "candidato" ? { create: { nombre } } : undefined,
        empresa: rol === "empresa" ? { create: { nombre } } : undefined,
      },
      select: {
        id: true,
        email: true,
        rol: true,
      },
    });
    return {
      ok: true,
      usuario,
      message: "Usuario creado correctamente",
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo crear al usuario",
    };
  }
};
