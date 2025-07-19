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

// Nueva función para verificar si el perfil está completo para matching
export async function checkProfileCompleteness() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        isComplete: false,
        missingFields: ['Autenticación requerida'],
        hasCV: false,
        hasExperience: false,
        hasEducation: false,
        hasBasicInfo: false
      };
    }

    const candidato = await prisma.candidatos.findUnique({
      where: { usuarioId: session.user.id },
      include: {
        experiencias: true,
        educaciones: true,
      }
    });

    if (!candidato) {
      return {
        isComplete: false,
        missingFields: ['Perfil de candidato no encontrado'],
        hasCV: false,
        hasExperience: false,
        hasEducation: false,
        hasBasicInfo: false
      };
    }

    const missingFields: string[] = [];

    // Verificar campos esenciales para matching
    if (!candidato.curriculum) {
      missingFields.push('CV/Currículum');
    }

    if (!candidato.nombre || candidato.nombre.trim() === '') {
      missingFields.push('Nombre completo');
    }

    if (!candidato.tituloProfesional || candidato.tituloProfesional.trim() === '') {
      missingFields.push('Título profesional');
    }

    if (!candidato.resumenProfesional || candidato.resumenProfesional.trim() === '') {
      missingFields.push('Resumen profesional');
    }

    if (candidato.experiencias.length === 0) {
      missingFields.push('Al menos una experiencia laboral');
    }

    if (candidato.educaciones.length === 0) {
      missingFields.push('Información educativa');
    }

    if (!candidato.ciudad || candidato.ciudad.trim() === '') {
      missingFields.push('Ciudad de residencia');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      hasCV: !!candidato.curriculum,
      hasExperience: candidato.experiencias.length > 0,
      hasEducation: candidato.educaciones.length > 0,
      hasBasicInfo: !!(candidato.nombre && candidato.tituloProfesional && candidato.resumenProfesional)
    };

  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return {
      isComplete: false,
      missingFields: ['Error al verificar el perfil'],
      hasCV: false,
      hasExperience: false,
      hasEducation: false,
      hasBasicInfo: false
    };
  }
}

// Nueva función para que las empresas obtengan el perfil de cualquier candidato
export async function getCandidateProfile(candidateId: string): Promise<Profile | null> {
  try {
    const candidato = await prisma.candidatos.findUnique({
      where: { id: candidateId },
      include: {
        usuario: {
          select: {
            email: true
          }
        },
        experiencias: {
          orderBy: {
            fechaInicio: 'desc'
          }
        },
        educaciones: {
          orderBy: {
            fechaInicio: 'desc'
          }
        },
        certificaciones: {
          orderBy: {
            anioObtencion: 'desc'
          }
        },
        idiomas: true,
        preferencias: true,
      },
    });

    if (!candidato) {
      console.log('Candidato no encontrado para ID:', candidateId);
      return null;
    }

    const profile: Profile = {
      id: candidato.id,
      nombre: candidato.nombre,
      email: candidato.usuario.email,
      curriculum: candidato.curriculum,
      ciudad: candidato.ciudad,
      estado: candidato.estado,
      pais: candidato.pais,
      disponibleReubicacion: candidato.disponibleReubicacion,
      linkedinUrl: candidato.linkedinUrl,
      portfolioUrl: candidato.portfolioUrl,
      resumenProfesional: candidato.resumenProfesional,
      tituloProfesional: candidato.tituloProfesional,
      telefono: candidato.telefono,
      salarioMinimo: candidato.salarioMinimo ? Number(candidato.salarioMinimo) : null,
      salarioMaximo: candidato.salarioMaximo ? Number(candidato.salarioMaximo) : null,
      monedaSalario: candidato.monedaSalario,
      experiencia: candidato.experiencias.map(e => ({
        id: e.id,
        cargo: e.cargo,
        empresa: e.empresa,
        fechaInicio: e.fechaInicio.toISOString(),
        fechaFin: e.fechaFin ? e.fechaFin.toISOString() : null,
        trabajoActual: e.trabajoActual,
        descripcion: e.descripcion,
      })),
      educacion: candidato.educaciones.map(e => ({
        id: e.id,
        institucion: e.institucion,
        titulo: e.titulo,
        campoEstudio: e.campoEstudio,
        fechaInicio: e.fechaInicio.toISOString(),
        fechaFin: e.fechaFin ? e.fechaFin.toISOString() : null,
      })),
      certificaciones: candidato.certificaciones.map(cert => ({
        id: cert.id,
        nombre: cert.nombre,
        entidadEmisora: cert.entidadEmisora,
        anioObtencion: cert.anioObtencion,
      })),
      idiomas: candidato.idiomas.map(idioma => ({
        id: idioma.id,
        nombre: idioma.nombre,
        nivel: idioma.nivel,
      })),
      preferencias: candidato.preferencias ? {
        id: candidato.preferencias.id,
        tiposEmpleo: candidato.preferencias.tiposEmpleo,
        modalidadesTrabajo: candidato.preferencias.modalidadesTrabajo,
        cargosInteres: candidato.preferencias.cargosInteres,
        industriasInteres: candidato.preferencias.industriasInteres,
      } : null,
    };

    return profile;
  } catch (error) {
    console.error('Error getting candidate profile:', error);
    return null;
  }
} 