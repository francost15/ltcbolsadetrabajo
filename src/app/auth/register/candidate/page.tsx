"use client";
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import { login, registerUser } from "@/actions";
import { RolUsuario } from '@prisma/client';
import { Metadata } from 'next';

// Metadatos específicos para registro de candidatos
export const metadata: Metadata = {
  title: 'Registro Candidato - Crear Cuenta Gratis',
  description: 'Regístrate gratis como candidato en LTC Bolsa de Trabajo. Accede a miles de vacantes, trabajos bien pagados, empleo remoto y oportunidades laborales en México. ¡Encuentra tu trabajo ideal!',
  keywords: [
    'registro candidato gratis',
    'crear cuenta trabajo México',
    'registro bolsa trabajo',
    'cuenta candidato empleo',
    'registrarse buscar trabajo',
    'crear perfil profesional',
    'registro gratuito empleo',
    'cuenta gratis vacantes',
    'registrarse trabajos México',
    'crear cuenta cv online'
  ],
  alternates: {
    canonical: 'https://ltcbolsadetrabajo.com/auth/register/candidate',
  },
  openGraph: {
    title: 'Registro Candidato - Encuentra tu Trabajo Ideal',
    description: 'Regístrate gratis y accede a miles de oportunidades laborales en México. Conecta con las mejores empresas.',
    url: 'https://ltcbolsadetrabajo.com/auth/register/candidate',
  },
}

type FormInputs = {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
};

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    const resp = await registerUser(data.nombre, data.email, data.password, data.rol='candidato');
    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }
    await login(data.email, data.password);
    window.location.replace("/home/candidate");
  };

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">Crear cuenta como Candidato</h1>
        <p className="mb-2 text-sm text-gray-500">Regístrate gratis y encuentra tu trabajo ideal</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            {...register('nombre', { required: 'El nombre es obligatorio' })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.nombre && <span className="block mt-1 text-xs text-red-500">{errors.nombre.message}</span>}
        </div>
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
            {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.password && <span className="block mt-1 text-xs text-red-500">{errors.password.message}</span>}
        </div>
        <button type="submit" className="w-full p-3 font-semibold text-white transition-all duration-200 bg-blue-800 rounded-lg shadow hover:bg-blue-900">
          Registrarse como Candidato
        </button>
        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-500 rounded-lg bg-red-50">{errorMessage}</div>
        )}
      </form>
      <div className="mt-4 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-gray-500 underline transition-colors hover:text-blue-600"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </>
  );
}