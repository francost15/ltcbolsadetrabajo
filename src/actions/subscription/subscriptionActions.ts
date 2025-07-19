'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getMercadoPagoClient, isMercadoPagoConfigured } from "@/lib/mercado-pago";
import { revalidatePath } from "next/cache";

interface PaymentData {
  token: string;
  email: string;
  amount: number;
  installments: number;
  cardholderName: string;
}

// Función para obtener mensaje de error amigable
function getFriendlyErrorMessage(status: string, statusDetail: string): string {
  const errorMessages: { [key: string]: string } = {
    // Errores de tarjeta rechazada
    'cc_rejected_bad_filled_date': 'La fecha de vencimiento de la tarjeta es incorrecta.',
    'cc_rejected_bad_filled_other': 'Hay un error en los datos de la tarjeta.',
    'cc_rejected_bad_filled_security_code': 'El código de seguridad de la tarjeta es incorrecto.',
    'cc_rejected_blacklist': 'No pudimos procesar tu pago. Contacta a tu banco.',
    'cc_rejected_call_for_authorize': 'Debes autorizar el pago con tu banco.',
    'cc_rejected_card_disabled': 'Llama a tu banco para activar tu tarjeta.',
    'cc_rejected_card_error': 'No pudimos procesar tu pago. Verifica los datos de tu tarjeta.',
    'cc_rejected_duplicated_payment': 'Ya realizaste un pago por ese monto. Si necesitas volver a pagar, contacta al soporte.',
    'cc_rejected_high_risk': 'Tu pago fue rechazado. Elige otro método de pago.',
    'cc_rejected_insufficient_amount': 'Tu tarjeta no tiene fondos suficientes.',
    'cc_rejected_invalid_installments': 'Tu tarjeta no procesa pagos en cuotas.',
    'cc_rejected_max_attempts': 'Llegaste al límite de intentos permitidos. Elige otra tarjeta.',
    'cc_rejected_other_reason': 'Tu banco no procesó el pago. Contacta a tu banco.',
    
    // Errores de pago
    'payment_in_process': 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
    'payment_rejected': 'Tu pago fue rechazado. Elige otro método de pago.',
    'payment_cancelled': 'El pago fue cancelado.',
    'payment_expired': 'El pago expiró. Intenta nuevamente.',
    
    // Errores de configuración
    'invalid_payer_email': 'El email del pagador es inválido.',
    'invalid_payer_identification': 'Los datos de identificación son inválidos.',
    
    // Errores de monto
    'invalid_amount': 'El monto del pago es inválido.',
    'invalid_installments': 'El número de cuotas es inválido.',
    
    // Errores de token
    'invalid_token': 'El token de pago es inválido. Intenta nuevamente.',
    'invalid_card_token': 'Los datos de la tarjeta son inválidos.',
    
    // Errores de red/API
    'api_error': 'Error en el procesamiento. Intenta nuevamente en unos minutos.',
    'internal_server_error': 'Error interno del servidor. Intenta más tarde.',
    'timeout': 'La operación tardó demasiado. Intenta nuevamente.',
  };

  // Buscar mensaje específico
  const specificMessage = errorMessages[statusDetail];
  if (specificMessage) {
    return specificMessage;
  }

  // Mensajes por estado general
  switch (status) {
    case 'approved':
      return '¡Pago aprobado exitosamente!';
    case 'pending':
      return 'Tu pago está pendiente de confirmación. Te notificaremos cuando se procese.';
    case 'in_process':
      return 'Tu pago está siendo procesado. Esto puede tomar hasta 2 días hábiles.';
    case 'rejected':
      return 'Tu pago fue rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.';
    case 'cancelled':
      return 'El pago fue cancelado. Puedes intentar nuevamente cuando quieras.';
    case 'refunded':
      return 'El pago fue reembolsado.';
    default:
      return `Error en el pago: ${statusDetail || 'Error desconocido'}`;
  }
}

// Función para verificar si es un error recuperable
function isRecoverableError(status: string, statusDetail: string): boolean {
  const recoverableErrors = [
    'cc_rejected_bad_filled_date',
    'cc_rejected_bad_filled_other',
    'cc_rejected_bad_filled_security_code',
    'cc_rejected_call_for_authorize',
    'cc_rejected_insufficient_amount',
    'cc_rejected_invalid_installments',
    'cc_rejected_other_reason',
    'invalid_payer_email',
    'invalid_amount',
    'invalid_installments',
    'invalid_token',
    'invalid_card_token',
    'timeout'
  ];

  return recoverableErrors.includes(statusDetail);
}

