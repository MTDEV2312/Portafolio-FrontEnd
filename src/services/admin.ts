// Servicios específicos para el panel de administración
const ADMIN_API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
    };
  };
}

export interface AdminProject {
  id: number;
  image_src: string;
  title: string;
  description: string;
  github_link?: string;
  live_demo_link?: string;
  techSection?: string; // Cambiado de tech_section a techSection para consistencia
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: number;
  nombre: string;
  perfilUrl: string; // Cambiado de perfil_url a perfilUrl para consistencia
  aboutMeDescription: string; // Cambiado de about_me_description a aboutMeDescription
  contactEmail: string; // Cambiado de contact_email a contactEmail
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message: string;
  data: T;
  error?: string;
}

// Gestión de autenticación
export class AdminAuthService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  static async login(email: string, password: string): Promise<AdminAuthResponse> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      this.setToken(data.data.session.access_token);
    }

    return data;
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${ADMIN_API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
    } finally {
      this.clearToken();
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Gestión de proyectos
export class AdminProjectService {
  static async getAll(): Promise<AdminProject[]> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/projects/read`);
    const data: ApiResponse<AdminProject[]> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener proyectos');
    }

    return data.data || [];
  }

  static async create(projectData: Partial<AdminProject>): Promise<AdminProject> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminAuthService.getToken()}`,
      },
      body: JSON.stringify(projectData),
    });

    const data: ApiResponse<AdminProject> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear proyecto');
    }

    return data.data;
  }

  static async update(id: number, projectData: Partial<AdminProject>): Promise<AdminProject> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/projects/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminAuthService.getToken()}`,
      },
      body: JSON.stringify(projectData),
    });

    const data: ApiResponse<AdminProject> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar proyecto');
    }

    return data.data;
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/projects/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AdminAuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Error al eliminar proyecto');
    }
  }
}

// Gestión de perfil
export class AdminProfileService {
  static async get(): Promise<AdminProfile | null> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/profiles/read`);
    const data: ApiResponse<AdminProfile> = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No existe perfil aún
      }
      throw new Error(data.error || 'Error al obtener perfil');
    }

    return data.data;
  }

  static async createOrUpdate(profileData: Partial<AdminProfile>): Promise<AdminProfile> {
    const response = await fetch(`${ADMIN_API_BASE_URL}/profiles/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminAuthService.getToken()}`,
      },
      body: JSON.stringify(profileData),
    });

    const data: ApiResponse<AdminProfile> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al guardar perfil');
    }

    return data.data;
  }
}

// Utilidades para el admin
export class AdminUtils {
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  static formatTechnologies(techSection: string): string[] {
    if (!techSection) return [];
    
    try {
      // Intentar parsear como JSON
      const parsed = JSON.parse(techSection);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Si no es JSON, dividir por comas
      return techSection.split(',').map(tech => tech.trim()).filter(Boolean);
    }
    
    return [];
  }

  static technologiesToString(technologies: string[]): string {
    return JSON.stringify(technologies);
  }
}

// Manejo de errores específico para admin
export class AdminError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AdminError';
  }
}

// Hook para manejar el estado de loading
export class AdminLoadingManager {
  private static loadingElements: Set<string> = new Set();

  static showLoading(elementId: string, message = 'Cargando...') {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #666;">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <p>${message}</p>
        </div>
      `;
      this.loadingElements.add(elementId);
    }
  }

  static hideLoading(elementId: string) {
    this.loadingElements.delete(elementId);
  }

  static isLoading(elementId: string): boolean {
    return this.loadingElements.has(elementId);
  }
}

// Sistema de notificaciones para admin
export class AdminNotifications {
  static show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        background: ${this.getBackgroundColor(type)};
        animation: slideInRight 0.3s ease;
      ">
        <i class="fas ${this.getIcon(type)}" style="margin-right: 10px;"></i>
        ${message}
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, duration);
  }

  private static getBackgroundColor(type: string): string {
    const colors: Record<string, string> = {
      success: '#27ae60',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db'
    };
    return colors[type] || colors.info;
  }

  private static getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'fa-check',
      error: 'fa-exclamation-triangle',
      warning: 'fa-exclamation',
      info: 'fa-info'
    };
    return icons[type] || icons.info;
  }
}

// CSS para las animaciones
const styles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
