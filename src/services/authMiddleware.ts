// AuthMiddleware: Maneja autenticación directamente con Supabase Auth
// ponytail: auth directo usando supabase.auth.signInWithPassword y signOut
import { supabase } from './supabase';
import { adminState } from './adminState';

export class AuthMiddleware {
  /**
   * Realiza login directamente con Supabase Auth
   */
  static async login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string } }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const token = data.session.access_token;
    const refreshToken = data.session.refresh_token;
    const user = {
      id: data.user.id,
      email: data.user.email || '',
    };

    adminState.setToken(token, refreshToken, user);

    return { token, user };
  }

  /**
   * Realiza logout directamente con Supabase Auth
   */
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar errores de red en logout
    } finally {
      adminState.clearSession();
    }
  }

  /**
   * Verifica autenticación antes de acceder a ruta admin
   */
  static requireAuth(): boolean {
    if (!adminState.isAuthenticated()) {
      this.redirectToLogin('Debes iniciar sesión para acceder al panel de administración.');
      return false;
    }
    return true;
  }

  /**
   * Redirige a login
   */
  private static redirectToLogin(message?: string): void {
    if (typeof window !== 'undefined') {
      if (message) {
        sessionStorage.setItem('authMessage', message);
      }
      window.location.href = '/admin?auth=required';
    }
  }
}
