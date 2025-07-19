const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Mercado Pago...\n');

// Verificar si existe el archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📁 Archivo .env.local existe: ${envExists ? '✅ SÍ' : '❌ NO'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 Contenido del archivo .env.local:');
  console.log('='.repeat(50));
  console.log(envContent);
  console.log('='.repeat(50));
  
  // Verificar variables específicas
  const hasAccessToken = envContent.includes('MERCADO_PAGO_ACCESS_TOKEN');
  const hasPublicKey = envContent.includes('NEXT_PUBLIC_MP_PUBLIC_KEY');
  
  console.log(`\n🔑 MERCADO_PAGO_ACCESS_TOKEN: ${hasAccessToken ? '✅ CONFIGURADA' : '❌ FALTANTE'}`);
  console.log(`🔑 NEXT_PUBLIC_MP_PUBLIC_KEY: ${hasPublicKey ? '✅ CONFIGURADA' : '❌ FALTANTE'}`);
  
  if (hasAccessToken && hasPublicKey) {
    console.log('\n🎉 Configuración básica correcta');
    console.log('💡 Ahora puedes ejecutar: npm run verify-mp');
  } else {
    console.log('\n❌ Faltan variables de entorno');
    console.log('\n📝 Asegúrate de que tu .env.local contenga:');
    console.log(`
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df
    `);
  }
} else {
  console.log('\n❌ No se encontró el archivo .env.local');
  console.log('📁 Ubicación esperada:', envPath);
  console.log('\n📝 Crea el archivo .env.local con:');
  console.log(`
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df
DATABASE_URL=postgresql://usuario:password@localhost:5432/ltc_project
NEXTAUTH_SECRET=tu-secret-aqui
  `);
} 