export async function createAnnualSubscription(paymentData: PaymentData) {
  try {
    console.log('🔄 Iniciando proceso de suscripción...');
    
    // Verificar configuración de Mercado Pago
    if (!isMercadoPagoConfigured()) {
      throw new Error('Configuración de Mercado Pago incompleta. Verifica las variables de entorno.');
    }
    
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN!;
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;
    
    console.log('🔑 Access token configurado: SÍ');
    console.log('🔑 Public key configurado: SÍ');
    console.log('🌍 Modo:', accessToken.startsWith('TEST-') ? 'PRUEBA' : 'PRODUCCIÓN');
    
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar si ya tiene una suscripción activa
    const existingSubscription = await prisma.suscripciones.findFirst({
      where: {
        usuarioId: session.user.id,
        estado: 'activa'
      }
    });

    if (existingSubscription) {
      throw new Error('Ya tienes una suscripción activa');
    }

    // Verificar si ya existe un pago procesado con estos datos para evitar duplicados
    const existingPaymentByReference = await prisma.pagos.findFirst({
      where: {
        usuarioId: session.user.id,
        monto: paymentData.amount,
        estadoPago: 'COMPLETADO',
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000) // Últimos 60 segundos
        }
      }
    });

    if (existingPaymentByReference) {
      throw new Error('Ya existe un pago reciente procesado. Por favor, verifica tu suscripción.');
    }

    // Obtener el plan anual
    const plan = await prisma.planes.findFirst({
      where: {
        nombre: 'PLAN_ANUAL_365'
      }
    });

    if (!plan) {
      throw new Error('Plan no encontrado');
    }

    // Determinar si estamos en modo de prueba
    const isTestMode = accessToken.startsWith('TEST-');
    
    // Para el entorno de prueba, usar nombre que apruebe el pago, pero mantener el email real del usuario
    const testCardholderName = isTestMode ? 'APRO' : paymentData.cardholderName;
    const userEmail = paymentData.email;

    console.log('💳 Creando pago en Mercado Pago con datos:', {
      email: userEmail,
      amount: paymentData.amount,
      installments: paymentData.installments,
      cardholderName: testCardholderName,
      isTestMode
    });

    const paymentClient = await getMercadoPagoClient();
    const payment = await paymentClient.create({
      body: {
        payer: {
          email: userEmail,
          identification: {
            type: 'DNI',
            number: '12345678'
          }
        },
        token: paymentData.token,
        transaction_amount: paymentData.amount,
        installments: paymentData.installments,
        description: `Suscripción Anual - ${plan.nombre}`,
        external_reference: `subscription_${session.user.id}_${Date.now()}`,
        metadata: {
          user_id: session.user.id,
          plan_id: plan.id,
          type: 'annual_subscription'
        }
      }
    });

    console.log('✅ Respuesta de Mercado Pago:', {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      isTestMode
    });

    if (!payment.id) {
      throw new Error('Error al procesar el pago');
    }

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + plan.duracionDias);

    // Crear la suscripción en la base de datos
    const subscription = await prisma.suscripciones.create({
      data: {
        usuarioId: session.user.id,
        planId: plan.id,
        fechaFin: fechaFin,
        estado: payment.status === 'approved' ? 'activa' : 'pendiente'
      }
    });

    // Verificar si ya existe un pago con esta referencia
    const existingPayment = await prisma.pagos.findUnique({
      where: {
        referenciaTransaccion: payment.id.toString()
      }
    });

    // Crear o actualizar el registro de pago
    if (existingPayment) {
      // Si ya existe, actualizar el estado
      await prisma.pagos.update({
        where: {
          id: existingPayment.id
        },
        data: {
          estadoPago: payment.status === 'approved' ? 'COMPLETADO' : 'PENDIENTE'
        }
      });
    } else {
      // Si no existe, crear nuevo registro
      await prisma.pagos.create({
        data: {
          suscripcionId: subscription.id,
          usuarioId: session.user.id,
          monto: paymentData.amount,
          metodoPago: 'mercado_pago',
          referenciaTransaccion: payment.id.toString(),
          estadoPago: payment.status === 'approved' ? 'COMPLETADO' : 'PENDIENTE'
        }
      });
    }

    // Manejar diferentes estados de pago
    if (payment.status === 'approved') {
      revalidatePath('/home');
      return {
        success: true,
        message: '¡Suscripción activada exitosamente!',
        subscriptionId: subscription.id,
        paymentId: payment.id
      };
    } else if (payment.status === 'pending' || payment.status === 'in_process') {
      return {
        success: false,
        message: getFriendlyErrorMessage(payment.status, payment.status_detail || ''),
        subscriptionId: subscription.id,
        paymentId: payment.id,
        status: payment.status,
        isPending: true,
        isRecoverable: false
      };
    } else {
      // Pago rechazado o con error
      const statusDetail = payment.status_detail ?? '';
      const paymentStatus = payment.status ?? 'unknown';
      const errorMessage = getFriendlyErrorMessage(paymentStatus, statusDetail);
      const isRecoverable = isRecoverableError(paymentStatus, statusDetail);
      
      return {
        success: false,
        message: errorMessage,
        subscriptionId: subscription.id,
        paymentId: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        isRecoverable,
        isTestMode
      };
    }

  } catch (error) {
    console.error('❌ Error al crear suscripción:', error);
    
    // Manejar errores específicos de Mercado Pago
    if (error instanceof Error) {
      if (error.message.includes('insufficient_funds')) {
        return {
          success: false,
          message: 'Tu tarjeta no tiene fondos suficientes para completar la transacción.',
          isRecoverable: true,
          errorType: 'insufficient_funds'
        };
      }
      
      if (error.message.includes('invalid_card')) {
        return {
          success: false,
          message: 'Los datos de la tarjeta son inválidos. Verifica el número, fecha de vencimiento y código de seguridad.',
          isRecoverable: true,
          errorType: 'invalid_card'
        };
      }
      
      if (error.message.includes('card_disabled')) {
        return {
          success: false,
          message: 'Tu tarjeta está deshabilitada. Contacta a tu banco para activarla.',
          isRecoverable: false,
          errorType: 'card_disabled'
        };
      }
      
      if (error.message.includes('timeout')) {
        return {
          success: false,
          message: 'La operación tardó demasiado. Intenta nuevamente en unos minutos.',
          isRecoverable: true,
          errorType: 'timeout'
        };
      }
      
      if (error.message.includes('network_error')) {
        return {
          success: false,
          message: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
          isRecoverable: true,
          errorType: 'network_error'
        };
      }
    }
    
    // Manejar error específico de constraint única
    if (error instanceof Error && error.message.includes('Unique constraint failed on the fields: (`referencia_transaccion`)')) {
      return {
        success: false,
        message: 'Este pago ya ha sido procesado. Si crees que esto es un error, contacta al soporte.',
        isRecoverable: false,
        errorType: 'duplicate_payment'
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al procesar el pago',
      isRecoverable: false,
      errorType: 'unknown_error'
    };
  }
}

