"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoriaVacante } from "@prisma/client";
import { formatearCategoria, TODAS_CATEGORIAS } from "@/types/vacancy";
import { createVacancy } from "@/actions";
import { Loading } from "@/components";
import { toast } from "react-hot-toast";
import { Autocomplete } from '@/components/ui/Autocomplete';
import { MEXICAN_CITIES } from '@/constants/cities';

const vacancySchema = z.object({
  titulo: z.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(2000, "La descripción no puede tener más de 2000 caracteres"),
  salario: z.string()
    .min(1, "El salario es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "El salario debe ser un número positivo"),
  ubicacion: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  tipoEmpleo: z.string().min(1, "El tipo de empleo es requerido"),
  tipoEmpleoOtro: z.string().optional(),
  categoria: z.nativeEnum(CategoriaVacante, {
    required_error: "La categoría es requerida",
  }),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

const InputField = ({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const TextareaField = ({ label, error, ...props }: { label: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const SelectField = ({ label, error, children, ...props }: { label: string; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default function CreateVacancyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, watch, trigger, setValue } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      tipoEmpleo: "Tiempo Completo",
      categoria: CategoriaVacante.DESARROLLO_SOFTWARE,
    },
    mode: "onChange"
  });

  const onSubmit = async (data: VacancyFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      const vacancyData = {
        ...data,
        salario: parseFloat(data.salario),
        tipoEmpleo: data.tipoEmpleo === 'Otro' ? data.tipoEmpleoOtro : data.tipoEmpleo
      };

      Object.entries(vacancyData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const result = await createVacancy(formData);
      
      if (!result.ok) {
        toast.error(result.message || "Error al crear la vacante");
        return;
      }

      toast.success("Vacante creada exitosamente");
      router.push("/home/company");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la vacante. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading />;
  }

  const isFormValid = isValid && isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" onChange={() => trigger()}>
      <InputField
        label="Título"
        placeholder="Ej: Desarrollador Full Stack"
        title="Título"
        type="text"
        error={errors.titulo?.message}
        {...register('titulo')}
      />

      <TextareaField
        label="Descripción"
        placeholder="Ej: Buscamos un desarrollador Full Stack con 3 años de experiencia en React y Node.js"
        title="Descripción"
        rows={4}
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />

      <InputField
        label="Salario"
        placeholder="Ej: 100000"
        type="number"
        title="Salario"
        error={errors.salario?.message}
        {...register('salario')}
      />

      <Autocomplete
        label="Ubicación"
        placeholder="Ej: Ciudad de México, Guadalajara, etc."
        options={MEXICAN_CITIES}
        value={watch('ubicacion')}
        onChange={(value) => setValue('ubicacion', value)}
        error={errors.ubicacion?.message}
      />

      <div className="space-y-4">
        <SelectField
          label="Tipo de Empleo"
          title="Tipo de Empleo"
          error={errors.tipoEmpleo?.message}
          {...register('tipoEmpleo')}
        >
          <option value="Tiempo Completo">Tiempo Completo</option>
          <option value="Medio Tiempo">Medio Tiempo</option>
          <option value="En remoto">En remoto</option>
          <option value="Por Proyecto">Por Proyecto</option>
          <option value="Otro">Otro</option>
        </SelectField>

        {watch('tipoEmpleo') === 'Otro' && (
          <InputField
            label="Tipo de Empleo"
            placeholder="Especifique el tipo de empleo"
            type="text"
            error={errors.tipoEmpleoOtro?.message}
            {...register('tipoEmpleoOtro')}
          />
        )}
      </div>

      <SelectField
        label="Categoría"
        title="Categoría"
        error={errors.categoria?.message}
        {...register('categoria')}
      >
        {TODAS_CATEGORIAS.map((categoria) => (
          <option key={categoria} value={categoria}>
            {formatearCategoria(categoria as CategoriaVacante)}
          </option>
        ))}
      </SelectField>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          title="Cancelar"
          name="cancel"
          disabled={isSubmitting}
          type="button"
          onClick={() => router.push('/home/company')}
          className="order-2 sm:order-1 py-2.5 px-4 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-1/2 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          title="Crear Vacante"
          name="createVacancy"
          disabled={isSubmitting || !isFormValid}
          type="submit"
          className="order-1 sm:order-2 py-2.5 px-4 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creando...' : 'Crear Vacante'}
        </button>
      </div>
    </form>
  );
} 