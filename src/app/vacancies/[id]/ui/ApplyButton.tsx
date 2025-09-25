'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { applyToVacancy } from '@/actions/vacancies/applyToVacancy'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FaSpinner, FaUserPlus, FaSignInAlt } from 'react-icons/fa'

interface ApplyButtonProps {
  vacancyId: string
}

export const ApplyButton = ({ vacancyId }: ApplyButtonProps) => {
  const { data: session, status } = useSession()
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!session?.user) return

    try {
      setIsApplying(true)
      const result = await applyToVacancy(vacancyId)

      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Error al postularse a la vacante')
    } finally {
      setIsApplying(false)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-500 rounded-lg">
        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
        Cargando...
      </div>
    )
  }

  // User is not authenticated - show register/login options
  if (!session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/auth/register/candidate"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaUserPlus className="w-4 h-4 mr-2" />
          Regístrate para postularte
        </Link>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          <FaSignInAlt className="w-4 h-4 mr-2" />
          Ya tengo cuenta
        </Link>
      </div>
    )
  }

  // User is authenticated and is a candidate - show apply button
  if (session.user.rol === 'candidato') {
    return (
      <button
        onClick={handleApply}
        disabled={isApplying}
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isApplying ? (
          <>
            <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
            Postulando...
          </>
        ) : (
          'Postularme'
        )}
      </button>
    )
  }

  // User is authenticated but is a company - show appropriate message
  if (session.user.rol === 'empresa') {
    return (
      <div className="px-6 py-3 text-sm text-gray-600 bg-gray-100 rounded-lg">
        Solo los candidatos pueden postularse a las vacantes
      </div>
    )
  }

  // Fallback for any other case
  return (
    <Link
      href="/auth/register/candidate"
      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      <FaUserPlus className="w-4 h-4 mr-2" />
      Regístrate para postularte
    </Link>
  )
}