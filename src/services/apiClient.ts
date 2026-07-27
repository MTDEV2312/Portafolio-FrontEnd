// ApiClient: Consultas directas a Supabase + disparador de Vercel Deploy Hook
// ponytail: orden por created_at desc e integracion con webhook de Vercel para rebuilds
import { supabase } from './supabase';

async function triggerVercelDeployHook() {
  const hookUrl = import.meta.env.PUBLIC_VERCEL_DEPLOY_HOOK;
  if (!hookUrl) {
    return;
  }

  try {
    console.log('🚀 Disparando Vercel Deploy Hook para reconstruir el sitio...');
    await fetch(hookUrl, { method: 'POST' });
  } catch (err) {
    console.error('❌ Error al invocar Vercel Deploy Hook:', err);
  }
}

export class ApiClient {
  /**
   * GET genérico de recursos de administración
   */
  static async get<T>(endpoint: string): Promise<T> {
    if (endpoint.includes('/projects/read')) {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false });
      if (error) throw new Error(error.message);
      
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
        tech_section: p.tech_section || p.techSection,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
      return mapped as unknown as T;
    }

    if (endpoint.includes('/profiles/read')) {
      const { data, error } = await supabase
        .from('presentador')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null as unknown as T;

      return {
        id: data.id,
        nombre: data.nombre,
        perfilUrl: data.perfil_url || data.perfilUrl,
        aboutMeDescription: data.about_me_description || data.aboutMeDescription,
        contactEmail: data.contact_email || data.contactEmail,
      } as unknown as T;
    }

    throw new Error(`Endpoint no soportado: ${endpoint}`);
  }

  /**
   * POST de recursos (crear/actualizar perfil)
   */
  static async post<T>(endpoint: string, body?: any): Promise<T> {
    if (endpoint.includes('/profiles/create')) {
      const { data: existing } = await supabase.from('presentador').select('id').limit(1).maybeSingle();
      
      const payload = {
        nombre: body.nombre,
        contact_email: body.contactEmail,
        perfil_url: body.perfilUrl,
        about_me_description: body.aboutMeDescription,
      };

      let resData, resErr;
      if (existing) {
        ({ data: resData, error: resErr } = await supabase
          .from('presentador')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single());
      } else {
        ({ data: resData, error: resErr } = await supabase
          .from('presentador')
          .insert(payload)
          .select()
          .single());
      }

      if (resErr) throw new Error(resErr.message);

      // Disparar rebuild de Vercel tras guardar el perfil
      await triggerVercelDeployHook();

      return resData as unknown as T;
    }

    throw new Error(`Endpoint POST no soportado: ${endpoint}`);
  }

  /**
   * Petición para crear / editar / eliminar proyectos
   */
  static async request<T>(endpoint: string, options: { method?: string; body?: any } = {}): Promise<T> {
    const { method = 'GET', body } = options;

    if (endpoint.includes('/projects/create')) {
      const res = await this.handleProjectSave(null, body);
      await triggerVercelDeployHook();
      return res as unknown as T;
    }

    if (endpoint.includes('/projects/update/')) {
      const id = endpoint.split('/projects/update/')[1];
      const res = await this.handleProjectSave(id, body);
      await triggerVercelDeployHook();
      return res as unknown as T;
    }

    if (endpoint.includes('/projects/delete/') || (method === 'DELETE' && endpoint.includes('/projects/'))) {
      const id = endpoint.split('/projects/delete/')[1] || endpoint.split('/').pop();
      const { error } = await supabase.from('proyectos').delete().eq('id', id);
      if (error) throw new Error(error.message);

      await triggerVercelDeployHook();
      return { success: true } as unknown as T;
    }

    throw new Error(`Operación no soportada: ${endpoint}`);
  }

  /**
   * Guardar proyecto (crear o actualizar) con subida opcional a Supabase Storage
   */
  private static async handleProjectSave(id: string | null, body: FormData | any) {
    let title = '';
    let description = '';
    let techSection = '';
    let githubLink = '';
    let liveDemoLink = '';
    let imageFile: File | null = null;

    if (body instanceof FormData) {
      title = body.get('title') as string || '';
      description = body.get('description') as string || '';
      techSection = body.get('techSection') as string || '';
      githubLink = body.get('githubLink') as string || '';
      liveDemoLink = body.get('liveDemoLink') as string || '';
      const fileCandidate = body.get('image');
      if (fileCandidate && fileCandidate instanceof File && fileCandidate.size > 0) {
        imageFile = fileCandidate;
      }
    } else {
      title = body.title || '';
      description = body.description || '';
      techSection = body.techSection || '';
      githubLink = body.githubLink || '';
      liveDemoLink = body.liveDemoLink || '';
    }

    let imageSrc = '';
    let storagePath = '';

    if (imageFile) {
      const timestamp = Date.now();
      const sanitized = imageFile.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
      const path = `projects/${timestamp}_${sanitized}`;

      const { error: uploadErr } = await supabase.storage
        .from('Images')
        .upload(path, imageFile, { upsert: true, cacheControl: '31536000' });

      if (uploadErr) {
        throw new Error(`Error al subir imagen a Storage: ${uploadErr.message}`);
      }

      const { data: publicUrlData } = supabase.storage.from('Images').getPublicUrl(path);
      imageSrc = publicUrlData.publicUrl;
      storagePath = path;
    }

    const payload: Record<string, any> = {
      title,
      description,
      techSection,
      github_link: githubLink,
      live_demo_link: liveDemoLink,
    };

    if (imageSrc) {
      payload.image_src = imageSrc;
      payload.storage_path = storagePath;
    }

    let data, error;
    if (id) {
      ({ data, error } = await supabase
        .from('proyectos')
        .update(payload)
        .eq('id', id)
        .select());
    } else {
      ({ data, error } = await supabase
        .from('proyectos')
        .insert([payload])
        .select());
    }

    if (error) throw new Error(error.message);
    return data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  static invalidateCache(_endpoint: string) {}
}
