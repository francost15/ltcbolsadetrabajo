import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import prisma from "./lib/prisma";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }

      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Buscar el correo
        const user = await prisma.usuarios.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user) return null;

        // Comparar las contraseñas
        if (!bcryptjs.compareSync(password, user.password)) return null;

        // Regresar el usuario sin el password
    // Regresar el usuario sin el password y con id como string
    const { password: _, id, ...rest } = user;
    let nombre = undefined;
    
    // Si es candidato
    if (user.rol === "candidato") {
      const candidato = await prisma.candidatos.findUnique({ where: { usuarioId: user.id } });
      if (candidato) nombre = candidato.nombre;
    }
    // Si es empresa
    if (user.rol === "empresa") {
      const empresa = await prisma.empresas.findUnique({ where: { usuarioId: user.id } });
      if (empresa) nombre = empresa.nombre;
    }
    
    return { ...rest, id: id.toString(), nombre };
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
