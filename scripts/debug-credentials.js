const fs = require('fs');
const path = require('path');

// Cargar variables de entorno manualmente
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      console.log('📄 Contenido del archivo .env.local:');
      console.log('----------------------------------------');
      
      const lines = envContent.split('\n');
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          if (trimmedLine.startsWith('#')) {
            console.log(`${index + 1}: ${trimmedLine} (comentario)`);
                     } else if (trimmedLine.includes('MERCADO_PAGO') || trimmedLine.includes('NEXT_PUBLIC_MP')) {
             const [key, ...valueParts] = trimmedLine.split('=');
             if (key && valueParts.length > 0) {
               const value = valueParts.join('=').replace(/^["']|["']$/g, '');
               console.log(`${index + 1}: ${key}=${value.substring(0, 20)}... (${value.length} caracteres)`);
               process.env[key.trim()] = value;
             }
           } else {
            console.log(`${index + 1}: ${line} (otra variable)`);
          }
        }
      });
      console.log('----------------------------------------\n');
    } else {
      console.log('❌ Archivo .env.local NO ENCONTRADO\n');
    }
  } catch (error) {
    console.log('❌ Error al leer .env.local:', error.message);
  }
}

async function debugCredentials() {
  console.log('🔍 DEBUG DETALLADO DE CREDENCIALES\n');
  
  loadEnvFile();

  // Verificar variables de entorno después de cargar
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  console.log('🔑 CREDENCIALES CARGADAS:');
  console.log(`Access Token: ${accessToken ? 'PRESENTE' : 'AUSENTE'}`);
  console.log(`Public Key: ${publicKey ? 'PRESENTE' : 'AUSENTE'}`);

  if (accessToken) {
    console.log(`\n📋 ANÁLISIS ACCESS TOKEN:`);
    console.log(`Longitud: ${accessToken.length} caracteres`);
    console.log(`Prefijo: ${accessToken.substring(0, 10)}...`);
    console.log(`Tipo: ${accessToken.startsWith('TEST-') ? 'PRUEBA ✅' : accessToken.startsWith('APP_USR-') ? 'PRODUCCIÓN ⚠️' : 'FORMATO DESCONOCIDO ❌'}`);
    
    // Probar el token directamente
    console.log(`\n🧪 PROBANDO ACCESS TOKEN:`);
    
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ Access Token VÁLIDO');
      } else {
        console.log('❌ Access Token INVÁLIDO');
        const errorText = await response.text();
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.log('❌ Error al probar token:', error.message);
    }

    // Probar con el endpoint de orders que usamos en la aplicación
    console.log(`\n🔄 PROBANDO ENDPOINT DE ORDERS (usado en la app):`);
    
    try {
      const testOrderData = {
        type: "online",
        external_reference: "test_ref_123",
        processing_mode: "automatic",
        total_amount: "100.00",
        payer: {
          email: "test@test.com",
          entity_type: "individual",
          first_name: "Test",
          last_name: "User"
        },
        transactions: {
          payments: [
            {
              amount: "100.00",
              payment_method: {
                id: "visa",
                type: "credit_card",
                token: "test_token_123",
                installments: 1
              }
            }
          ]
        },
        description: "Test payment",
        marketplace: "NONE"
      };

      const orderResponse = await fetch('https://api.mercadopago.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `test_${Date.now()}`
        },
        body: JSON.stringify(testOrderData)
      });

      console.log(`Orders endpoint status: ${orderResponse.status} ${orderResponse.statusText}`);
      
      if (orderResponse.status === 401) {
        console.log('❌ Error 401 en Orders - Token inválido o sin permisos');
      } else if (orderResponse.status === 400) {
        console.log('⚠️ Error 400 en Orders - Token válido pero datos inválidos (esperado para este test)');
      } else {
        console.log('✅ Orders endpoint accesible');
      }
      
      const orderErrorText = await orderResponse.text();
      console.log('Respuesta:', orderErrorText.substring(0, 200) + '...');

    } catch (error) {
      console.log('❌ Error al probar orders:', error.message);
    }
  }

  if (publicKey) {
    console.log(`\n📋 ANÁLISIS PUBLIC KEY:`);
    console.log(`Longitud: ${publicKey.length} caracteres`);
    console.log(`Prefijo: ${publicKey.substring(0, 10)}...`);
    console.log(`Tipo: ${publicKey.startsWith('TEST-') ? 'PRUEBA ✅' : publicKey.startsWith('APP_USR-') ? 'PRODUCCIÓN ⚠️' : 'FORMATO DESCONOCIDO ❌'}`);
  }

  console.log(`\n💡 RECOMENDACIONES:`);
  console.log(`1. Verifica que ambas credenciales sean del mismo tipo (TEST- o APP_USR-)`);
  console.log(`2. Asegúrate de estar usando credenciales de PRUEBA para testing`);
  console.log(`3. Ve a https://www.mercadopago.com.mx/developers/ para verificar tus credenciales`);
  console.log(`4. Verifica que la aplicación tenga permisos para crear órdenes`);
}

debugCredentials().catch(console.error); 