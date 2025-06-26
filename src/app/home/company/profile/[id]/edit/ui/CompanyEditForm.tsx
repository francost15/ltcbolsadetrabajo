'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editCompany } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { MEXICAN_CITIES } from "@/constants/cities";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { giros } from "@/constants/giros";
import { CompanyInterface } from "@/interfaces/Company";

const companySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  giro: z.string().min(1, 'El giro es requerido'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  logo: z.string().optional().nullable(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface Props {
  company: CompanyInterface;
}

export const CompanyEditForm = ({ company }: Props) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState(company.logo);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombre: company.nombre,
      giro: company.giro || '',
      ubicacion: company.ubicacion || '',
      logo: company.logo,
    }
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Crear URL temporal para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const formData = new FormData();
      
      // Agregar los datos del formulario
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Agregar el archivo de logo si existe
      if (fileInputRef.current?.files?.[0]) {
        formData.append('logoFile', fileInputRef.current.files[0]);
      }

      const result = await editCompany(company.id, formData);
      
      if (result.ok) {
        toast.success('Empresa actualizada correctamente');
        router.push(`/home/company/profile/${company.id}`);
        router.refresh();
      } else {
        toast.error(result.error || 'Error al actualizar la empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la empresa');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Logo Upload */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <label className="block text-base font-medium text-gray-900">
            Logo de la empresa
          </label>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            Imagen recomendada: PNG, JPG (max. 5MB)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 group hover:bg-gray-100 transition-colors">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Logo preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Sin logo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-white text-sm hover:underline focus:outline-none"
              >
                Cambiar imagen
              </button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="text-sm text-gray-600">
              <p>Tu logo aparecerá en:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Tu perfil de empresa</li>
                <li>Tus publicaciones de vacantes</li>
                <li>Resultados de búsqueda</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-base font-medium text-gray-900 mb-2">
            Nombre de la empresa
          </label>
          <input
            type="text"
            {...register('nombre')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Ej: Mi Empresa S.A. de C.V."
          />
          {errors.nombre && (
            <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-base font-medium text-gray-900 mb-2">
            Giro comercial
          </label>
          <select
            {...register('giro')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Selecciona un giro</option>
            {giros.map((giro: string) => (
              <option key={giro} value={giro}>
                {giro}
              </option>
            ))}
          </select>
          {errors.giro && (
            <p className="mt-2 text-sm text-red-600">{errors.giro.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Autocomplete
            label="Ubicación"
            placeholder="Ej: Ciudad de México, Guadalajara, etc."
            options={MEXICAN_CITIES}
            value={watch('ubicacion')}
            onChange={(value) => setValue('ubicacion', value)}
            error={errors.ubicacion?.message}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push(`/home/company/profile/${company.id}`)}
          className="order-2 sm:order-1 w-full sm:w-1/2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="order-1 sm:order-2 w-full sm:w-1/2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}; 