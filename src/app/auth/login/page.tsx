"use client"
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { login } from '@/actions';
import { Metadata } from 'next';


interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage("");
    const resp = await login(data.email, data.password);
    if (!resp.ok) {
      setErrorMessage(resp.message || "Credenciales incorrectas");
      return;
    }
    window.location.replace("/home/candidate");
  };

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">Iniciar sesión</h1>
        <p className="mb-2 text-sm text-gray-500">Ingresa tus credenciales para acceder a tu cuenta</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email', { required: 'El correo es obligatorio' })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.email && <span className="block mt-1 text-xs text-red-500">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder=""
            {...register('password', { required: 'La contraseña es obligatoria' })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.password && <span className="block mt-1 text-xs text-red-500">{errors.password.message}</span>}
        </div>
        <button type="submit" className="w-full p-3 font-semibold text-white transition-all duration-200 bg-blue-800 rounded-lg shadow hover:bg-blue-900">
          Iniciar sesión
        </button>
        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-500 rounded-lg bg-red-50">{errorMessage}</div>
        )}
      </form>
      <div className="mt-4 text-center">
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-gray-500 underline transition-colors hover:text-blue-600">
            ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">¿No tienes una cuenta? </span>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link 
            href="/auth/register/candidate" 
            className="text-blue-600 px-4 py-2 rounded-lg border border-blue-600 transition-colors hover:bg-blue-50"
          >
            Registrarse como Candidato
          </Link>
          <Link 
            href="/auth/register/company" 
            className="text-blue-600 px-4 py-2 rounded-lg border border-blue-600 transition-colors hover:bg-blue-50"
          >
            Registrarse como Empresa
          </Link>
        </div>
      </div>
    </>
  );
}
  