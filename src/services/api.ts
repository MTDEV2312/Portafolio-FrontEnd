// Servicios de consulta directa a Supabase para el Frontend (SSG/Client)
// ponytail: ordenamiento por fecha de creacion descendente y cliente Supabase directo
import { supabase } from './supabase';

export interface Project {
  id: number;
  image_src?: string;
  imageSrc?: string;
  title: string;
  description: string;
  github_link?: string;
  githubLink?: string;
  live_demo_link?: string;
  liveDemoLink?: string;
  techSection?: string | string[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: number;
  nombre: string;
  perfilUrl: string;
  aboutMeDescription: string;
  contactEmail: string;
  created_at?: string;
  updated_at?: string;
}

let apiStatus: 'unknown' | 'available' | 'unavailable' = 'unknown';
let profilePromise: Promise<Profile | null> | null = null;
let projectsPromise: Promise<Project[]> | null = null;

export function getApiStatus() {
  return apiStatus;
}

export async function getProjects(): Promise<Project[]> {
  if (projectsPromise) return projectsPromise;

  projectsPromise = (async () => {
    try {
      // Ordenar por fecha de creación descendente (el más reciente primero)
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.warn('⚠️ Error al consultar proyectos en Supabase:', error.message);
        apiStatus = 'unavailable';
        return fallbackProjects;
      }

      apiStatus = 'available';
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageSrc: p.image_src,
        image_src: p.image_src,
        githubLink: p.github_link,
        github_link: p.github_link,
        liveDemoLink: p.live_demo_link,
        live_demo_link: p.live_demo_link,
        techSection: p.techSection || p.tech_section,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
      return mapped;
    } catch (err) {
      console.error('❌ Excepción al conectar con Supabase (proyectos):', err);
      apiStatus = 'unavailable';
      return fallbackProjects;
    }
  })();

  return projectsPromise;
}

export async function getProfile(): Promise<Profile | null> {
  if (profilePromise) return profilePromise;

  profilePromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('presentador')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ Error al consultar perfil en Supabase:', error.message);
        apiStatus = 'unavailable';
        return fallbackProfile;
      }

      if (!data) return fallbackProfile;

      apiStatus = 'available';
      return {
        id: data.id,
        nombre: data.nombre,
        perfilUrl: data.perfil_url || data.perfilUrl,
        aboutMeDescription: data.about_me_description || data.aboutMeDescription,
        contactEmail: data.contact_email || data.contactEmail,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (err) {
      console.error('❌ Excepción al conectar con Supabase (perfil):', err);
      apiStatus = 'unavailable';
      return fallbackProfile;
    }
  })();

  return profilePromise;
}

export function formatTechnologies(techSection?: string | string[]): string[] {
  if (!techSection) return [];
  if (Array.isArray(techSection)) {
    return techSection.map((tech) => String(tech).trim()).filter(Boolean);
  }
  if (typeof techSection === 'string') {
    try {
      const parsed = JSON.parse(techSection);
      if (Array.isArray(parsed)) {
        return parsed.map((tech) => String(tech).trim()).filter(Boolean);
      }
    } catch {
      return techSection.split(',').map((tech) => tech.trim()).filter(Boolean);
    }
  }
  return [];
}

export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con React y Node.js.",
    image_src: "/logo_myt.svg",
    github_link: "https://github.com/MTDEV2312/ecommerce-platform",
    live_demo_link: "https://ecommerce-demo.example.com",
    techSection: '["React", "Node.js", "MongoDB", "Stripe"]',
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicación de gestión de tareas en tiempo real.",
    image_src: "/logo_myt.svg",
    github_link: "https://github.com/MTDEV2312/task-manager",
    live_demo_link: "https://taskmanager-demo.example.com",
    techSection: '["Vue.js", "Express", "Socket.io", "PostgreSQL"]',
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Dashboard meteorológico interactivo en tiempo real.",
    image_src: "/logo_myt.svg",
    github_link: "https://github.com/MTDEV2312/weather-dashboard",
    techSection: '["JavaScript", "Chart.js", "OpenWeather API"]',
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Sitio web de portafolio personal desarrollado con Astro.",
    image_src: "/logo_myt.svg",
    github_link: "https://github.com/MTDEV2312/portfolio",
    live_demo_link: "https://mathiasteran.dev",
    techSection: '["Astro", "Tailwind CSS", "TypeScript"]',
  }
];

export const fallbackProfile: Profile = {
  id: 1,
  nombre: "Mathias Teran",
  perfilUrl: "/logo_myt.svg",
  aboutMeDescription: "Desarrollador FullStack apasionado por crear soluciones web innovadoras y eficientes.",
  contactEmail: "contacto@mathiasteran.dev",
};
