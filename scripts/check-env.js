require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verificando variables de entorno...\n');

const requiredVars = [
  'MERCADO_PAGO_ACCESS_TOKEN',
  'NEXT_PUBLIC_MP_PUBLIC_KEY',
  'DATABASE_URL',
  'NEXTAUTH_SECRET'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Todas las variables están configuradas correctamente');
} else {
  console.log('❌ Faltan variables de entorno');
  console.log('\n📝 Asegúrate de tener un archivo .env.local con:');
  console.log(`
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df
DATABASE_URL=postgresql://usuario:password@localhost:5432/ltc_project
NEXTAUTH_SECRET=tu-secret-aqui
  `);
}

console.log('\n📁 Ubicación del archivo .env.local:', require('path').resolve('.env.local')); 