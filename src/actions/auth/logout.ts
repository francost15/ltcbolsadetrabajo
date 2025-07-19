"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut({
    redirectTo: process.env.NEXTAUTH_URL || 'https://ltcbolsadetrabajo.com'
  });
};
