const fs = require('fs');
const path = require('path');

async function setupServer() {
  console.log('🚀 CONFIGURACIÓN COMPLETA DEL SERVIDOR MERCADO PAGO\n');

  // Verificar estado actual
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);

  console.log('📋 ESTADO ACTUAL:');
  console.log(`Archivo .env.local: ${envExists ? '✅ Existe' : '❌ No existe'}`);

  if (envExists) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const hasPublicKey = envContent.includes('NEXT_PUBLIC_MP_PUBLIC_KEY');
      const hasAccessToken = envContent.includes('MP_ACCESS_TOKEN');
      
      console.log(`NEXT_PUBLIC_MP_PUBLIC_KEY: ${hasPublicKey ? '✅ Configurado' : '❌ Faltante'}`);
      console.log(`MP_ACCESS_TOKEN: ${hasAccessToken ? '✅ Configurado' : '❌ Faltante'}`);
    } catch (error) {
      console.log('❌ Error leyendo .env.local');
    }
  }

  console.log('\n🔑 PASOS PARA OBTENER CREDENCIALES:');
  console.log('1. Ve a: https://www.mercadopago.com.mx/developers/panel');
  console.log('2. Inicia sesión con tu cuenta principal');
  console.log('3. Ve a la sección "Cuentas de prueba"');
  console.log('4. Selecciona la cuenta: TESTUSER761475946');
  console.log('5. Ve a "Credenciales" > "Credenciales de prueba"');
  console.log('6. Copia el ACCESS TOKEN y PUBLIC KEY');

  console.log('\n📝 TEMPLATE PARA .env.local:');
  console.log('# Copia estas líneas y reemplaza con tus credenciales reales');
  console.log('NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  console.log('MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  console.log('');
  console.log('# Variables adicionales (mantener como están)');
  console.log('DATABASE_URL="postgresql://postgres:password@localhost:5432/ltc_db"');
  console.log('NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui');
  console.log('NEXTAUTH_URL=http://localhost:3000');

  // Crear archivo base si no existe
  if (!envExists) {
    console.log('\n🔨 Creando archivo .env.local base...');
    
    const envTemplate = `# Variables de entorno para Mercado Pago
# REEMPLAZA con las credenciales reales de TESTUSER761475946
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/ltc_db"

# NextAuth
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui
NEXTAUTH_URL=http://localhost:3000
`;

    try {
      fs.writeFileSync(envPath, envTemplate);
      console.log('✅ Archivo .env.local creado exitosamente');
      console.log('📝 Ahora edita el archivo y reemplaza las credenciales');
    } catch (error) {
      console.error('❌ Error creando .env.local:', error.message);
    }
  }

  console.log('\n💳 TARJETAS DE PRUEBA PARA TESTUSER761475946:');
  console.log('Mastercard: 5474 9254 3267 0366 | CVV: 123 | Exp: 11/30');
  console.log('Visa: 4075 5957 1648 3764 | CVV: 123 | Exp: 11/30');
  console.log('Nombre del titular: APRO');

  console.log('\n🚀 COMANDOS FINALES:');
  console.log('1. Edita .env.local con las credenciales reales');
  console.log('2. npm run dev (para reiniciar el servidor)');
  console.log('3. Ve a /subscription/checkout');
  console.log('4. Prueba con las tarjetas de arriba');

  console.log('\n✅ ¡Configuración lista! Solo falta actualizar las credenciales.');
}

setupServer().catch(console.error); 