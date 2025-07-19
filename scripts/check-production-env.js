const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de producción...\n');

// Verificar archivos de entorno
const envFiles = ['.env', '.env.local', '.env.production'];
let envFound = false;

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
    envFound = true;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      const hasAccessToken = lines.some(line => line.includes('MERCADO_PAGO_ACCESS_TOKEN'));
      const hasPublicKey = lines.some(line => line.includes('NEXT_PUBLIC_MP_PUBLIC_KEY'));
      
      console.log(`   🔑 MERCADO_PAGO_ACCESS_TOKEN: ${hasAccessToken ? '✅' : '❌'}`);
      console.log(`   🔑 NEXT_PUBLIC_MP_PUBLIC_KEY: ${hasPublicKey ? '✅' : '❌'}`);
      
      if (hasAccessToken) {
        const accessTokenLine = lines.find(line => line.includes('MERCADO_PAGO_ACCESS_TOKEN'));
        const token = accessTokenLine.split('=')[1]?.replace(/['"]/g, '');
        if (token) {
          console.log(`   📋 Token: ${token.substring(0, 20)}...`);
          console.log(`   🌍 Tipo: ${token.startsWith('APP_USR-') ? 'PRODUCCIÓN' : token.startsWith('TEST-') ? 'PRUEBA' : 'DESCONOCIDO'}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error leyendo ${file}:`, error.message);
    }
  } else {
    console.log(`❌ ${file} no existe`);
  }
});

// Verificar variables del sistema
console.log('\n🔧 Variables del sistema:');
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

console.log(`🔑 MERCADO_PAGO_ACCESS_TOKEN: ${accessToken ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`🔑 NEXT_PUBLIC_MP_PUBLIC_KEY: ${publicKey ? '✅ Configurado' : '❌ No configurado'}`);

if (accessToken) {
  console.log(`   📋 Token: ${accessToken.substring(0, 20)}...`);
  console.log(`   🌍 Tipo: ${accessToken.startsWith('APP_USR-') ? 'PRODUCCIÓN' : accessToken.startsWith('TEST-') ? 'PRUEBA' : 'DESCONOCIDO'}`);
}

if (publicKey) {
  console.log(`   📋 Public Key: ${publicKey.substring(0, 20)}...`);
  console.log(`   🌍 Tipo: ${publicKey.startsWith('APP_USR-') ? 'PRODUCCIÓN' : publicKey.startsWith('TEST-') ? 'PRUEBA' : 'DESCONOCIDO'}`);
}

// Resumen
console.log('\n📊 RESUMEN:');
if (accessToken && publicKey) {
  console.log('✅ Configuración completa - Mercado Pago debería funcionar');
} else if (accessToken || publicKey) {
  console.log('⚠️  Configuración parcial - Falta una variable');
} else {
  console.log('❌ Configuración faltante - Mercado Pago no funcionará');
}

if (!envFound && !accessToken && !publicKey) {
  console.log('\n🔧 SOLUCIÓN:');
  console.log('1. Crear archivo .env en la raíz del proyecto:');
  console.log(`
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df
  `);
  console.log('2. O configurar variables del sistema:');
  console.log('   export MERCADO_PAGO_ACCESS_TOKEN="APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755"');
  console.log('   export NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df"');
  console.log('3. Reiniciar PM2: pm2 restart ltcbolsa');
} 