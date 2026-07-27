// Cliente de Supabase directamente en el Frontend
// ponytail: cliente minimalista usando variables de entorno publicas
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY no configuradas.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
