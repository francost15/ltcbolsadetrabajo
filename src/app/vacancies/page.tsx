'use client'

import { useState, useEffect, useMemo } from 'react'
import { getAllVacancies } from '@/actions/vacancies/getVacancies'
import { TODAS_CATEGORIAS, formatearCategoria } from '@/types/vacancy'
import { FaSearch, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaDollarSign } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { NavbarHome } from '@/components/Navbar/NavbarHome'

interface Vacancy {
  id: string
  titulo: string
  descripcion: string
  categoria: any
  empresa: {
    nombre: string
    logo: string | null
    ubicacion: string
  }
  salario: number | null
  ubicacion: string
  fechaPublicacion: Date
  tipoEmpleo: string
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'TODOS'>('TODOS')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<{ min: number; max: number }>({ min: 0, max: 200000 })

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const result = await getAllVacancies()
        if (result.ok) {
          setVacancies(result.vacantes ?? [])
        }
      } catch (error) {
        console.error('Error fetching vacancies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>()
    vacancies.forEach(vacancy => {
      if (vacancy.ubicacion) {
        locations.add(vacancy.ubicacion)
      }
      if (vacancy.empresa.ubicacion) {
        locations.add(vacancy.empresa.ubicacion)
      }
    })
    return Array.from(locations).sort()
  }, [vacancies])

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      const matchesSearch = vacancy.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vacancy.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vacancy.empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'TODOS' || vacancy.categoria === selectedCategory

      const matchesLocation = selectedLocations.length === 0 ||
                             selectedLocations.includes(vacancy.ubicacion) ||
                             selectedLocations.includes(vacancy.empresa.ubicacion)

      const matchesSalary = !vacancy.salario ||
                           (vacancy.salario >= salaryRange.min && vacancy.salario <= salaryRange.max)

      return matchesSearch && matchesCategory && matchesLocation && matchesSalary
    })
  }, [vacancies, searchTerm, selectedCategory, selectedLocations, salaryRange])

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'No especificado'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    )
  }

  const clearAllFilters = () => {
    setSelectedLocations([])
    setSalaryRange({ min: 0, max: 200000 })
    setSelectedCategory('TODOS')
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarHome />

      <main className="pt-20 pb-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Encuentra tu trabajo ideal
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explora las mejores oportunidades laborales disponibles
            </p>
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar vacantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full py-3 pl-10 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters Panel */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Limpiar todo
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700">
                        Categoría
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as 'TODOS')}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="TODOS">Todas las categorías</option>
                        {TODAS_CATEGORIAS.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {formatearCategoria(categoria)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700">
                        Ubicación
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {uniqueLocations.map((location) => (
                          <label key={location} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedLocations.includes(location)}
                              onChange={() => handleLocationChange(location)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-700">{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range Filter */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700">
                        Rango de Salario
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                          <input
                            type="range"
                            min="0"
                            max="200000"
                            step="5000"
                            value={salaryRange.min}
                            onChange={(e) => setSalaryRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-xs text-gray-600 mt-1">
                            {formatSalary(salaryRange.min)}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                          <input
                            type="range"
                            min="0"
                            max="200000"
                            step="5000"
                            value={salaryRange.max}
                            onChange={(e) => setSalaryRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-xs text-gray-600 mt-1">
                            {formatSalary(salaryRange.max)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Vacancies */}
            <div className="flex-1 min-w-0">
              {/* Results Count */}
              <div className="mb-6">
                <span className="text-sm text-gray-600">
                  {filteredVacancies.length} vacante{filteredVacancies.length !== 1 ? 's' : ''} encontrada{filteredVacancies.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Cargando vacantes...</p>
                </div>
              )}

              {/* Vacancies Grid */}
              {!loading && (
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredVacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Company Info */}
                    <div className="flex items-center mb-4">
                      {vacancy.empresa.logo ? (
                        <Image
                          src={vacancy.empresa.logo}
                          alt={`Logo de ${vacancy.empresa.nombre}`}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg">
                          <FaBuilding className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{vacancy.empresa.nombre}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          {vacancy.empresa.ubicacion}
                        </div>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h2 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">
                      {vacancy.titulo}
                    </h2>

                    {/* Category */}
                    <span className="inline-block px-2 py-1 mb-3 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      {formatearCategoria(vacancy.categoria)}
                    </span>

                    {/* Description */}
                    <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                      {vacancy.descripcion}
                    </p>

                    {/* Job Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaDollarSign className="w-4 h-4 mr-2" />
                        {formatSalary(vacancy.salario)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        {vacancy.ubicacion}
                      </div>

                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/vacancies/${vacancy.id}`}
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-auto"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
                </div>
              )}

              {/* No Results */}
              {!loading && filteredVacancies.length === 0 && (
                <div className="py-12 text-center">
                  <div className="inline-block w-16 h-16 mb-4 bg-gray-200 rounded-full">
                    <FaSearch className="w-8 h-8 mx-auto mt-4 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No se encontraron vacantes
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar tus filtros o términos de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}