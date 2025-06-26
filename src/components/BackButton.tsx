'use client'
import { FaArrowLeft } from "react-icons/fa"
interface BackButtonProps {
  className?: string;
}
export const BackButton = ({ className }: BackButtonProps) => {
  return (
    <button 
    onClick={() => window.history.back()}
    className={`inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-8 ${className}`}
  >
    <FaArrowLeft />
    Volver
  </button>
  )
}
