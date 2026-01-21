// DataManager: Gestiona fetches con cache, deduplicación y TTL
// Evita múltiples fetches del mismo endpoint en corto tiempo

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  ttl?: number; // Milisegundos
  bypassCache?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class DataManager {
  private static cache = new Map<string, CacheEntry<any>>();
  private static pending = new Map<string, Promise<any>>();
  private static DEFAULT_TTL = 30000; // 30 segundos

  /**
   * Realiza un fetch con caching automático
   */
  static async fetch<T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, ttl = this.DEFAULT_TTL, bypassCache = false } = options;

    // Crear clave única para la solicitud
    const cacheKey = this.generateCacheKey(url, method, body);

    // Si GET y no bypass y está en cache válido, devolver
    if (method === 'GET' && !bypassCache && this.isCacheValid(cacheKey, ttl)) {
      return this.cache.get(cacheKey)!.data as T;
    }

    // Si ya hay una solicitud pendiente para esta URL, esperarla
    if (this.pending.has(cacheKey)) {
      return this.pending.get(cacheKey)!;
    }

    // Crear nueva solicitud
    const promise = this.executeRequest<T>(url, {
      method,
      headers,
      body,
      ttl,
      cacheKey,
    });

    // Guardar como pendiente
    this.pending.set(cacheKey, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.pending.delete(cacheKey);
    }
  }

  /**
   * Ejecuta la solicitud HTTP real
   */
  private static async executeRequest<T>(
    url: string,
    options: {
      method: string;
      headers: Record<string, string>;
      body?: any;
      ttl: number;
      cacheKey: string;
    }
  ): Promise<T> {
    const fetchOptions: any = {
      method: options.method,
      headers: options.headers,
    };

    if (options.body) {
      // Si es FormData, no establecer Content-Type (el navegador lo hace)
      if (options.body instanceof FormData) {
        fetchOptions.body = options.body;
        delete fetchOptions.headers['Content-Type'];
      } else {
        fetchOptions.body = JSON.stringify(options.body);
      }
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la solicitud');
    }

    // Guardar en cache
    this.cache.set(options.cacheKey, {
      data: data.data ?? data,
      timestamp: Date.now(),
      ttl: options.ttl,
    });

    return data.data ?? data;
  }

  /**
   * Genera clave única para la solicitud
   */
  private static generateCacheKey(url: string, method: string, body?: any): string {
    let key = `${method}:${url}`;
    if (body && method !== 'GET') {
      key += `:${JSON.stringify(body)}`;
    }
    return key;
  }

  /**
   * Verifica si cache es válido
   */
  private static isCacheValid(cacheKey: string, ttl: number): boolean {
    const entry = this.cache.get(cacheKey);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    return age < ttl;
  }

  /**
   * Invalida cache para una URL
   */
  static invalidate(url: string, method: string = 'GET', body?: any): void {
    const cacheKey = this.generateCacheKey(url, method, body);
    this.cache.delete(cacheKey);
  }

  /**
   * Invalida todos los caches
   */
  static invalidateAll(): void {
    this.cache.clear();
  }

  /**
   * Obtiene información de debug del cache
   */
  static getDebugInfo(): object {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      valid: Date.now() - entry.timestamp < entry.ttl,
    }));

    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pending.size,
      entries,
    };
  }

  /**
   * Limpia cache expirado
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Inicia limpieza automática cada 60 segundos
   */
  static startAutoCleanup(interval: number = 60000): () => void {
    const timer = setInterval(() => this.cleanup(), interval);
    return () => clearInterval(timer);
  }
}

// Auto-cleanup en segundo plano
if (typeof window !== 'undefined') {
  DataManager.startAutoCleanup();
}
