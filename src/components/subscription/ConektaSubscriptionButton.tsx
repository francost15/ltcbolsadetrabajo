'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import { createAnnualSubscriptionWithConekta } from '@/actions/subscription/subscriptionActionsConekta';
interface SubscriptionFormProps {
  userEmail: string;
  planPrice: number;
}

export default function ConektaSubscriptionForm({ userEmail, planPrice }: SubscriptionFormProps) {
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

    setLoading(true);
    
    try {
      const result = await createAnnualSubscriptionWithConekta({
        email: formData.email,
        amount: planPrice,
        cardholderName: formData.cardholderName
      });

      if (result.success && result.checkoutUrl) {
        toast.success('Redirigiendo a la página de pago...');
        // Redirect to Conekta checkout
        window.location.href = result.checkoutUrl;
      } else {
        toast.error(result.message || 'Error al crear la orden de pago');
      }

    } catch (error: any) {
      console.error('❌ Error completo:', error);
      toast.error(error.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header del formulario */}
      <div className="mb-4">
        <h2 className="text-xl font-light text-gray-900 mb-1">
          Información de pago
        </h2>
        <p className="text-gray-600 font-light text-sm">
          Completa tus datos para proceder al pago seguro
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-2 mb-6">
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

        {/* Info sobre el proceso de pago */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Pago seguro con Conekta
              </h4>
              <p className="text-sm text-blue-700 font-light">
                Serás redirigido a una página de pago segura donde podrás ingresar los datos de tu tarjeta.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-light text-sm">Total a pagar</span>
            <span className="text-xl font-light text-gray-900">
              ${planPrice} MXN
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 px-6 font-light transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoaderIcon className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Procesando...
              </span>
            ) : (
              'Continuar al pago'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3 font-light">
            Al continuar, aceptas nuestros términos y condiciones de servicio
          </p>
        </div>
      </form>
    </div>
  );
}