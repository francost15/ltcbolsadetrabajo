"use client";
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import { registerCompany, login } from "@/actions";
import { giros, type Giro } from '@/constants/giros';
import { MEXICAN_CITIES, type MexicanCity } from '@/constants/cities';
import { Autocomplete } from '@/components/ui/Autocomplete';

type FormInputs = {
  nombre: string;
  email: string;
  password: string;
  giro: Giro;
  ubicacion: MexicanCity;
};

export default function RegisterCompanyPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isValid, isDirty }, watch, setValue } = useForm<FormInputs>({
    mode: 'onChange'
  });

  // Observar todos los campos para verificar si están completos
  const allFields = watch(['nombre', 'email', 'password', 'giro', 'ubicacion']);
  const isFormComplete = allFields.every(field => field && field.length > 0);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");
    const resp = await registerCompany(data);
    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }
    await login(data.email, data.password);
    window.location.replace("/home/company");
  };

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">Registro de Empresa</h2>
        <p className="mb-2 text-sm text-gray-500">Completa los campos para registrar tu empresa</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Nombre de la empresa</label>
          <input
            type="text"
            placeholder="Ej: Mi Empresa S.A. de C.V."
            {...register('nombre', { required: 'El nombre es obligatorio' })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.nombre && <span className="block mt-1 text-xs text-red-500">{errors.nombre.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            placeholder="empresa@ejemplo.com"
            {...register('email', { 
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido"
              }
            })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.email && <span className="block mt-1 text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...register('password', { 
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
            })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          {errors.password && <span className="block mt-1 text-xs text-red-500">{errors.password.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Giro empresarial</label>
          <select
            {...register('giro', { required: 'El giro es obligatorio' })}
            className="w-full p-3 transition-all duration-200 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
            defaultValue=""
          >
            <option value="" disabled>Selecciona un giro</option>
            {giros.map((giro) => (
              <option key={giro} value={giro}>{giro}</option>
            ))}
          </select>
          {errors.giro && <span className="block mt-1 text-xs text-red-500">{errors.giro.message}</span>}
        </div>

        <div className="mb-4">
          <Autocomplete
            label="Ubicación"
            placeholder="Selecciona una ciudad"
            options={MEXICAN_CITIES}
            value={watch('ubicacion')}
            onChange={(value) => setValue('ubicacion', value as MexicanCity)}
            error={errors.ubicacion?.message}
          />
        </div>

        <button 
          type="submit" 
          disabled={!isFormComplete || !isValid}
          className={`w-full p-3 font-semibold text-white transition-all duration-200 rounded-lg shadow
            ${isFormComplete && isValid 
              ? 'bg-blue-800 hover:bg-blue-900 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Registrar empresa
        </button>

        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-500 rounded-lg bg-red-50">
            {errorMessage}
          </div>
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