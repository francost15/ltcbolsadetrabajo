'use client';

import { useState } from 'react';
import { 
  initMercadoPago, 
  CardNumber, 
  ExpirationDate, 
  SecurityCode, 
  createCardToken 
} from '@mercadopago/sdk-react';
import { createAnnualSubscription } from '@/actions';
import { useRouter } from 'next/navigation';
import { LoaderIcon, toast } from 'react-hot-toast';

// Inicializar Mercado Pago
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  console.log('🔑 Inicializando Mercado Pago con public key:', process.env.NEXT_PUBLIC_MP_PUBLIC_KEY.substring(0, 20) + '...');
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
} else {
  console.error('❌ No se encontró NEXT_PUBLIC_MP_PUBLIC_KEY en las variables de entorno');
}

interface SubscriptionFormProps {
  userEmail: string;
  planPrice: number;
}

// Skeleton loading para el formulario
function FormSkeleton() {
  return (
    <div className="bg-white space-y-6">
      <div className="mb-8">
        <div className="h-5 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      
      <div className="space-y-5">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default function SubscriptionForm({ userEmail, planPrice }: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    email: userEmail
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardholderName.trim()) {
      toast.error('Por favor, ingresa el nombre del titular de la tarjeta');
      return;
    }

    console.log('🔄 Iniciando proceso de pago...');
    setLoading(true);
    
    try {
      // Verificar que Mercado Pago esté inicializado
      if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
        throw new Error('Configuración de Mercado Pago faltante');
      }

      console.log('💳 Creando token de tarjeta...');
      
      // Crear token de tarjeta
      const tokenData = await createCardToken({
        cardholderName: formData.cardholderName,
      });

      console.log('✅ Token creado:', tokenData?.id ? 'Exitoso' : 'Falló');

      if (!tokenData?.id) {
        throw new Error('Error al crear el token de tarjeta. Verifica los datos de la tarjeta.');
      }

      console.log('🚀 Enviando datos al servidor...');

      // Procesar pago
      const result = await createAnnualSubscription({
        token: tokenData.id,
        email: formData.email,
        amount: planPrice,
        installments: 1,
        cardholderName: formData.cardholderName
      });

      console.log('📋 Resultado del servidor:', result);

      if (result.success) {
        toast.success(result.message);
        router.push('/subscription/success');
      } else {
        toast.error(result.message);
        
        // Log adicional para debugging
        if (result.status) {
          console.log('Estado del pago:', result.status);
        }
      }

    } catch (error) {
      console.error('❌ Error detallado:', error);
      
      // Manejo de errores más específico
      if (error instanceof Error) {
        if (error.message.includes('token')) {
          toast.error('Error con los datos de la tarjeta. Verifica la información ingresada.');
        } else if (error.message.includes('Configuración')) {
          toast.error('Error de configuración. Contacta al soporte.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Error inesperado al procesar el pago. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header del formulario más compacto */}
      <div className="mb-4">
        <h2 className="text-xl font-light text-gray-900 mb-1">
          Información de pago
        </h2>
        <p className="text-gray-600 font-light text-sm">
          Completa tus datos para proceder
        </p>
      </div>

      <form onSubmit={handleSubmit} className="">
        {/* Información personal más compacta */}
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-light text-gray-700 mb-1">
              Nombre del titular
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre completo"
              required
              className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500 font-light transition-colors duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly
              className="w-full px-0 py-2 border-0 border-b border-gray-200 bg-transparent text-gray-500 font-light cursor-not-allowed text-sm"
            />
          </div>
        </div>

        {/* Información de la tarjeta más compacta */}
        <div className="space-y-1">
          {/* Una sola fila para todos los campos de tarjeta */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <div className="w-full border-0 border-b border-gray-300 focus-within:border-gray-900 transition-colors duration-200 pb-1">
                <CardNumber placeholder="1234 1234 1234 1234" />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                Vencimiento
              </label>
              <div className="w-full border-0 border-b border-gray-300 focus-within:border-gray-900 transition-colors duration-200 pb-1">
                <ExpirationDate placeholder="MM/AA" />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-light text-gray-700 mb-1">
                CVV
              </label>
              <div className="w-full border-0 border-b border-gray-300 focus-within:border-gray-900 transition-colors duration-200 pb-1">
                <SecurityCode placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del pago más compacto */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-light text-sm">Total a pagar</span>
            <span className="text-xl font-light text-gray-900">
              ${planPrice}
            </span>
          </div>

          {/* Botón de pago estilo Tesla más compacto */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-2.5 px-6 font-light transition-all duration-200 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoaderIcon className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Procesando...
              </span>
            ) : (
              'Confirmar suscripción'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}