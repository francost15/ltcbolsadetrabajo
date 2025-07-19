const https = require('https');
const http = require('http');

// Configuración de la API de Python
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

console.log('🔍 Verificando conectividad con API de Python...');
console.log('📍 URL:', PYTHON_API_URL);

function checkConnectivity() {
  return new Promise((resolve, reject) => {
    const url = new URL(PYTHON_API_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'LTC-Health-Check/1.0'
      }
    }, (res) => {
      console.log(`✅ API de Python responde - Status: ${res.statusCode}`);
      resolve({
        ok: true,
        status: res.statusCode,
        message: 'API de Python está funcionando correctamente'
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error conectando con API de Python:', error.message);
      resolve({
        ok: false,
        error: error.message,
        message: 'API de Python no está disponible'
      });
    });

    req.on('timeout', () => {
      console.error('⏰ Timeout conectando con API de Python');
      req.destroy();
      resolve({
        ok: false,
        error: 'timeout',
        message: 'Timeout al conectar con API de Python'
      });
    });

    req.end();
  });
}

async function main() {
  try {
    console.log('🚀 Iniciando verificación de API de Python...\n');
    
    const result = await checkConnectivity();
    
    console.log('\n📊 Resultado de la verificación:');
    console.log('─'.repeat(50));
    
    if (result.ok) {
      console.log('✅ Estado: CONECTADO');
      console.log(`📡 Status Code: ${result.status}`);
      console.log(`💬 Mensaje: ${result.message}`);
    } else {
      console.log('❌ Estado: DESCONECTADO');
      console.log(`🔍 Error: ${result.error}`);
      console.log(`💬 Mensaje: ${result.message}`);
      
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verificar que la API de Python esté ejecutándose');
      console.log('2. Verificar la variable de entorno PYTHON_API_URL');
      console.log('3. Verificar firewall y configuración de red');
      console.log('4. Verificar que el puerto esté abierto y accesible');
    }
    
    console.log('\n📋 Variables de entorno relacionadas:');
    console.log(`PYTHON_API_URL: ${process.env.PYTHON_API_URL || 'No definida'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'No definida'}`);
    
  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
  }
}

main(); 