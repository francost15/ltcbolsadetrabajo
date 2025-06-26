"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { CategoriaVacante } from "@/generated/prisma";
import { editVacancy } from "@/actions";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { MEXICAN_CITIES } from "@/constants/cities";

const vacancySchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  salario: z.coerce.number().min(0, 'El salario debe ser mayor o igual a 0').optional(),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  tipoEmpleo: z.string().min(1, 'El tipo de empleo es requerido'),
  categoria: z.nativeEnum(CategoriaVacante, {
    errorMap: () => ({ message: 'La categoría es requerida' })
  }),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

interface Props {
  vacancy: {
    id: string;
    titulo: string;
    descripcion: string;
    salario: number | null;
    ubicacion: string | null;
    tipoEmpleo: string | null;
    categoria: CategoriaVacante;
  };
}

export const VacancyForm = ({ vacancy }: Props) => {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      titulo: vacancy.titulo,
      descripcion: vacancy.descripcion,
      salario: vacancy.salario || 0,
      ubicacion: vacancy.ubicacion || '',
      tipoEmpleo: vacancy.tipoEmpleo || '',
      categoria: vacancy.categoria
    }
  });

  const onSubmit = async (data: VacancyFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      const result = await editVacancy(vacancy.id, formData);
      
      if (result.ok) {
        toast.success('Vacante actualizada correctamente');
        router.push('/home/company');
        router.refresh();
      } else {
        toast.error(result.message || 'Error al actualizar la vacante');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la vacante');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6 ">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          {...register('titulo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          {...register('descripcion')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Salario
        </label>
        <input
          type="number"
          {...register('salario')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.salario && (
          <p className="mt-1 text-sm text-red-600">{errors.salario.message}</p>
        )}
      </div>

      <div>
        <Autocomplete
          label="Ubicación"
          placeholder="Ej: Ciudad de México, Guadalajara, etc."
          options={MEXICAN_CITIES}
          value={watch('ubicacion')}
          onChange={(value) => setValue('ubicacion', value)}
          error={errors.ubicacion?.message}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tipo de Empleo
        </label>
        <select
          {...register('tipoEmpleo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Tiempo Completo">Tiempo Completo</option>
          <option value="Medio Tiempo">Medio Tiempo</option>
          <option value="En remoto">En remoto</option>
          <option value="Por Proyecto">Por Proyecto</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.tipoEmpleo && (
          <p className="mt-1 text-sm text-red-600">{errors.tipoEmpleo.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          {...register('categoria')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona una categoría</option>
          {Object.values(CategoriaVacante).map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        {errors.categoria && (
          <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/home/company')}
          className="order-2 sm:order-1 py-2.5 px-4 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-1/2 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="order-1 sm:order-2 py-2.5 px-4 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}; 