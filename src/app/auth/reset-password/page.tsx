"use client"
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { resetPassword } from '@/actions/auth/reset-password';

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordInputs>();
  const password = watch('password');

  const onSubmit = async (data: ResetPasswordInputs) => {
    if (!token) {
      toast.error('Token inválido');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await resetPassword(token, data.password);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Contraseña actualizada correctamente');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al restablecer la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="mb-4 font-bold text-2xl tracking-tight text-gray-900">Enlace inválido</h2>
        <p className="text-gray-600">
          El enlace para restablecer la contraseña es inválido o ha expirado.
          Por favor, solicita un nuevo enlace.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <h2 className="mb-1 font-bold text-2xl tracking-tight text-gray-900">Restablecer contraseña</h2>
        <p className="mb-2 text-gray-500 text-sm text-center">
          Ingresa tu nueva contraseña
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
              }
            })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50"
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Confirmar contraseña</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Debes confirmar la contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 rounded-lg bg-gradient-to-tr from-blue-900 to-blue-500 text-white font-semibold shadow hover:from-blue-800 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </>
  );
} 