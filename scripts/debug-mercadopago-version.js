const { MercadoPagoConfig, Payment } = require('mercadopago');

console.log('🔍 DIAGNÓSTICO DE VERSIÓN DE MERCADO PAGO\n');

// Verificar la versión instalada
try {
  const packageJson = require('../package.json');
  const mercadopagoVersion = packageJson.dependencies.mercadopago;
  console.log(`📦 Versión de mercadopago en package.json: ${mercadopagoVersion}`);
} catch (error) {
  console.log('❌ No se pudo leer package.json');
}

// Verificar si las clases están disponibles
console.log('\n🔧 VERIFICANDO CLASES DISPONIBLES:');
console.log(`MercadoPagoConfig: ${typeof MercadoPagoConfig}`);
console.log(`Payment: ${typeof Payment}`);

// Verificar si v2 está disponible
console.log('\n🔍 VERIFICANDO API v2:');
if (typeof MercadoPagoConfig === 'function') {
  console.log('✅ MercadoPagoConfig es una función');
  
  // Intentar crear una instancia
  try {
    const config = new MercadoPagoConfig({
      accessToken: 'TEST-token-for-diagnostic'
    });
    console.log('✅ Instancia de MercadoPagoConfig creada exitosamente');
    console.log('Config object:', config);
    
    // Verificar si tiene propiedades v2
    if (config.v2) {
      console.log('✅ Config tiene propiedad v2');
      console.log('v2 properties:', Object.keys(config.v2));
      
      if (typeof config.v2.config === 'function') {
        console.log('✅ config.v2.config es una función');
      } else {
        console.log('❌ config.v2.config NO es una función');
        console.log('Tipo de config.v2.config:', typeof config.v2.config);
      }
    } else {
      console.log('❌ Config NO tiene propiedad v2');
    }
    
  } catch (error) {
    console.log('❌ Error al crear instancia:', error.message);
  }
} else {
  console.log('❌ MercadoPagoConfig NO es una función');
}

// Verificar la estructura del módulo
console.log('\n📋 ESTRUCTURA DEL MÓDULO:');
const mercadopagoModule = require('mercadopago');
console.log('Propiedades del módulo:', Object.keys(mercadopagoModule));

// Verificar si hay exportaciones por defecto
if (mercadopagoModule.default) {
  console.log('✅ Módulo tiene exportación por defecto');
  console.log('Propiedades del default:', Object.keys(mercadopagoModule.default));
}

console.log('\n🔧 RECOMENDACIONES:');
console.log('1. Si config.v2.config no es una función, actualiza a la última versión:');
console.log('   npm install mercadopago@latest');
console.log('2. Verifica que no haya conflictos de versiones');
console.log('3. Limpia node_modules y reinstala:');
console.log('   rm -rf node_modules package-lock.json && npm install'); 