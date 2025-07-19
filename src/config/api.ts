// Configuración simple para API de Python existente
export const PYTHON_API_URL = process.env.NEXT_PUBLIC_MATCHING_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  HEALTH: `${PYTHON_API_URL}/health`,
  UPLOAD_CV: (userId: string) => `${PYTHON_API_URL}/api/v1/candidatos/${userId}/upload-cv`,
  GET_MATCHES: (userId: string) => `${PYTHON_API_URL}/api/v1/candidatos/${userId}/matches`,
};

export const TIMEOUTS = {
  HEALTH_CHECK: 5000,
  MATCHING: 45000,
  UPLOAD: 60000,
};

export const createRequest = async (
  url: string, 
  options: RequestInit = {}, 
  timeout: number = TIMEOUTS.MATCHING
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Función de retry con backoff exponencial
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 2000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt - 1), // Backoff factor is 2
        10000 // Max delay
      );
      
      console.log(`⏳ Reintentando en ${delay}ms (intento ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
};

// Verificar estado de la API
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await createRequest(
      `${PYTHON_API_URL}/health`,
      { method: 'GET' },
      TIMEOUTS.HEALTH_CHECK
    );
    
    return response.ok;
  } catch (error) {
    console.log('🔌 API health check failed:', error instanceof Error ? error.message : 'Unknown');
    return false;
  }
};

// Logs con formato consistente
export const apiLogger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data ? data : '');
  },
  success: (message: string, data?: any) => {
    console.log(`✅ ${message}`, data ? data : '');
  },
  warning: (message: string, data?: any) => {
    console.log(`⚠️ ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error ? error : '');
  },
  timing: (message: string, startTime: number) => {
    const duration = Date.now() - startTime;
    console.log(`⏱️ ${message} (${duration}ms)`);
  }
}; 