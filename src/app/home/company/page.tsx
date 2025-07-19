"use client"

import { useEffect, useState } from "react";
import { getMyCompanyVacancies, getMyCompanyVacanciesByCategory } from "@/actions";
import { Loading, VacancyCard, AdBanner } from "@/components";
import { formatearCategoria, CATEGORIA_TODOS, TODAS_CATEGORIAS } from "@/types/vacancy";
import { VacantesInterface } from "@/interfaces";
import { FaPlus, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CategoriaVacante } from "@prisma/client";
const CategoryFilter = ({ selectedCategory, onCategoryChange }: { 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1 max-w-full sm:max-w-xs">
      {/* Botón móvil para filtros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex sm:hidden w-full items-center justify-between px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <span className="text-gray-700 truncate">
            {selectedCategory === CATEGORIA_TODOS 
              ? "Todas las categorías" 
              : formatearCategoria(selectedCategory as CategoriaVacante)}
          </span>
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista desplegable móvil */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg sm:hidden">
          {[CATEGORIA_TODOS, ...TODAS_CATEGORIAS].map((categoria) => (
            <button
              key={categoria}
              onClick={() => {
                onCategoryChange(categoria);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                selectedCategory === categoria ? 'bg-blue-50 text-blue-800' : 'text-gray-700'
              } ${categoria === CATEGORIA_TODOS ? 'border-b border-gray-100' : ''}`}
            >
              {categoria === CATEGORIA_TODOS ? "Todas las categorías" : formatearCategoria(categoria as CategoriaVacante)}
            </button>
          ))}
        </div>
      )}

      {/* Select para desktop */}
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="hidden sm:block w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        aria-label="Seleccionar categoría de vacante"
      >
        {[CATEGORIA_TODOS, ...TODAS_CATEGORIAS].map((categoria) => (
          <option key={categoria} value={categoria}>
            {categoria === CATEGORIA_TODOS ? "Todas las categorías" : formatearCategoria(categoria as CategoriaVacante)}
          </option>
        ))}
      </select>
    </div>
  );
};

const CreateVacancyButton = () => {
  const router = useRouter();
  return (
    <div className="flex-1 flex justify-end">
      <button
        onClick={() => router.push('/home/company/create')}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 justify-center"
        title="Nueva Vacante"
      >
        <FaPlus className="w-4 h-4" />
        <span className="whitespace-nowrap">Nueva Vacante</span>
      </button>
    </div>
  );
};

const EmptyState = ({ category }: { category: string }) => (
  <div className="text-center py-8">
    <p className="text-gray-600">
      No hay vacantes disponibles
      {category !== CATEGORIA_TODOS && ` en la categoría ${formatearCategoria(category as CategoriaVacante)}`}
    </p>
  </div>
);

export default function CompanyPage() {
  const [vacancies, setVacancies] = useState<VacantesInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIA_TODOS);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        const response = selectedCategory === CATEGORIA_TODOS
          ? await getMyCompanyVacancies()
          : await getMyCompanyVacanciesByCategory(selectedCategory as CategoriaVacante);

        if (response.ok) {
          setVacancies(response.vacantes!);
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [selectedCategory]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Banner de publicidad */}
        <AdBanner variant="sidebar" />
        
        {/* Contenido principal */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-center gap-4">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
            <CreateVacancyButton />
          </div>
        </div>

        <div className="space-y-4">
          {vacancies.length === 0 ? (
            <EmptyState category={selectedCategory} />
          ) : (
            vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}