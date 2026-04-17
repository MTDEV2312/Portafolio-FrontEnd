type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

const SUPABASE_STORAGE_PATH = /\/storage\/v1\/(?:object\/public|render\/image\/public)\//;
const SUPABASE_BASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';

function resolveUrl(src: string): URL | null {
  if (typeof src !== 'string' || src.trim().length === 0) {
    return null;
  }

  try {
    return new URL(src);
  } catch {
    if (!src.startsWith('/storage/v1/')) {
      return null;
    }

    if (!SUPABASE_BASE_URL) {
      return null;
    }

    try {
      return new URL(src, SUPABASE_BASE_URL);
    } catch {
      return null;
    }
  }
}

export function isSupabaseStorageImage(src: string): boolean {
  const url = resolveUrl(src);
  return Boolean(url && SUPABASE_STORAGE_PATH.test(url.pathname));
}

export function buildImageUrl(src: string, options: ImageTransformOptions = {}): string {
  const url = resolveUrl(src);

  if (!url || !SUPABASE_STORAGE_PATH.test(url.pathname)) {
    return typeof src === 'string' && src.trim().length > 0 ? src : '/logo_myt.svg';
  }

  return url.toString();
}

export function buildImageSrcSet(src: string, widths: number[], options: ImageTransformOptions = {}): string | undefined {
  return undefined;
}