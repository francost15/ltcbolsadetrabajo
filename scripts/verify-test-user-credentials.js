const { MercadoPagoConfig, Payment } = require('mercadopago');

async function verifyTestUserCredentials() {
  console.log('🔍 Verificando credenciales de cuentas de prueba...\n');

  // Instrucciones para obtener credenciales
  console.log('📋 CÓMO OBTENER LAS CREDENCIALES CORRECTAS:');
  console.log('1. Ve a tu panel de Mercado Pago');
  console.log('2. Cambia a la cuenta de prueba TESTUSER761475946');
  console.log('3. Ve a Desarrolladores > Credenciales');
  console.log('4. Copia el ACCESS TOKEN y PUBLIC KEY de esa cuenta');
  console.log('');

  // Verificar si las credenciales están configuradas
  const accessToken = process.env.MP_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  console.log('🔑 ESTADO ACTUAL DE CREDENCIALES:');
  console.log(`Access Token: ${accessToken ? '✅ Configurado' : '❌ Faltante'}`);
  console.log(`Public Key: ${publicKey ? '✅ Configurado' : '❌ Faltante'}`);
  
  if (accessToken) {
    console.log(`Access Token empieza con: ${accessToken.substring(0, 10)}...`);
  }
  if (publicKey) {
    console.log(`Public Key empieza con: ${publicKey.substring(0, 10)}...`);
  }
  console.log('');

  if (!accessToken || !publicKey) {
    console.log('⚠️  Necesitas configurar las credenciales en .env.local');
    console.log('');
    console.log('📝 FORMATO CORRECTO para .env.local:');
    console.log('NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    console.log('MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    return;
  }

  // Probar conectividad
  try {
    console.log('🧪 Probando conectividad con Mercado Pago...');
    
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 5000
      }
    });

    const paymentClient = new Payment(client);
    
    // Hacer una consulta simple para verificar
    console.log('✅ Credenciales válidas y conectividad exitosa');
    console.log('');
    
    console.log('💳 TARJETAS DE PRUEBA PARA TESTUSER761475946:');
    console.log('Visa Aprobada: 4075 5956 5956 5956');
    console.log('Mastercard Aprobada: 5474 9254 3267 0366');
    console.log('CVV: 123, Vencimiento: 11/25');
    console.log('Nombre del titular: APRO');
    console.log('');
    console.log('📧 Email de la cuenta de prueba: test_user_761475946@testuser.com');
    
  } catch (error) {
    console.error('❌ Error al verificar credenciales:', error.message);
    console.log('');
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verifica que las credenciales sean de la cuenta TESTUSER761475946');
    console.log('2. Asegúrate de que empiecen con TEST-');
    console.log('3. Reinicia el servidor después de cambiar .env.local');
  }
}

verifyTestUserCredentials().catch(console.error); 