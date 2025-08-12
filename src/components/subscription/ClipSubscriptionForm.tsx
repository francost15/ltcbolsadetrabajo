'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import { createAnnualSubscriptionWithClip } from '@/actions/subscription/subscriptionActionsClip';

// Declare global Clip SDK types
declare global {
  interface Window {
    ClipSDK: any;
  }
}

interface SubscriptionFormProps {
  userEmail: string;
  planPrice: number;
}

export default function ClipSubscriptionForm({ userEmail, planPrice }: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    email: userEmail
  });
  
  const router = useRouter();
  const clipRef = useRef<any>(null);
  const cardRef = useRef<any>(null);

  useEffect(() => {
    const initClip = () => {
      if (typeof window !== 'undefined' && window.ClipSDK) {
        const API_KEY = process.env.NEXT_PUBLIC_CLIP_API_KEY;
        
        if (!API_KEY) {
          console.error('❌ CLIP API KEY not found');
          toast.error('Configuración de pagos faltante');
          return;
        }
        
        clipRef.current = new window.ClipSDK(API_KEY);
        
        cardRef.current = clipRef.current.element.create("Card", {
          locale: "es", 
        });

        cardRef.current.mount("checkout");
        
      }
    };

    if (!document.querySelector('script[src="https://sdk.clip.mx/js/clip-sdk.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.clip.mx/js/clip-sdk.js';
      script.onload = initClip;
      script.onerror = () => {
        console.error('❌ Error loading Clip SDK');
        toast.error('Error al cargar el sistema de pagos');
      };
      document.head.appendChild(script);
    } else {
      initClip();
    }

    return () => {
      if (cardRef.current) {
        try {
          cardRef.current.unmount();
        } catch (error) {
          console.log('Card element already unmounted');
        }
      }
    };
  }, []);

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

    if (!cardRef.current) {
      toast.error('El sistema de pagos no está listo. Intenta nuevamente.');
      return;
    }

    setLoading(true);
    
    try {
      
      const cardToken = await cardRef.current.cardToken();
      
      const cardTokenID = cardToken.id;

      if (!cardTokenID) {
        throw new Error('Error al obtener el Card Token ID');
      }


      const result = await createAnnualSubscriptionWithClip({
        cardTokenId: cardTokenID,
        email: formData.email,
        amount: planPrice,
        cardholderName: formData.cardholderName
      });

      if (result.success) {
        toast.success(result.message);
        router.push('/subscription/success');
      } else {
        toast.error(result.message);
      }

    } catch (error: any) {
      console.error('❌ Error completo:', error);
      
      if (error.code) {
        console.error('❌ Clip Error Code:', error.code);
        console.error('❌ Clip Error Message:', error.message);
        
        switch (error.code) {
          case "CL2200":
          case "CL2290":
            toast.error(`Error: ${error.message}`);
            break;
          case "AI1300":
            console.log("Error: ", error.message);
            toast.error('Error de validación. Verifica los datos de la tarjeta.');
            break;
          default:
            toast.error(error.message || 'Error al procesar el pago. Intenta nuevamente.');
            break;
        }
      } else {
        toast.error(error.message || 'Error al procesar el pago. Intenta nuevamente.');
      }
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
          Completa tus datos para proceder
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

        <div className="mb-6">
          <label className="block text-sm font-light text-gray-700 mb-3">
            Información de la tarjeta
          </label>
          <div id="checkout" className="min-h-[120px]"></div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-light text-sm">Total a pagar</span>
            <span className="text-xl font-light text-gray-900">
              ${planPrice}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-black py-2.5 px-6 font-light transition-all duration-200 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoaderIcon className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Procesando pago...
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