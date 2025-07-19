// Cargar variables de entorno
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  dotenv no disponible, usando variables del sistema');
}

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE NEXTAUTH\n');

// Verificar variables críticas
const nextAuthUrl = process.env.NEXTAUTH_URL;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

console.log('📋 VARIABLES DE ENTORNO:');
console.log(`NEXTAUTH_URL: ${nextAuthUrl ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
console.log(`NEXTAUTH_SECRET: ${nextAuthSecret ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);

if (nextAuthUrl) {
  console.log(`   URL: ${nextAuthUrl}`);
  
  // Verificar si es la URL correcta
  if (nextAuthUrl.includes('ltcbolsadetrabajo.com')) {
    console.log('✅ URL correcta - usando dominio principal');
  } else if (nextAuthUrl.includes('localhost')) {
    console.log('⚠️  URL de desarrollo - usando localhost');
  } else {
    console.log('❌ URL incorrecta - no coincide con el dominio esperado');
  }
} else {
  console.log('\n❌ PROBLEMA: NEXTAUTH_URL no está configurado');
  console.log('Esto puede causar redirecciones a IPs incorrectas');
}

if (!nextAuthSecret) {
  console.log('\n❌ PROBLEMA: NEXTAUTH_SECRET no está configurado');
  console.log('Esto puede causar problemas de seguridad');
}

console.log('\n🔧 SOLUCIÓN:');
console.log('Asegúrate de que tu archivo .env.local contenga:');
console.log('');
console.log('NEXTAUTH_URL=https://ltcbolsadetrabajo.com');
console.log('NEXTAUTH_SECRET=tu-secret-super-seguro-aqui');
console.log('');

// Verificar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌍 Entorno: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);

if (isProduction && (!nextAuthUrl || !nextAuthUrl.includes('ltcbolsadetrabajo.com'))) {
  console.log('\n🚨 ADVERTENCIA CRÍTICA:');
  console.log('En producción, NEXTAUTH_URL debe apuntar a tu dominio real');
  console.log('Esto está causando las redirecciones incorrectas');
}

console.log('\n✅ VERIFICACIÓN COMPLETA'); 