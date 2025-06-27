'use server'

import prisma from '@/lib/prisma';
import { ResetPasswordEmail } from '@/components/email-template';
import { Resend } from 'resend';
import crypto from 'crypto';
import { saltAndHashPassword } from '@/utils/password';

const resend = new Resend(process.env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';

export async function sendResetPasswordEmail(email: string) {
  try {
    // Verificar si el usuario existe
    const user = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        error: 'No existe un usuario con ese correo electrónico'
      };
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await prisma.usuarios.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Generar link de restablecimiento
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // En desarrollo, siempre enviar al email verificado
    const toEmail = isDevelopment ? 'francost15@gmail.com' : email;

    const { data, error } = await resend.emails.send({
      from: 'LTC Bolsa de Trabajo <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Restablece tu contraseña - LTC Bolsa de Trabajo',
      react: ResetPasswordEmail({ userEmail: email, resetLink }) as React.ReactElement,
    });

    if (error) {
      console.error('Error al enviar el email:', error);
      return { error: 'Error al enviar el email' };
    }

    if (isDevelopment && email !== toEmail) {
      console.log('MODO DESARROLLO: Email enviado a', toEmail, 'en lugar de', email);
      console.log('Link de restablecimiento:', resetLink);
      return { 
        success: true, 
        message: 'Email enviado correctamente (modo desarrollo - revisar consola)',
        devInfo: {
          sentTo: toEmail,
          originalEmail: email,
          resetLink
        }
      };
    }

    return { success: true, message: 'Email enviado correctamente' };
  } catch (error) {
    console.error('Error en el servidor:', error);
    return { error: 'Error interno del servidor' };
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    if (!token || !password) {
      return { error: 'Token y contraseña son requeridos' };
    }

    // Buscar usuario con el token válido
    const user = await prisma.usuarios.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return { error: 'Token inválido o expirado' };
    }

    // Hashear la nueva contraseña
    const hashedPassword = await saltAndHashPassword(password);

    // Actualizar contraseña y limpiar token
    await prisma.usuarios.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: true, message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return { error: 'Error interno del servidor' };
  }
} 