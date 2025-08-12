'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ClipPaymentData {
  cardTokenId: string;
  email: string;
  amount: number;
  cardholderName: string;
}

export async function createAnnualSubscriptionWithClip(paymentData: ClipPaymentData) {
  try {
    
    const secretKey = process.env.CLIP_SECRET_KEY;
    const publicKey = process.env.NEXT_PUBLIC_CLIP_API_KEY;
    
    if (!secretKey || !publicKey) {
      throw new Error('Configuración de Clip incompleta. Verifica las variables de entorno.');
    }
    
    
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('Usuario no autenticado');
    }

    const existingSubscription = await prisma.suscripciones.findFirst({
      where: {
        usuarioId: session.user.id,
        estado: 'activa'
      }
    });

    if (existingSubscription) {
      throw new Error('Ya tienes una suscripción activa');
    }

    const plan = await prisma.planes.findFirst({
      where: {
        nombre: 'PLAN_ANUAL_365'
      }
    });

    if (!plan) {
      throw new Error('Plan no encontrado');
    }

    const clipPaymentData = {
      amount: paymentData.amount,
      currency: 'MXN',
      description: `Suscripción Anual - ${plan.nombre}`,
      payment_method: {
        token: paymentData.cardTokenId
      },
      customer: {
        email: paymentData.email,
        phone: "5555555555"
      }
    };

  

    
    const authString = `${publicKey}:${secretKey}`;
    
    // Encode to Base64
    const base64Auth = Buffer.from(authString).toString('base64');
    
    const authHeader = `Basic ${base64Auth}`;

    const apiUrl = 'https://api.payclip.com/payments';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clipPaymentData),
    });

    const payment = await response.json();

    if (!response.ok) {
      console.error('❌ Error en respuesta de Clip API:');
      console.error('  - Status:', response.status);
      console.error('  - Response:', payment);
      
      if (response.status === 401) {
        throw new Error('Error de autorización: Verifica que tu Secret Key sea correcto');
      }
      
      if (payment.error_code) {
        throw new Error(`Error ${payment.error_code}: ${payment.message}`);
      }
      
      throw new Error(payment.message || `Error HTTP ${response.status}: ${response.statusText}`);
    }

    if (!payment.id) {
      throw new Error('Error: No se recibió ID de transacción en la respuesta');
    }


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


    await prisma.pagos.create({
      data: {
        suscripcionId: subscription.id,
        usuarioId: session.user.id,
        monto: paymentData.amount,
        metodoPago: 'clip',
        referenciaTransaccion: payment.id.toString(),
        estadoPago: payment.status === 'approved' ? 'COMPLETADO' : 'PENDIENTE'
      }
    });


    if (payment.status === 'approved') {
      console.log('🎉 PAGO APROBADO - Suscripción activada');
      revalidatePath('/home');
      return {
        success: true,
        message: '¡Suscripción activada exitosamente!',
        subscriptionId: subscription.id,
        paymentId: payment.id
      };
    } else if (payment.status === 'pending') {
      console.log('⏳ PAGO PENDIENTE');
      return {
        success: false,
        message: 'Tu pago está pendiente de confirmación. Te notificaremos cuando se procese.',
        subscriptionId: subscription.id,
        paymentId: payment.id,
        status: payment.status,
        isPending: true
      };
    } else {
      console.log('❌ PAGO RECHAZADO O FALLIDO');
      return {
        success: false,
        message: 'Tu pago fue rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.',
        subscriptionId: subscription.id,
        paymentId: payment.id,
        status: payment.status
      };
    }

  } catch (error) {
    console.error('❌ Error completo al procesar suscripción:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        isRecoverable: true
      };
    }
    
    return {
      success: false,
      message: 'Error desconocido al procesar el pago',
      isRecoverable: false
    };
  }
}