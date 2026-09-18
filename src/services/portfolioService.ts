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
    const matchedDbIds = new Set<string>();

    // Merge DB data into the 13 editorial presets
    const mappedProjects: Project[] = staticProjects.map((preset) => {
      const matchConfig = PRESET_KEYWORDS.find((k) => k.id === preset.id);
      const dbMatch = dbList.find((dbItem) => {
        const titleLower = (dbItem.title || '').toLowerCase();
        return matchConfig?.keys.some((key) => titleLower.includes(key));
      });

      if (!dbMatch) {
        return preset;
      }

      matchedDbIds.add(dbMatch.id);

      const parsedTech = formatTechnologies(dbMatch.techSection || dbMatch.tech_section);

      return {
        ...preset,
        description: dbMatch.description || preset.description,
        technologies: parsedTech.length > 0 ? parsedTech : preset.technologies,
        image: dbMatch.image_src || preset.image,
        imageAlt: dbMatch.image_alt || dbMatch.title || preset.imageAlt,
        githubLink: dbMatch.github_link || undefined,
        liveDemoLink: dbMatch.live_demo_link || undefined,
        supabaseId: dbMatch.id,
      };
    });

    // Append any extra projects created via Admin that don't belong to the initial 13
    const extraProjects = dbList.filter((dbItem) => !matchedDbIds.has(dbItem.id));
    extraProjects.forEach((extra) => {
      const indexNumber = mappedProjects.length + 1;
      const numStr = String(indexNumber).padStart(2, '0');
      const parsedTech = formatTechnologies(extra.techSection || extra.tech_section);

      mappedProjects.push({
        id: indexNumber,
        num: numStr,
        title: extra.title || `Proyecto ${numStr}`,
        shortTitle: extra.title || `Proyecto ${numStr}`,
        category: 'FULLSTACK / PROJECT',
        description: extra.description || '',
        technologies: parsedTech.length > 0 ? parsedTech : ['Fullstack'],
        image: extra.image_src || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&auto=format',
        imageAlt: extra.image_alt || extra.title || `Project ${numStr}`,
        layout: CYCLIC_LAYOUTS[(indexNumber - 1) % CYCLIC_LAYOUTS.length],
        githubLink: extra.github_link || undefined,
        liveDemoLink: extra.live_demo_link || undefined,
        supabaseId: extra.id,
      });
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
