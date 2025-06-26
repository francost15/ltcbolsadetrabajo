"use client"
import { useForm } from 'react-hook-form';
import Link from 'next/link';

interface ForgotPasswordInputs {
  email: string;
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>();

  const onSubmit = (data: ForgotPasswordInputs) => {
    console.log(data);
    // Aquí iría la lógica para enviar el email de recuperación
  };

  return (
    <>
        <div className="flex flex-col items-center mb-6">
            <h2 className="mb-1 font-bold text-2xl tracking-tight text-gray-900">Recuperar contraseña</h2>
            <p className="mb-2 text-gray-500 text-sm text-center">Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Correo electrónico</label>
            <input
                type="email"
                placeholder="tu@email.com"
                {...register('email', { required: 'El correo es obligatorio' })}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>
            <button type="submit" className="w-full p-3 rounded-lg bg-gradient-to-tr from-blue-900 to-blue-500 text-white font-semibold shadow hover:from-blue-800 hover:to-blue-500 transition-all duration-200">
            Enviar instrucciones
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