// Configuración de Mercado Pago para el cliente
export const MERCADO_PAGO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df',
  isProduction: (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df').startsWith('APP_USR-')
};

export function getMercadoPagoPublicKey(): string {
  return MERCADO_PAGO_CONFIG.publicKey;
}

export function isMercadoPagoProduction(): boolean {
  return MERCADO_PAGO_CONFIG.isProduction;
} 