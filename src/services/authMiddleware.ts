// AuthMiddleware: Maneja autenticación y logout

import { adminState } from './adminState';
import { DataManager } from './dataManager';

export class AuthMiddleware {
  /**
   * Realiza login
   */
  static async login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string } }> {
    const API_BASE_URL = import.meta.env?.PUBLIC_API_URL || '';
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    const token = data.data.session.access_token;
    const user = data.data.user;

    adminState.setToken(token, user);
    DataManager.invalidateAll(); // Limpiar cache al login

    return { token, user };
  }

  /**
   * Realiza logout
   */
  static async logout(): Promise<void> {
    const token = adminState.getToken();
    const API_BASE_URL = import.meta.env?.PUBLIC_API_URL || '';

    try {
      // Usar el token ANTES de limpiar la sesión
      if (token) {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
    } catch (error) {
      // Error al cerrar sesión - continuar de todas formas
    } finally {
      // Limpiar sesión local después de intentar el logout
      adminState.clearSession();
      DataManager.invalidateAll();
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
