"use client"
import { useState } from 'react';
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
    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-800"
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
          "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg group",
          isRegister ? "text-white bg-blue-800 hover:bg-blue-900" : "text-blue-800 hover:text-blue-900"
        )}
      >
        {label}
        <FaChevronDown className={clsx("ml-2 h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 py-1 mt-2 w-48 bg-white rounded-md shadow-lg">
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

const MobileMenu = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-white md:hidden">
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <Image src="/logo.svg" alt="LTC Logo" width={120} height={40} className="w-auto h-8" />
        <button onClick={onClose} className="p-2 text-gray-600 hover:text-blue-800">
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">Iniciar Sesión</h3>
          <div className="space-y-2">
            <DropdownItem href="/auth/login" icon={IoBusiness}>Como Empresa</DropdownItem>
            <DropdownItem href="/404" icon={IoPerson}>Como Candidato</DropdownItem>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">Registrarse</h3>
          <div className="space-y-2">
            <DropdownItem href="/auth/register/company" icon={IoBusiness}>Como Empresa</DropdownItem>
            <DropdownItem href="/404" icon={IoPerson}>Como Candidato</DropdownItem>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const NavbarHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex gap-3 items-center">
            <Image src="/logo.svg" alt="LTC Logo" width={150} height={50} className="w-auto h-16" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-md">LTC Bolsa de Trabajo</h1>
              <p className="text-xs font-extralight text-gray-600">Por López Tamayo Consultores</p>
            </div>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <DesktopDropdown type="login" label="Iniciar Sesión" />
            <DesktopDropdown type="register" label="Registrarse" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-600 md:hidden hover:text-blue-800"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </nav>
  );
};