export async function checkActiveSubscription() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { hasActiveSubscription: false };
    }

    const subscription = await prisma.suscripciones.findFirst({
      where: {
        usuarioId: session.user.id,
        estado: 'activa',
        fechaFin: {
          gt: new Date()
        }
      },
      include: {
        plan: true
      }
    });

    return {
      hasActiveSubscription: !!subscription,
      subscription: subscription || null
    };

  } catch (error) {
    console.error('Error al verificar suscripción:', error);
    return { hasActiveSubscription: false };
  }
}

export async function createAnnualPlan() {
  try {
    // Verificar si ya existe el plan
    const existingPlan = await prisma.planes.findFirst({
      where: {
        nombre: 'PLAN_ANUAL_365'
      }
    });

    if (existingPlan) {
      return {
        success: true,
        message: 'Plan ya existe',
        plan: existingPlan
      };
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
          soporte_prioritario: true
        }
      }
    });

    return {
      success: true,
      message: 'Plan creado exitosamente',
      plan
    };

  } catch (error) {
    console.error('Error al crear plan:', error);
    return {
      success: false,
      message: 'Error al crear el plan'
    };
  }
}

export async function getUserSubscriptionStatus() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { authenticated: false };
    }

    const subscription = await prisma.suscripciones.findFirst({
      where: {
        usuarioId: session.user.id,
        estado: 'activa'
      },
      include: {
        plan: true,
        pagos: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    const isActive = subscription && subscription.fechaFin > new Date();

    return {
      authenticated: true,
      hasActiveSubscription: isActive,
      subscription: subscription || null,
      daysRemaining: subscription ? Math.ceil((subscription.fechaFin.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
    };

  } catch (error) {
    console.error('Error al obtener estado de suscripción:', error);
    return { authenticated: false };
  }
} 