"use client"

import { logout } from '@/actions';
import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'danger';
  size?: 'sm' | 'md';
}

export function LogoutButton({ 
  className = "", 
  variant = 'danger',
  size = 'md'
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await logout();
    // No necesitamos redirección manual, NextAuth se encarga de esto
  };

  const baseClasses = "inline-flex gap-2 items-center font-medium rounded-lg transition-colors touch-manipulation";
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm min-h-8' : 'px-4 py-2 text-sm min-h-10';
  const variantClasses = variant === 'danger' 
    ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
    : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  return (
    <button
      onClick={handleLogout}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      <FaSignOutAlt className="w-4 h-4" />
      Cerrar sesión
    </button>
  );
} 