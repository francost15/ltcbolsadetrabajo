"use client"
import Image from 'next/image'
import Link from 'next/link'
import { logout } from '@/actions';
import { useSession } from 'next-auth/react';
import { useMemo, useEffect, useState } from 'react';
import { RolUsuario } from '@/generated/prisma';
import { getCompanyByUserId } from '@/actions/company/getCompanyByUserId';



interface UserMenuConfig {
  profileLink: string;
  homeLink: string;
}

export const NavBar = () => {
  const { data: session } = useSession();
  const nombre = session?.user?.nombre || "Usuario";
  const rol = session?.user?.rol;
  const [companyId, setCompanyId] = useState<string | null>(null);

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
          <Link href={userConfig.homeLink} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Image 
              src="/logo.svg" 
              alt="LTC Project Logo" 
              width={54} 
              height={54} 
              priority
            />
          </Link>

          {/* Menú de usuario */}
          <div className="relative flex items-center gap-3 group">
            <span className="hidden text-sm font-medium text-gray-900 sm:block">
              {nombre}
            </span>
            
            <button
              type="button"
              className="flex items-center justify-center text-base font-bold text-gray-700 bg-gray-100 rounded-full w-9 h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors hover:bg-gray-200"
              aria-label="Abrir menú de usuario"
            >
              {nombre.charAt(0).toUpperCase()}
            </button>

            {/* Menú desplegable */}
            <div className="absolute right-0 z-20 invisible w-48 py-2 transition-all duration-150 ease-out scale-95 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 top-12 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100">
              {companyId && rol === 'empresa' && (
                <Link 
                  href={userConfig.profileLink}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Editar perfil
                </Link>
              )}
              
              {rol === 'candidato' && (
                <Link 
                  href={userConfig.profileLink}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Editar perfil
                </Link>
              )}
              
              <button
                type="button"
                className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-gray-50"
                onClick={async () => {
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