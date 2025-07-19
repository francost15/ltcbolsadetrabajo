"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { IoBusiness, IoPerson } from 'react-icons/io5';
import clsx from 'clsx';

interface DropdownItemProps {
  href: string;
  icon: typeof IoBusiness | typeof IoPerson;
  children: React.ReactNode;
}

const DropdownItem = ({ href, icon: Icon, children }: DropdownItemProps) => (
  <Link 
    href={href} 
    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-800"
  >
    <Icon className="mr-2" size={20} />
    {children}
  </Link>
);

const DesktopDropdown = ({ type, label }: { type: 'login' | 'register', label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isRegister = type === 'register';
  const baseUrl = `/auth/${type}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isRegister ? "text-white bg-blue-800 hover:bg-blue-900" : "text-blue-800 hover:text-blue-900"
        )}
      >
        {label}
        <FaChevronDown className={clsx("ml-2 h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 py-2 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <DropdownItem href={isRegister ? `${baseUrl}/company` : baseUrl} icon={IoBusiness}>
            Como Empresa
          </DropdownItem>
          <DropdownItem href={isRegister ? `${baseUrl}/candidate` : baseUrl} icon={IoPerson}>
            Como Candidato
          </DropdownItem>
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-white">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="LTC Logo" width={32} height={32} className="w-8 h-8" />
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">LTC Bolsa de Trabajo</h1>
              <p className="text-[10px] text-gray-500">Por López Tamayo Consultores</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="mb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Iniciar Sesión</h3>
            <div className="space-y-2">
              <Link 
                href="/auth/login" 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <IoBusiness className="mr-3 w-5 h-5 text-gray-400" />
                Iniciar Sesión
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Registrarse</h3>
            <div className="space-y-2">
              <Link 
                href="/auth/register/company" 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <IoBusiness className="mr-3 w-5 h-5 text-gray-400" />
                Como Empresa
              </Link>
              <Link 
                href="/auth/register/candidate" 
                className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <IoPerson className="mr-3 w-5 h-5 text-gray-400" />
                Como Candidato
              </Link>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            © {new Date().getFullYear()} LTC Bolsa de Trabajo
          </p>
        </div>
      </div>
    </div>
  );
};

export const NavbarHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={clsx(
      "fixed top-0 right-0 left-0 z-50 transition-colors duration-200",
      isMenuOpen ? "bg-white" : "bg-white/95 backdrop-blur-sm"
    )}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20 border-b border-gray-100">
          <Link href="/" className="flex gap-3 items-center">
            <Image 
              src="/logo.svg" 
              alt="LTC Logo" 
              width={150} 
              height={50} 
              className={clsx(
                "w-auto transition-all duration-200",
                isMenuOpen ? "h-8 md:h-16" : "h-8 md:h-16"
              )} 
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-md">LTC Bolsa de Trabajo</h1>
              <p className="text-xs font-extralight text-gray-600">Por López Tamayo Consultores</p>
            </div>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-800 hover:text-blue-900 transition-all duration-200"
            >
              Iniciar Sesión
            </Link>
            <DesktopDropdown type="register" label="Registrarse" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </nav>
  );
};
