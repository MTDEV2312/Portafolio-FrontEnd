import { useIsMobile } from '../../hooks/useIsMobile';

const CATEGORIES = [
  { name: 'Frontend',       items: ['React', 'Next.js', 'Astro', 'Vite', 'Tailwind CSS'] },
  { name: 'Backend',        items: ['Node.js', 'Express.js', 'NestJS', 'Flask'] },
  { name: 'Database',       items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'] },
  { name: 'Languages',      items: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
  { name: 'Infrastructure', items: ['Docker', 'Linux', 'Cloudflare', 'Git'] },
];

export function Technologies() {
  const isMobile = useIsMobile();

  return (
    <section
      className="section-border"
      style={{
        minHeight: '100vh',
        padding: isMobile ? '96px 24px 80px' : '120px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section marker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: isMobile ? '52px' : '72px',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #AAFF00, transparent)',
            opacity: 0.6,
          }}
        />
        <p className="lbl-acid">Technologies</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)',
          gap: isMobile ? '44px 20px' : '0',
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            style={{
              borderLeft:
                isMobile
                  ? i % 2 !== 0 ? '1px solid rgba(241,237,230,0.055)' : 'none'
                  : i > 0 ? '1px solid rgba(241,237,230,0.055)' : 'none',
              padding: isMobile
                ? i % 2 !== 0 ? '0 0 0 20px' : '0 20px 0 0'
                : '0 36px',
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(170,255,0,0.6)',
                textTransform: 'uppercase',
                marginBottom: '26px',
              }}
            >
              {cat.name.toUpperCase()}
            </p>
            <ul style={{ listStyle: 'none' }}>
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="tech-item"
                  style={{
                    fontSize: isMobile ? 'clamp(14px, 3.5vw, 18px)' : 'clamp(15px, 1.5vw, 24px)',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Decorative bottom accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: isMobile ? '24px' : '80px',
          right: isMobile ? '24px' : '80px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(170,255,0,0.1), transparent)',
        }}
      />
    </section>
  );
}
