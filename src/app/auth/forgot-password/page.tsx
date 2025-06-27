"use client"
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendResetPasswordEmail } from '@/actions/auth/reset-password';

interface ForgotPasswordInputs {
  email: string;
}

interface DevInfo {
  sentTo: string;
  originalEmail: string;
  resetLink: string;
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInputs>();
  const [emailSent, setEmailSent] = useState(false);
  const [devInfo, setDevInfo] = useState<DevInfo | null>(null);

  const onSubmit = async (data: ForgotPasswordInputs) => {
    try {
      const result = await sendResetPasswordEmail(data.email);

      if (result.error) {
        throw new Error(result.error);
      }

      setEmailSent(true);
      if ('devInfo' in result) {
        setDevInfo(result.devInfo as DevInfo);
      }
      toast.success(result.message || 'Se ha enviado un correo con las instrucciones');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar el correo');
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <h2 className="mb-4 font-bold text-2xl tracking-tight text-gray-900">¡Correo enviado!</h2>
        <p className="mb-4 text-gray-600">
          Hemos enviado las instrucciones para restablecer tu contraseña al correo proporcionado.
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        {devInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Información de desarrollo:</h3>
            <p className="text-sm text-blue-800">Email original: {devInfo.originalEmail}</p>
            <p className="text-sm text-blue-800">Enviado a: {devInfo.sentTo}</p>
            <p className="text-sm text-blue-800 break-all">
              Link: <a href={devInfo.resetLink} className="underline" target="_blank" rel="noopener noreferrer">{devInfo.resetLink}</a>
            </p>
          </div>
        )}
        <p className="text-gray-600 text-sm mt-4">
          Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
        </p>
        <Link href="/auth/login" className="mt-6 inline-block text-blue-600 hover:text-blue-800 transition-colors">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <h2 className="mb-1 font-bold text-2xl tracking-tight text-gray-900">Recuperar contraseña</h2>
        <p className="mb-2 text-gray-500 text-sm text-center">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { 
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido'
              }
            })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50"
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 rounded-lg bg-gradient-to-tr from-blue-900 to-blue-500 text-white font-semibold shadow hover:from-blue-800 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        ¿Recuerdas tu contraseña?{' '}
        <Link href="/auth/login" className="text-blue-600 underline hover:text-blue-800 transition-colors">
          Iniciar sesión
        </Link>
      </div>
    </>
  );
}