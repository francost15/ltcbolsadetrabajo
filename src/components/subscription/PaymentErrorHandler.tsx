"use client"

import { useState } from 'react';
import { FaExclamationTriangle, FaCreditCard, FaShieldAlt, FaSyncAlt, FaTimes } from 'react-icons/fa';

interface PaymentError {
  success: false;
  message: string;
  status?: string;
  statusDetail?: string;
  isRecoverable?: boolean;
  errorType?: string;
  isTestMode?: boolean;
}

interface PaymentErrorHandlerProps {
  error: PaymentError;
  onRetry?: () => void;
  onClose?: () => void;
}

export default function PaymentErrorHandler({ error, onRetry, onClose }: PaymentErrorHandlerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getErrorIcon = () => {
    switch (error.errorType) {
      case 'insufficient_funds':
        return <FaCreditCard className="w-6 h-6 text-red-500" />;
      case 'invalid_card':
        return <FaCreditCard className="w-6 h-6 text-orange-500" />;
      case 'card_disabled':
        return <FaShieldAlt className="w-6 h-6 text-red-600" />;
      case 'timeout':
      case 'network_error':
        return <FaSyncAlt className="w-6 h-6 text-blue-500" />;
      default:
        return <FaExclamationTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const getErrorColor = () => {
    if (error.isRecoverable) {
      return 'border-orange-200 bg-orange-50';
    }
    return 'border-red-200 bg-red-50';
  };

  const getActionButton = () => {
    if (error.isRecoverable) {
      return (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Intentar nuevamente
        </button>
      );
    }
    return null;
  };

  const getHelpText = () => {
    switch (error.errorType) {
      case 'insufficient_funds':
        return 'Verifica que tu tarjeta tenga fondos suficientes o intenta con otra tarjeta.';
      case 'invalid_card':
        return 'Revisa que el número, fecha de vencimiento y código de seguridad sean correctos.';
      case 'card_disabled':
        return 'Contacta a tu banco para activar tu tarjeta o usa otra tarjeta.';
      case 'timeout':
        return 'El servidor tardó en responder. Intenta nuevamente en unos minutos.';
      case 'network_error':
        return 'Verifica tu conexión a internet e intenta nuevamente.';
      case 'duplicate_payment':
        return 'Este pago ya fue procesado. Si crees que es un error, contacta al soporte.';
      default:
        return 'Si el problema persiste, contacta al soporte técnico.';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor()} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getErrorIcon()}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Error en el pago
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {error.message}
            </p>
            
            {error.isTestMode && (
              <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                <p className="text-xs text-yellow-800">
                  <strong>Modo de prueba:</strong> Este es un error simulado para testing.
                </p>
              </div>
            )}

            <p className="text-xs text-gray-600 mb-3">
              {getHelpText()}
            </p>

            {/* Información técnica (expandible) */}
            {(error.status || error.statusDetail) && (
              <div className="mb-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {isExpanded ? 'Ocultar' : 'Mostrar'} detalles técnicos
                </button>
                
                {isExpanded && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                    {error.status && (
                      <div>Estado: {error.status}</div>
                    )}
                    {error.statusDetail && (
                      <div>Detalle: {error.statusDetail}</div>
                    )}
                    {error.errorType && (
                      <div>Tipo: {error.errorType}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center space-x-3">
              {getActionButton()}
              
              {error.isRecoverable && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar múltiples errores
export function PaymentErrorList({ errors, onRetry, onClose }: { 
  errors: PaymentError[]; 
  onRetry?: () => void; 
  onClose?: () => void; 
}) {
  return (
    <div className="space-y-3">
      {errors.map((error, index) => (
        <PaymentErrorHandler
          key={index}
          error={error}
          onRetry={onRetry}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

// Hook para manejar errores de pago
export function usePaymentError() {
  const [errors, setErrors] = useState<PaymentError[]>([]);

  const addError = (error: PaymentError) => {
    setErrors(prev => [...prev, error]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  return {
    errors,
    addError,
    clearErrors,
    removeError,
    hasErrors: errors.length > 0
  };
} 