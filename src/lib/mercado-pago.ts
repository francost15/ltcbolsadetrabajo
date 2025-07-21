// Importación dinámica para evitar problemas en el servidor
let mercadoPagoConfig: any = null;
let paymentClient: any = null;

export async function getMercadoPagoClient(): Promise<any> {
  try {
  if (!paymentClient) {
      // Importación dinámica solo cuando sea necesario
      const { MercadoPagoConfig, Payment } = await import("mercadopago");
      
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN no está configurado. Verifica las variables de entorno.');
    }

    mercadoPagoConfig = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 10000,
      }
    });

    paymentClient = new Payment(mercadoPagoConfig);
  }

  return paymentClient;
  } catch (error) {
    console.error('❌ Error al crear cliente de Mercado Pago:', error);
    throw new Error('No se pudo inicializar el cliente de Mercado Pago. Verifica la configuración.');
  }
}

export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MERCADO_PAGO_ACCESS_TOKEN && !!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
} 