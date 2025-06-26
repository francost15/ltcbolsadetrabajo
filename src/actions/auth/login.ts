"use server";

import { signIn } from "@/auth";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return "Success";
  } catch (error) {
    return "CredentialsSignin";
  }
}
export const login = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    // Si signIn retorna la sesión, puedes extraer el nombre aquí si es necesario
    // Por defecto, el nombre estará en la sesión de NextAuth en el cliente
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo iniciar sesion",
    };
  }
};
