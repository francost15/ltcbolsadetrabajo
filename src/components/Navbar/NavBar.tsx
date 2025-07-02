"use client"
import Image from 'next/image'
import Link from 'next/link'
import { getCompanyByUserId, logout } from '@/actions';
import { useSession } from 'next-auth/react';
import { useMemo, useEffect, useState } from 'react';
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
          <Link href={userConfig.homeLink} className="flex gap-3 items-center">
            <Image src="/logo.svg" alt="LTC Logo" width={150} height={50} className="w-auto h-16" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-md">LTC Bolsa de Trabajo</h1>
              <p className="text-xs font-extralight text-gray-600">Por López Tamayo Consultores</p>
            </div>
          </Link>

          {/* Enlace a perfil de usuario */}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-gray-900 sm:block">
              {nombre}
            </span>
            
            <Link
              href={userConfig.profileLink}
              className="flex items-center justify-center text-base font-bold text-gray-700 bg-gray-100 rounded-full min-w-11 min-h-11 w-11 h-11 transition-colors hover:bg-gray-200 active:bg-gray-300 cursor-pointer touch-manipulation select-none"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              aria-label="Ir a mi perfil"
            >
              {nombre.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};