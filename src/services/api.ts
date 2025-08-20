// Configuración de la API para SSG
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'https://backend-portafolio-q0ig.onrender.com/api';

// Variable global para rastrear el estado de la API
let apiStatus: 'unknown' | 'available' | 'unavailable' = 'unknown';

// Función para obtener el estado de la API
export function getApiStatus() {
  return apiStatus;
}

// Tipos TypeScript para los datos
export interface Project {
  id: number;
  image_src: string;
  title: string;
  description: string;
  github_link?: string;
  live_demo_link?: string;
  techSection?: string; // Cambiado de tech_section a techSection
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  nombre: string;
  perfilUrl: string;
  aboutMeDescription: string;
  contactEmail: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Función para obtener proyectos
export async function getProjects(): Promise<Project[]> {
  try {
    console.log(`🔄 Intentando obtener proyectos desde: ${API_BASE_URL}/projects/read`);
    
    const response = await fetch(`${API_BASE_URL}/projects/read`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout de 10 segundos para builds
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn(`⚠️ Error al obtener proyectos: ${response.status} ${response.statusText}`);
      apiStatus = 'unavailable';
      return fallbackProjects;
    }

    const apiResponse: ApiResponse<Project[]> = await response.json();
    const projects = apiResponse.data || [];
    
    apiStatus = 'available';
    console.log(`✅ ${projects.length} proyectos obtenidos desde la API`);
    
    return projects;
  } catch (error) {
    console.error('❌ Error al conectar con la API de proyectos:', error);
    apiStatus = 'unavailable';
    return fallbackProjects;
  }
}

// Función para obtener perfil
export async function getProfile(): Promise<Profile | null> {
  try {
    console.log(`🔄 Intentando obtener perfil desde: ${API_BASE_URL}/profiles/read`);
    
    const response = await fetch(`${API_BASE_URL}/profiles/read`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout de 10 segundos para builds
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn(`⚠️ Error al obtener perfil: ${response.status} ${response.statusText}`);
      apiStatus = 'unavailable';
      return fallbackProfile;
    }

    const apiResponse: ApiResponse<Profile> = await response.json();
    const profile = apiResponse.data;
    
    if (!profile) {
      console.log('ℹ️ No se encontró perfil en el backend, usando fallback');
      return fallbackProfile;
    }
    
    apiStatus = 'available';
    console.log('✅ Perfil obtenido desde la API');
    return profile;
  } catch (error) {
    console.error('❌ Error al conectar con la API de perfil:', error);
    apiStatus = 'unavailable';
    return fallbackProfile;
  }
}

// Función para formatear tecnologías desde tech_section
export function formatTechnologies(techSection?: string): string[] {
  if (!techSection) return [];
  
  // Intenta parsear como JSON primero
  try {
    const parsed = JSON.parse(techSection);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Si no es JSON válido, divide por comas
    return techSection.split(',').map(tech => tech.trim()).filter(Boolean);
  }
  
  return [];
}

// Datos de fallback para desarrollo/cuando la API no esté disponible
export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Una plataforma de comercio electrónico completa desarrollada con React y Node.js, que incluye gestión de productos, carrito de compras y sistema de pagos.",
    image_src: "/placeholder-project.jpg",
    github_link: "https://github.com/MTDEV2312/ecommerce-platform",
    live_demo_link: "https://ecommerce-demo.example.com",
    techSection: '["React", "Node.js", "MongoDB", "Stripe"]',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real, notificaciones y seguimiento de progreso.",
    image_src: "/placeholder-project.jpg",
    github_link: "https://github.com/MTDEV2312/task-manager",
    live_demo_link: "https://taskmanager-demo.example.com",
    techSection: '["Vue.js", "Express", "Socket.io", "PostgreSQL"]',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Dashboard meteorológico interactivo que muestra pronósticos en tiempo real con gráficos dinámicos y alertas personalizadas.",
    image_src: "/placeholder-project.jpg",
    github_link: "https://github.com/MTDEV2312/weather-dashboard",
    techSection: '["JavaScript", "Chart.js", "OpenWeather API"]',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Sitio web de portafolio personal desarrollado con Astro y Tailwind CSS, optimizado para rendimiento y accesibilidad.",
    image_src: "/placeholder-project.jpg",
    github_link: "https://github.com/MTDEV2312/portfolio",
    live_demo_link: "https://mathiasteran.dev",
    techSection: '["Astro", "Tailwind CSS", "TypeScript"]',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const fallbackProfile: Profile = {
  id: 1,
  nombre: "Mathias Teran",
  perfilUrl: "/placeholder-profile.jpg",
  aboutMeDescription: "Soy un desarrollador FullStack apasionado por crear soluciones web innovadoras y eficientes. Me especializo en el desarrollo tanto del frontend como del backend, utilizando las tecnologías más actuales del mercado.",
  contactEmail: "contacto@mathiasteran.dev",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
