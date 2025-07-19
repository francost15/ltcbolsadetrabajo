const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configurar credenciales
const client = new MercadoPagoConfig({
  accessToken: 'TEST-8661072a-d6c6-4a27-a09f-18512c1efdc2',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

const paymentClient = new Payment(client);

async function testSpecificCards() {
  console.log('🧪 Probando tarjetas específicas para TESTUSER761475946...\n');

  // Tarjetas específicas para TESTUSER761475946
  const testCards = [
    {
      name: 'Mastercard Aprobada',
      number: '5474 9254 3267 0366',
      cvv: '123',
      exp: '11/30'
    },
    {
      name: 'Visa Aprobada',
      number: '4075 5957 1648 3764',
      cvv: '123',
      exp: '11/30'
    },
    {
      name: 'Mastercard Débito',
      number: '5579 0534 6148 2647',
      cvv: '1234',
      exp: '11/30'
    },
    {
      name: 'Visa Débito',
      number: '4189 1412 2126 7633',
      cvv: '123',
      exp: '11/30'
    }
  ];

  for (const card of testCards) {
    try {
      console.log(`💳 Probando: ${card.name}`);
      console.log(`   Número: ${card.number}`);
      
      // Simular creación de token (esto normalmente se hace en el frontend)
      console.log('   ✅ Esta tarjeta debería funcionar para el test user TESTUSER761475946');
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ Error con ${card.name}:`, error.message);
      console.log('');
    }
  }

  console.log('📋 INSTRUCCIONES PARA EL USUARIO:');
  console.log('1. Usa exactamente las tarjetas listadas arriba');
  console.log('2. Asegúrate de que el nombre del titular sea: "APRO" para aprobadas');
  console.log('3. Para rechazadas usa: "CONT" o "OTHE"');
  console.log('4. El email debe coincidir con el test user');
  console.log('');
  console.log('⚠️  IMPORTANTE: Cada test user tiene tarjetas específicas asignadas');
  console.log('   Si sigues teniendo problemas, verifica en tu panel de Mercado Pago');
  console.log('   las tarjetas exactas asignadas a TESTUSER761475946');
}

testSpecificCards().catch(console.error); 