'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ConektaPaymentData {
  email: string;
  amount: number;
  cardholderName: string;
}

export async function createAnnualSubscriptionWithConekta(paymentData: ConektaPaymentData) {
  try {
    const privateKey = process.env.CONEKTA_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('Configuración de Conekta incompleta. Verifica las variables de entorno.');
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

    // Create customer in Conekta
    const customerResponse = await fetch('https://api.conekta.io/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.conekta-v2.0.0+json'
      },
      body: JSON.stringify({
        name: paymentData.cardholderName,
        email: paymentData.email,
        phone: "5555555555"
      })
    });

    if (!customerResponse.ok) {
      const errorData = await customerResponse.text();
      console.error('❌ Error creating customer:', errorData);
      throw new Error('Error al crear el cliente en Conekta');
    }

    const customer = await customerResponse.json();

    // Prepare order data for checkout redirect
    const orderData = {
      currency: 'MXN',
      customer_info: {
        name: paymentData.cardholderName,
        email: paymentData.email,
        phone: "5555555555"
      },
      line_items: [{
        name: `Suscripción Anual - ${plan.nombre}`,
        unit_price: Math.round(paymentData.amount * 100), // Convert to cents
        quantity: 1
      }],
      checkout: {
        allowed_payment_methods: ['card'],
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/checkout`
      },
      metadata: {
        user_id: session.user.id,
        plan_id: plan.id.toString()
      }
    };

    // Create order using REST API
    const orderResponse = await fetch('https://api.conekta.io/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.conekta-v2.0.0+json'
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('❌ Error creating order:', errorData);
      throw new Error('Error al crear la orden en Conekta');
    }

    const order = await orderResponse.json();

    if (!order.id || !order.checkout?.id) {
      throw new Error('Error: No se recibió información completa de la orden');
    }

    // Create pending subscription in database
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + plan.duracionDias);

    const subscription = await prisma.suscripciones.create({
      data: {
        usuarioId: session.user.id,
        planId: plan.id,
        fechaFin: fechaFin,
        estado: 'pendiente' // Will be updated by webhook when payment is confirmed
      }
    });

    // Create pending payment record
    await prisma.pagos.create({
      data: {
        suscripcionId: subscription.id,
        usuarioId: session.user.id,
        monto: paymentData.amount,
        metodoPago: 'conekta',
        referenciaTransaccion: order.id,
        estadoPago: 'PENDIENTE'
      }
    });

    const checkoutUrl = `https://pay.conekta.com/checkout/${order.checkout.id}`;

    console.log('🎯 Orden creada exitosamente - Redirigiendo a checkout');
    
    return {
      success: true,
      message: 'Orden creada exitosamente',
      subscriptionId: subscription.id,
      orderId: order.id,
      checkoutUrl: checkoutUrl,
      checkoutId: order.checkout.id
    };

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