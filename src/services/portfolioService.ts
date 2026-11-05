import { supabase } from './supabase';
import { projects as staticProjects, type Project } from '../data/projects';
import { fallbackProfile, formatTechnologies, type Profile } from './api';

const PRESET_KEYWORDS = [
  { id: 1, keys: ['subscrip', 'suscrip'] },
  { id: 2, keys: ['homeos'] },
  { id: 3, keys: ['moda'] },
  { id: 4, keys: ['linkstash'] },
  { id: 5, keys: ['prima'] },
  { id: 6, keys: ['registration', 'matricula'] },
  { id: 7, keys: ['medical'] },
  { id: 8, keys: ['cine'] },
  { id: 9, keys: ['portafolio', 'portfolio'] },
  { id: 10, keys: ['python'] },
  { id: 11, keys: ['car rental', 'rental'] },
  { id: 12, keys: ['ticket'] },
  { id: 13, keys: ['conference', 'conferencia'] },
];

const CYCLIC_LAYOUTS: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'> = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
];

export interface PortfolioData {
  projects: Project[];
  profile: Profile;
}

/**
 * Service to fetch and harmonize Supabase portfolio data with high-fidelity UI layouts.
 * Guarantees SSG stability and fails gracefully to static presets if Supabase is offline.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const [projectsRes, profileRes] = await Promise.all([
      supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false }),
      supabase
        .from('presentador')
        .select('*')
        .limit(1)
        .maybeSingle(),
    ]);

    // Handle Profile
    let profile: Profile = fallbackProfile;
    if (!profileRes.error && profileRes.data) {
      profile = {
        id: profileRes.data.id,
        nombre: profileRes.data.nombre || fallbackProfile.nombre,
        perfilUrl: profileRes.data.perfil_url || fallbackProfile.perfilUrl,
        aboutMeDescription:
          profileRes.data.about_me_description || fallbackProfile.aboutMeDescription,
        contactEmail: profileRes.data.contact_email || fallbackProfile.contactEmail,
        created_at: profileRes.data.created_at,
        updated_at: profileRes.data.updated_at,
      };
    }

    // Handle Projects
    if (projectsRes.error || !projectsRes.data || projectsRes.data.length === 0) {
      console.warn('⚠️ Usando proyectos estáticos como fallback:', projectsRes.error?.message);
      return { projects: staticProjects, profile };
    }

    const dbList = projectsRes.data;
    const matchedPresetIds = new Set<number>();

    // Map exclusively the projects returned by Supabase, enriching with editorial presets when matched
    const mappedProjects: Project[] = dbList.map((dbItem, index) => {
      const indexNumber = index + 1;
      const numStr = String(indexNumber).padStart(2, '0');
      const parsedTech = formatTechnologies(dbItem.techSection || dbItem.tech_section);

      const preset = staticProjects.find((p) => {
        if (matchedPresetIds.has(p.id)) return false;
        if (p.supabaseId && dbItem.id === p.supabaseId) return true;
        const matchConfig = PRESET_KEYWORDS.find((k) => k.id === p.id);
        const titleLower = (dbItem.title || '').toLowerCase();
        return matchConfig?.keys.some((key) => titleLower.includes(key));
      });

      if (preset) {
        matchedPresetIds.add(preset.id);
        return {
          ...preset,
          num: numStr,
          title: dbItem.title || preset.title,
          shortTitle: dbItem.title || preset.shortTitle,
          description: dbItem.description || preset.description,
          technologies: parsedTech.length > 0 ? parsedTech : preset.technologies,
          image: dbItem.image_src || preset.image,
          imageAlt: dbItem.image_alt || dbItem.title || preset.imageAlt,
          githubLink: dbItem.github_link || undefined,
          liveDemoLink: dbItem.live_demo_link || undefined,
          supabaseId: dbItem.id,
        };
      }

      return {
        id: 1000 + indexNumber,
        num: numStr,
        title: dbItem.title || `Project ${numStr}`,
        shortTitle: dbItem.title || `Project ${numStr}`,
        category: 'FULLSTACK / PROJECT',
        description: dbItem.description || '',
        technologies: parsedTech.length > 0 ? parsedTech : ['Fullstack'],
        image:
          dbItem.image_src ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&auto=format',
        imageAlt: dbItem.image_alt || dbItem.title || `Project ${numStr}`,
        layout: CYCLIC_LAYOUTS[(indexNumber - 1) % CYCLIC_LAYOUTS.length],
        githubLink: dbItem.github_link || undefined,
        liveDemoLink: dbItem.live_demo_link || undefined,
        supabaseId: dbItem.id,
      };
    });

    return {
      projects: mappedProjects,
      profile,
    };
  } catch (err) {
    console.error('❌ Excepción en getPortfolioData:', err);
    return {
      projects: staticProjects,
      profile: fallbackProfile,
    };
  }
}
