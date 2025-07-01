"use client"
import Image from 'next/image'
import Link from 'next/link'
import { logout } from '@/actions';
import { useSession } from 'next-auth/react';
import { useMemo, useEffect, useState, useRef } from 'react';
import { getCompanyByUserId } from '@/actions/company/getCompanyByUserId';
import { RolUsuario } from '@prisma/client';



interface UserMenuConfig {
  profileLink: string;
  homeLink: string;
}

export const NavBar = () => {
  const { data: session } = useSession();
  const nombre = session?.user?.nombre || "Usuario";
  const rol = session?.user?.rol;
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (rol === 'empresa' && session?.user?.id) {
        const result = await getCompanyByUserId(session.user.id);
        if (result.ok && result.company) {
          setCompanyId(result.company.id);
        }
      }
    };

    fetchCompanyId();
  }, [rol, session?.user?.id]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const userConfig = useMemo((): UserMenuConfig => {
    switch (rol) {
      case RolUsuario.empresa:
        return {
          profileLink: `/home/company/profile/${companyId}`,
          homeLink: '/home/company'
        };
      case RolUsuario.candidato:
      default:
        return {
          profileLink: '/home/candidate/profile',
          homeLink: '/home/candidate'
        };
    }
  }, [rol, companyId]);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y enlace principal */}
          <Link href={userConfig.homeLink} className="flex gap-3 items-center">
            <Image src="/logo.svg" alt="LTC Logo" width={150} height={50} className="w-auto h-16" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-md">LTC Bolsa de Trabajo</h1>
              <p className="text-xs font-extralight text-gray-600">Por López Tamayo Consultores</p>
            </div>
          </Link>

          {/* Menú de usuario */}
          <div ref={menuRef} className="relative flex items-center gap-3">
            <span className="hidden text-sm font-medium text-gray-900 sm:block">
              {nombre}
            </span>
            
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center text-base font-bold text-gray-700 bg-gray-100 rounded-full w-9 h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors hover:bg-gray-200 active:bg-gray-300"
              aria-label="Abrir menú de usuario"
              aria-expanded={isMenuOpen}
            >
              {nombre.charAt(0).toUpperCase()}
            </button>

            {/* Menú desplegable */}
            <div className={`absolute right-0 z-20 w-48 py-2 transition-all duration-150 ease-out bg-white border border-gray-100 rounded-xl shadow-lg top-12 ${
              isMenuOpen 
                ? 'visible opacity-100 scale-100' 
                : 'invisible opacity-0 scale-95'
            }`}>
              {companyId && rol === 'empresa' && (
                <Link 
                  href={userConfig.profileLink}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  Editar perfil
                </Link>
              )}
              
              {rol === 'candidato' && (
                <Link 
                  href={userConfig.profileLink}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  Editar perfil
                </Link>
              )}
              
              <button
                type="button"
                className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
                onClick={async () => {
                  setIsMenuOpen(false);
                  await logout();
                  window.location.replace("/auth/login");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};