// Sistema de estado global para el panel de administración
// Evita múltiples fetches del mismo recurso y sincroniza cambios

export interface AdminUser {
  id: string;
  email: string;
}

export interface AdminSession {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

type StateListener<T> = (data: T) => void;
type StateKey = 'projects' | 'profile' | 'session' | 'loading' | 'error';

export class AdminStateManager {
  private static instance: AdminStateManager;
  private cache = new Map<StateKey, any>();
  private listeners = new Map<StateKey, Set<StateListener<any>>>();
  private timestamps = new Map<StateKey, number>();
  private TTL = 30000; // 30 segundos

  private constructor() {
    this.initializeSession();
  }

  static getInstance(): AdminStateManager {
    if (!AdminStateManager.instance) {
      AdminStateManager.instance = new AdminStateManager();
    }
    return AdminStateManager.instance;
  }

  private initializeSession() {
    const token = typeof localStorage !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    
    this.cache.set('session', {
      user: null,
      token: token || null,
      isAuthenticated: !!token,
    } as AdminSession);
  }

  /**
   * Obtiene dato del cache o lo invalida si expiró
   */
  get<T>(key: StateKey): T | null {
    const timestamp = this.timestamps.get(key) || 0;
    const isExpired = Date.now() - timestamp > this.TTL;

    if (isExpired) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key) ?? null;
  }

  /**
   * Establece valor en cache y notifica listeners
   */
  set<T>(key: StateKey, value: T): void {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
    this.notifyListeners(key, value);
  }

  /**
   * Invalida un recurso del cache
   */
  invalidate(key: StateKey): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
    this.notifyListeners(key, null);
  }

  /**
   * Invalida todos los recursos
   */
  invalidateAll(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Se suscribe a cambios en un recurso
   */
  subscribe<T>(key: StateKey, listener: StateListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    // Retornar función para desuscribirse
    return () => {
      this.listeners.get(key)?.delete(listener);
    };
  }

  /**
   * Notifica a todos los listeners de un recurso
   */
  private notifyListeners<T>(key: StateKey, data: T): void {
    this.listeners.get(key)?.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        // Error en listener
      }
    });
  }

  /**
   * Establece token de sesión y actualiza estado
   */
  setToken(token: string, user?: AdminUser): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    this.set('session', {
      user: user || null,
      token,
      isAuthenticated: true,
    });
  }

  /**
   * Limpia sesión (logout)
   */
  clearSession(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    this.set('session', {
      user: null,
      token: null,
      isAuthenticated: false,
    });
    this.invalidateAll();
  }

  /**
   * Obtiene sesión actual
   */
  getSession(): AdminSession {
    return this.get<AdminSession>('session') || {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  /**
   * Obtiene token actual
   */
  getToken(): string | null {
    return this.getSession().token;
  }

  /**
   * Verifica si está autenticado
   */
  isAuthenticated(): boolean {
    return this.getSession().isAuthenticated;
  }

  /**
   * Establece estado de carga global
   */
  setLoading(loading: boolean, message?: string): void {
    this.set('loading', { isLoading: loading, message: message || '' });
  }

  /**
   * Obtiene estado de carga
   */
  getLoading(): { isLoading: boolean; message: string } {
    return this.get('loading') || { isLoading: false, message: '' };
  }

  /**
   * Establece error global
   */
  setError(error: string | null): void {
    if (error) {
      this.set('error', error);
    } else {
      this.invalidate('error');
    }
  }

  /**
   * Obtiene error actual
   */
  getError(): string | null {
    return this.get('error');
  }

  /**
   * Obtiene toda la sesión (para debugging)
   */
  getDebugInfo(): object {
    return {
      cache: Object.fromEntries(this.cache),
      timestamps: Object.fromEntries(this.timestamps),
      ttl: this.TTL,
      now: Date.now(),
    };
  }
}

// Exportar instancia singleton
export const adminState = AdminStateManager.getInstance();
