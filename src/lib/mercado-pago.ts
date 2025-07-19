import { MercadoPagoConfig, Payment } from "mercadopago";

let mercadoPagoConfig: MercadoPagoConfig | null = null;
let paymentClient: Payment | null = null;

export function getMercadoPagoClient(): Payment {
  if (!paymentClient) {
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
}

export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MERCADO_PAGO_ACCESS_TOKEN && !!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
} 