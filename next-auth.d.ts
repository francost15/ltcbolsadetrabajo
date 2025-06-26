import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      rol: string;
      nombre?: string;
      // Agrega aquí otros campos que quieras exponer en la sesión
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    rol: string;
    nombre?: string;
    // Otros campos personalizados
  }
}