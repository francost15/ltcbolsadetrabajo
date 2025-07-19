const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSubscriptionPlan() {
  try {
    console.log('🔧 Inicializando plan de suscripción anual...');
    
    // Verificar si ya existe el plan
    const existingPlan = await prisma.planes.findFirst({
      where: {
        nombre: 'PLAN_ANUAL_365'
      }
    });

    if (existingPlan) {
      console.log('✅ Plan anual ya existe:', existingPlan.nombre);
      return;
    }

    // Crear el plan anual
    const plan = await prisma.planes.create({
      data: {
        nombre: 'PLAN_ANUAL_365',
        descripcion: 'Suscripción anual para acceder a todas las funcionalidades de la plataforma',
        precio: 365.00,
        duracionDias: 365,
        caracteristicas: {
          acceso_completo: true,
          matching_avanzado: true,
          cv_uploads: true,
          aplicaciones_ilimitadas: true,
          soporte_prioritario: true,
          notificaciones_push: true,
          estadisticas_detalladas: true
        }
      }
    });

    console.log('✅ Plan anual creado exitosamente:');
    console.log('   - Nombre:', plan.nombre);
    console.log('   - Precio:', `$${plan.precio}`);
    console.log('   - Duración:', `${plan.duracionDias} días`);
    console.log('   - ID:', plan.id);
    
  } catch (error) {
    console.error('❌ Error al inicializar plan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  initSubscriptionPlan();
}

module.exports = { initSubscriptionPlan }; 