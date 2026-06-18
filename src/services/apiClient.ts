// API Client: Gestiona todas las peticiones con token automático
import { adminState } from './adminState';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  bypassCache?: boolean;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export class ApiClient {
  private static readonly API_BASE_URL = import.meta.env?.PUBLIC_API_URL || '';

  /**
   * Realiza un request con autenticación automática
   */
  static async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { 
      method = 'GET', 
      headers = {}, 
      body
    } = options;

    const url = `${this.API_BASE_URL}${endpoint}`;
    const token = adminState.getToken();

    // Preparar headers
    const finalHeaders: Record<string, string> = {
      ...headers,
    };

    // Agregar token si existe
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    // No sobrescribir Content-Type si es FormData
    if (!(body instanceof FormData)) {
      finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
    }

    // Realizar petición
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });

    // Manejo de errores de autenticación
    if (response.status === 401 || response.status === 403) {
      const refreshToken = adminState.getRefreshToken();
      // Si tenemos refresh token y este request no es ya una llamada a refresh-token
      if (refreshToken && !endpoint.includes('/users/refresh-token')) {
        try {
          console.log('🔄 Token expirado detectado. Intentando renovación automática...');
          const refreshUrl = `${this.API_BASE_URL}/users/refresh-token`;
          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newSession = refreshData.data;
            if (newSession && newSession.session) {
              const newToken = newSession.session.access_token;
              const newRefreshToken = newSession.session.refresh_token;
              const user = newSession.user;
              adminState.setToken(newToken, newRefreshToken, user);
              console.log('✅ Token renovado exitosamente. Re-intentando petición original...');

              // Volver a intentar la petición original con el nuevo token
              const retryHeaders = {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`
              };
              return await this.request<T>(endpoint, {
                ...options,
                headers: retryHeaders
              });
            }
          }
        } catch (refreshError) {
          console.error('❌ Error al intentar renovar el token:', refreshError);
        }
      }

      adminState.clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin?auth=required';
      }
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Si no es JSON, usar el statusText
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const result = (data.data ?? data) as T;
    return result;
  }

  /**
   * GET request
   */
  static get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  static post<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PATCH request
   */
  static patch<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  static delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Invalida cache para un endpoint (No-op tras remover DataManager)
   */
  static invalidateCache(endpoint: string) {
    // No-op: cache desactivado
  }

  /**
   * Obtiene URL base (para debugging)
   */
  static getBaseUrl(): string {
    return this.API_BASE_URL;
  }
}
