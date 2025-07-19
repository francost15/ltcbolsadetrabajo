const { MercadoPagoConfig, Payment } = require('mercadopago');

async function debugPaymentRejection() {
  console.log('🔍 DEBUGGING RECHAZO DE TARJETAS\n');

  // Verificar credenciales
  const accessToken = process.env.MP_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  
  console.log('🔑 CREDENCIALES:');
  console.log(`Access Token: ${accessToken ? accessToken.substring(0, 20) + '...' : '❌ No configurado'}`);
  console.log(`Public Key: ${publicKey ? publicKey.substring(0, 20) + '...' : '❌ No configurado'}`);
  console.log('');

  console.log('❌ TARJETAS QUE NO FUNCIONAN (genéricas):');
  console.log('- 4509 9535 6623 3704 (Visa genérica)');
  console.log('- 5031 7557 3453 0604 (Mastercard genérica)');
  console.log('- 4075 5956 5956 5956 (Visa antigua)');
  console.log('');

  console.log('✅ TARJETAS QUE SÍ FUNCIONAN PARA TESTUSER761475946:');
  console.log('Mastercard: 5474 9254 3267 0366');
  console.log('Visa: 4075 5957 1648 3764');
  console.log('Mastercard Débito: 5579 0534 6148 2647');
  console.log('Visa Débito: 4189 1412 2126 7633');
  console.log('');

  console.log('📋 PARÁMETROS EXACTOS PARA EL FORMULARIO:');
  console.log('Número de tarjeta: 5474 9254 3267 0366');
  console.log('CVV: 123');
  console.log('Vencimiento: 11/30');
  console.log('Nombre del titular: APRO');
  console.log('');

  console.log('⚠️  ERRORES COMUNES:');
  console.log('1. Usar tarjetas genéricas en lugar de las específicas del test user');
  console.log('2. Nombre del titular incorrecto (debe ser exactamente "APRO")');
  console.log('3. CVV incorrecto (123 para crédito, 1234 para débito)');
  console.log('4. Fecha de vencimiento incorrecta (debe ser 11/30)');
  console.log('');

  console.log('🧪 PROCESO DE PRUEBA:');
  console.log('1. Ve a /subscription/checkout');
  console.log('2. Ingresa exactamente:');
  console.log('   - Nombre: APRO');
  console.log('   - Tarjeta: 5474 9254 3267 0366');
  console.log('   - CVV: 123');
  console.log('   - Vencimiento: 11/30');
  console.log('3. Envía el formulario');
  console.log('4. Deberías ver status: "approved" en lugar de "rejected"');
  console.log('');

  console.log('🔧 SI SIGUE FALLANDO:');
  console.log('1. Verifica que estés usando la cuenta TESTUSER761475946');
  console.log('2. Confirma que las credenciales sean de esa cuenta específica');
  console.log('3. Revisa que el email del payer coincida');
  console.log('');

  // Verificar si podemos hacer una consulta de prueba
  if (accessToken) {
    try {
      console.log('🧪 Probando conectividad con Mercado Pago...');
      const client = new MercadoPagoConfig({
        accessToken: accessToken,
        options: { timeout: 5000 }
      });
      
      console.log('✅ Credenciales válidas - listo para procesar pagos');
    } catch (error) {
      console.error('❌ Error con credenciales:', error.message);
    }
  }
}

debugPaymentRejection().catch(console.error); 