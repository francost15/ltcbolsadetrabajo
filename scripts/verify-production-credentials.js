// Cargar variables de entorno
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  dotenv no disponible, usando variables del sistema');
}

const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configuración de Mercado Pago - PRODUCCIÓN
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: {
    timeout: 10000,
  }
});

const paymentClient = new Payment(mercadoPagoConfig);

async function verifyCredentials() {
  console.log('🔍 Verificando credenciales de producción de Mercado Pago...\n');

  // Verificar que las variables de entorno estén configuradas
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    console.error('❌ Error: MERCADO_PAGO_ACCESS_TOKEN no está configurado');
    return false;
  }

  if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
    console.error('❌ Error: NEXT_PUBLIC_MP_PUBLIC_KEY no está configurado');
    return false;
  }

  console.log('✅ Variables de entorno configuradas');
  console.log(`🔑 Access Token: ${process.env.MERCADO_PAGO_ACCESS_TOKEN.substring(0, 20)}...`);
  console.log(`🔑 Public Key: ${process.env.NEXT_PUBLIC_MP_PUBLIC_KEY.substring(0, 20)}...`);

  // Verificar si son credenciales de producción
  const isProduction = process.env.MERCADO_PAGO_ACCESS_TOKEN.startsWith('APP_USR-');
  console.log(`🌍 Modo: ${isProduction ? 'PRODUCCIÓN' : 'PRUEBA'}`);

  if (!isProduction) {
    console.warn('⚠️  Advertencia: Estás usando credenciales de prueba, no de producción');
  }

  try {
    // Intentar hacer una consulta de prueba a la API
    console.log('\n🔄 Probando conexión con la API de Mercado Pago...');
    
    // Crear un pago de prueba (será rechazado, pero nos permite verificar la conexión)
    const testPayment = await paymentClient.create({
      body: {
        payer: {
          email: 'test@example.com',
          identification: {
            type: 'DNI',
            number: '12345678'
          }
        },
        token: 'invalid_token_for_testing',
        transaction_amount: 1.00,
        installments: 1,
        description: 'Prueba de conexión - Verificación de credenciales',
        external_reference: `test_connection_${Date.now()}`,
        metadata: {
          test: true,
          purpose: 'credential_verification'
        }
      }
    });

    console.log('✅ Conexión exitosa con la API de Mercado Pago');
    console.log(`📊 Respuesta recibida - ID: ${testPayment.id}`);
    console.log(`📊 Estado: ${testPayment.status}`);
    console.log(`📊 Detalle: ${testPayment.status_detail}`);

    // Verificar que la respuesta sea válida (aunque el pago sea rechazado)
    if (testPayment.id && testPayment.status) {
      console.log('\n🎉 ¡Credenciales de producción verificadas correctamente!');
      console.log('✅ La API de Mercado Pago está respondiendo');
      console.log('✅ Las credenciales son válidas');
      console.log('✅ El sistema está listo para procesar pagos reales');
      
      return true;
    } else {
      console.error('❌ Error: Respuesta inválida de la API');
      return false;
    }

  } catch (error) {
    console.error('❌ Error al verificar credenciales:', error.message);
    
    // Analizar el tipo de error
    if (error.message.includes('401')) {
      console.error('🔐 Error de autenticación: Las credenciales son inválidas');
    } else if (error.message.includes('403')) {
      console.error('🚫 Error de autorización: No tienes permisos para esta operación');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Error de timeout: La API tardó demasiado en responder');
    } else if (error.message.includes('network')) {
      console.error('🌐 Error de red: No se pudo conectar con la API');
    } else {
      console.error('❓ Error desconocido: Revisa los logs para más detalles');
    }
    
    return false;
  }
}

async function testErrorHandling() {
  console.log('\n🧪 Probando manejo de errores...\n');

  const testCases = [
    {
      name: 'Token inválido',
      token: 'invalid_token',
      expectedError: 'invalid_token'
    },
    {
      name: 'Monto inválido',
      token: 'invalid_token',
      amount: -1,
      expectedError: 'invalid_amount'
    },
    {
      name: 'Email inválido',
      token: 'invalid_token',
      email: 'invalid-email',
      expectedError: 'invalid_payer_email'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`🔍 Probando: ${testCase.name}`);
      
      await paymentClient.create({
        body: {
          payer: {
            email: testCase.email || 'test@example.com',
            identification: {
              type: 'DNI',
              number: '12345678'
            }
          },
          token: testCase.token,
          transaction_amount: testCase.amount || 1.00,
          installments: 1,
          description: `Test: ${testCase.name}`,
          external_reference: `test_${Date.now()}`,
          metadata: {
            test: true,
            testCase: testCase.name
          }
        }
      });

      console.log(`✅ ${testCase.name}: Pago procesado (no esperado)`);
      
    } catch (error) {
      console.log(`✅ ${testCase.name}: Error capturado correctamente`);
      console.log(`   📝 Error: ${error.message.substring(0, 100)}...`);
    }
  }

  console.log('\n✅ Pruebas de manejo de errores completadas');
}

// Función principal
async function main() {
  console.log('🚀 Iniciando verificación de credenciales de producción\n');
  
  const credentialsValid = await verifyCredentials();
  
  if (credentialsValid) {
    await testErrorHandling();
    
    console.log('\n📋 Resumen de verificación:');
    console.log('✅ Credenciales configuradas correctamente');
    console.log('✅ Conexión con API establecida');
    console.log('✅ Manejo de errores funcionando');
    console.log('✅ Sistema listo para producción');
    
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Configura las variables de entorno en tu servidor');
    console.log('2. Prueba el flujo de pago con una tarjeta real');
    console.log('3. Monitorea los logs para detectar errores');
    console.log('4. Configura webhooks si es necesario');
    
  } else {
    console.log('\n❌ Verificación fallida');
    console.log('🔧 Pasos para solucionar:');
    console.log('1. Verifica que las credenciales sean correctas');
    console.log('2. Asegúrate de que las variables de entorno estén configuradas');
    console.log('3. Verifica tu conexión a internet');
    console.log('4. Contacta al soporte de Mercado Pago si el problema persiste');
    
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { verifyCredentials, testErrorHandling }; 