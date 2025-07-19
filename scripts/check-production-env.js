console.log('🔍 Verificando variables de entorno en producción...\n');

const requiredEnvVars = {
  // Base de datos
  'DATABASE_URL': 'URL de conexión a PostgreSQL',
  
  // NextAuth
  'NEXTAUTH_URL': 'URL de la aplicación',
  'NEXTAUTH_SECRET': 'Clave secreta para NextAuth',
  
  // Mercado Pago
  'MP_ACCESS_TOKEN': 'Token de acceso de Mercado Pago',
  'NEXT_PUBLIC_MP_PUBLIC_KEY': 'Clave pública de Mercado Pago (frontend)',
  
  // API de Python
  'PYTHON_API_URL': 'URL de la API de Python para matching',
  
  // Email (opcional)
  'EMAIL_SERVER_HOST': 'Servidor de email (opcional)',
  'EMAIL_SERVER_PORT': 'Puerto de email (opcional)',
  'EMAIL_SERVER_USER': 'Usuario de email (opcional)',
  'EMAIL_SERVER_PASSWORD': 'Contraseña de email (opcional)',
  
  // Entorno
  'NODE_ENV': 'Entorno de ejecución'
};

const optionalEnvVars = {
  'EMAIL_SERVER_HOST': true,
  'EMAIL_SERVER_PORT': true,
  'EMAIL_SERVER_USER': true,
  'EMAIL_SERVER_PASSWORD': true
};

console.log('📋 Variables de entorno requeridas:');
console.log('─'.repeat(60));

let missingVars = [];
let presentVars = [];

for (const [varName, description] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  const isOptional = optionalEnvVars[varName];
  
  if (value) {
    // Ocultar valores sensibles
    const displayValue = varName.includes('SECRET') || varName.includes('TOKEN') || varName.includes('PASSWORD') 
      ? '***' + value.slice(-4) 
      : value;
    
    console.log(`✅ ${varName}: ${displayValue}`);
    presentVars.push(varName);
  } else if (isOptional) {
    console.log(`⚠️  ${varName}: No definida (opcional)`);
  } else {
    console.log(`❌ ${varName}: No definida`);
    missingVars.push(varName);
  }
}

console.log('\n📊 Resumen:');
console.log('─'.repeat(30));

if (missingVars.length === 0) {
  console.log('✅ Todas las variables requeridas están definidas');
} else {
  console.log(`❌ Faltan ${missingVars.length} variable(s) requerida(s):`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}: ${requiredEnvVars[varName]}`);
  });
}

console.log(`📈 Variables definidas: ${presentVars.length}/${Object.keys(requiredEnvVars).length}`);

// Verificaciones específicas
console.log('\n🔧 Verificaciones específicas:');
console.log('─'.repeat(30));

// Verificar DATABASE_URL
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    console.log('⚠️  DATABASE_URL apunta a localhost - verificar si es correcto para producción');
  } else {
    console.log('✅ DATABASE_URL apunta a servidor remoto');
  }
}

// Verificar NEXTAUTH_URL
if (process.env.NEXTAUTH_URL) {
  const authUrl = process.env.NEXTAUTH_URL;
  if (authUrl.includes('localhost') || authUrl.includes('127.0.0.1')) {
    console.log('⚠️  NEXTAUTH_URL apunta a localhost - verificar si es correcto para producción');
  } else {
    console.log('✅ NEXTAUTH_URL apunta a servidor remoto');
  }
}

// Verificar PYTHON_API_URL
if (process.env.PYTHON_API_URL) {
  const pythonUrl = process.env.PYTHON_API_URL;
  if (pythonUrl.includes('localhost') || pythonUrl.includes('127.0.0.1')) {
    console.log('⚠️  PYTHON_API_URL apunta a localhost - verificar si es correcto para producción');
  } else {
    console.log('✅ PYTHON_API_URL apunta a servidor remoto');
  }
}

// Verificar NODE_ENV
if (process.env.NODE_ENV === 'production') {
  console.log('✅ NODE_ENV está configurado para producción');
} else {
  console.log(`⚠️  NODE_ENV está configurado como: ${process.env.NODE_ENV || 'No definido'}`);
}

console.log('\n💡 Recomendaciones:');
console.log('─'.repeat(20));

if (missingVars.length > 0) {
  console.log('1. Definir todas las variables faltantes en el archivo .env');
  console.log('2. Reiniciar la aplicación después de agregar las variables');
}

if (process.env.NODE_ENV !== 'production') {
  console.log('3. Configurar NODE_ENV=production en producción');
}

console.log('4. Verificar que PYTHON_API_URL apunte al servidor correcto');
console.log('5. Asegurar que DATABASE_URL apunte a la base de datos de producción');
console.log('6. Verificar que las credenciales de Mercado Pago sean de producción');

console.log('\n🚀 Script completado'); 