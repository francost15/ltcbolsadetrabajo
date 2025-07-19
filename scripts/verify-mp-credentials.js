const fs = require('fs');
const path = require('path');

// Cargar variables de entorno manualmente
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
          }
        }
      });
    }
  } catch (error) {
    console.log('No se pudo cargar .env.local');
  }
}

loadEnvFile();

async function verifyMercadoPagoCredentials() {
  console.log('🔍 Verificando credenciales de Mercado Pago...\n');

  // Verificar variables de entorno
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  console.log('📋 VARIABLES DE ENTORNO:');
  console.log(`✅ MERCADO_PAGO_ACCESS_TOKEN: ${accessToken ? 'Configurado' : '❌ NO CONFIGURADO'}`);
  console.log(`✅ NEXT_PUBLIC_MP_PUBLIC_KEY: ${publicKey ? 'Configurado' : '❌ NO CONFIGURADO'}`);

  if (accessToken) {
    console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`   Tipo: ${accessToken.startsWith('TEST-') ? 'PRUEBA ✅' : accessToken.startsWith('APP_USR-') ? 'PRODUCCIÓN ⚠️' : 'DESCONOCIDO ❌'}`);
  }

  if (publicKey) {
    console.log(`   Public Key: ${publicKey.substring(0, 20)}...`);
    console.log(`   Tipo: ${publicKey.startsWith('TEST-') ? 'PRUEBA ✅' : publicKey.startsWith('APP_USR-') ? 'PRODUCCIÓN ⚠️' : 'DESCONOCIDO ❌'}`);
  }

  if (!accessToken || !publicKey) {
    console.log('\n❌ CREDENCIALES FALTANTES:');
    console.log('Por favor, crea un archivo .env.local con:');
    console.log('MERCADO_PAGO_ACCESS_TOKEN="TEST-tu-access-token-aqui"');
    console.log('NEXT_PUBLIC_MP_PUBLIC_KEY="TEST-tu-public-key-aqui"');
    console.log('\nPuedes obtener estas credenciales en: https://www.mercadopago.com.mx/developers/');
    return;
  }

  // Verificar conectividad con Mercado Pago
  console.log('\n🌐 VERIFICANDO CONECTIVIDAD CON MERCADO PAGO:');
  
  try {
    // Probar endpoint de métodos de pago
    const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const paymentMethods = await response.json();
      console.log('✅ Conexión exitosa con Mercado Pago');
      console.log(`✅ Métodos de pago disponibles: ${paymentMethods.length}`);
      
      // Mostrar algunos métodos de pago disponibles
      const cardMethods = paymentMethods.filter(pm => pm.payment_type_id === 'credit_card').slice(0, 3);
      const ticketMethods = paymentMethods.filter(pm => pm.payment_type_id === 'ticket').slice(0, 3);
      
      console.log('\n💳 MÉTODOS DE PAGO DISPONIBLES:');
      console.log('Tarjetas de crédito:');
      cardMethods.forEach(method => {
        console.log(`  - ${method.name} (${method.id})`);
      });
      
      if (ticketMethods.length > 0) {
        console.log('Pagos en efectivo:');
        ticketMethods.forEach(method => {
          console.log(`  - ${method.name} (${method.id})`);
        });
      }

    } else {
      console.log('❌ Error de conectividad:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Detalles del error:', errorText);
    }

  } catch (error) {
    console.log('❌ Error al conectar con Mercado Pago:', error.message);
  }

  // Información sobre tarjetas de prueba
  console.log('\n🧪 TARJETAS DE PRUEBA PARA MÉXICO:');
  console.log('Visa (Aprobada):');
  console.log('  Número: 4509 9535 6623 3704');
  console.log('  CVV: 123');
  console.log('  Vencimiento: 11/25');
  console.log('  Titular: APRO');
  
  console.log('\nMastercard (Aprobada):');
  console.log('  Número: 5031 7557 3453 0604');
  console.log('  CVV: 123');
  console.log('  Vencimiento: 11/25');
  console.log('  Titular: APRO');

  console.log('\nVisa (Rechazada):');
  console.log('  Número: 4013 5406 8274 6260');
  console.log('  CVV: 123');
  console.log('  Vencimiento: 11/25');
  console.log('  Titular: REJECT');

  console.log('\n📚 DOCUMENTACIÓN ÚTIL:');
  console.log('- Panel de desarrolladores: https://www.mercadopago.com.mx/developers/');
  console.log('- Tarjetas de prueba: https://www.mercadopago.com.mx/developers/es/docs/testing/test-cards');
  console.log('- API Reference: https://www.mercadopago.com.mx/developers/es/reference');
}

verifyMercadoPagoCredentials().catch(console.error); 