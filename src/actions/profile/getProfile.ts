'use server'

import { auth } from '@/auth';
import { Profile } from '@/interfaces';
import prisma from '@/lib/prisma';

export async function getProfile(): Promise<Profile | null> {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }
  const usuario = await prisma.usuarios.findUnique({
    where: { email: session.user.email },
    include: {
      candidato: {
        include: {
          experiencias: true,
          educaciones: true,
          certificaciones: true,
          idiomas: true,
          preferencias: true,
        },
      },
    },
  });
  if (!usuario?.candidato) {
    console.log('No se encontro candidato para el usuario');
    return null;
  }
  const c = usuario.candidato;
  const profile: Profile = {
    id: c.id,
    nombre: c.nombre,
    email: usuario.email,
    curriculum: c.curriculum,
    ciudad: c.ciudad,
    estado: c.estado,
    pais: c.pais,
    disponibleReubicacion: c.disponibleReubicacion,
    linkedinUrl: c.linkedinUrl,
    portfolioUrl: c.portfolioUrl,
    resumenProfesional: c.resumenProfesional,
    tituloProfesional: c.tituloProfesional,
    telefono: c.telefono,
    salarioMinimo: c.salarioMinimo ? Number(c.salarioMinimo) : null,
    salarioMaximo: c.salarioMaximo ? Number(c.salarioMaximo) : null,
    monedaSalario: c.monedaSalario,
    experiencia: c.experiencias.map(e => ({
      id: e.id,
      cargo: e.cargo,
      empresa: e.empresa,
      fechaInicio: e.fechaInicio.toISOString(),
      fechaFin: e.fechaFin ? e.fechaFin.toISOString() : null,
      trabajoActual: e.trabajoActual,
      descripcion: e.descripcion,
    })),
    educacion: c.educaciones.map(e => ({
      id: e.id,
      institucion: e.institucion,
      titulo: e.titulo,
      campoEstudio: e.campoEstudio,
      fechaInicio: e.fechaInicio.toISOString(),
      fechaFin: e.fechaFin ? e.fechaFin.toISOString() : null,
    })),
    certificaciones: c.certificaciones.map(cert => ({
      id: cert.id,
      nombre: cert.nombre,
      entidadEmisora: cert.entidadEmisora,
      anioObtencion: cert.anioObtencion,
    })),
    idiomas: c.idiomas.map(idioma => ({
      id: idioma.id,
      nombre: idioma.nombre,
      nivel: idioma.nivel,
    })),
    preferencias: c.preferencias ? {
      id: c.preferencias.id,
      tiposEmpleo: c.preferencias.tiposEmpleo,
      modalidadesTrabajo: c.preferencias.modalidadesTrabajo,
      cargosInteres: c.preferencias.cargosInteres,
      industriasInteres: c.preferencias.industriasInteres,
    } : null,
  };
  return profile;
} 