const SUPABASE_STORAGE_PATH = /\/storage\/v1\/(?:object\/public|render\/image\/public)\//;
const SUPABASE_BASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_IMAGE_TRANSFORM_ENABLED =
  import.meta.env.PUBLIC_SUPABASE_IMAGE_TRANSFORM === 'true';

type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
};

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

function buildSupabaseImageUrl(url: URL, options?: ImageTransformOptions): string {
  if (!SUPABASE_IMAGE_TRANSFORM_ENABLED || !options || Object.keys(options).length === 0) {
    return url.toString();
  }

  const transformed = new URL(url.toString());

  if (transformed.pathname.includes('/storage/v1/object/public/')) {
    transformed.pathname = transformed.pathname.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/',
    );
  }

  const params = transformed.searchParams;
  if (options.width) params.set('width', String(options.width));
  if (options.height) params.set('height', String(options.height));
  if (options.quality) params.set('quality', String(options.quality));
  if (options.resize) params.set('resize', options.resize);
  if (options.format) params.set('format', options.format);

  return transformed.toString();
}

export function buildImageUrl(src: string, options?: ImageTransformOptions): string {
  const url = resolveUrl(src);

  if (!url || !SUPABASE_STORAGE_PATH.test(url.pathname)) {
    return typeof src === 'string' && src.trim().length > 0 ? src : '/logo_myt.svg';
  }

  return buildSupabaseImageUrl(url, options);
}

export function buildImageSrcSet(
  src: string,
  widths: number[],
  options?: Omit<ImageTransformOptions, 'width'>,
): string | undefined {
  const url = resolveUrl(src);

  if (!url || !SUPABASE_STORAGE_PATH.test(url.pathname)) {
    return undefined;
  }

  if (!SUPABASE_IMAGE_TRANSFORM_ENABLED) {
    return undefined;
  }

  return widths
    .map((width) => {
      const entry = buildSupabaseImageUrl(url, { ...options, width });
      return `${entry} ${width}w`;
    })
    .join(', ');
}