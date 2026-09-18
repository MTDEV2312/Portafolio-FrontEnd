const CATEGORIES = [
  { name: 'Frontend',       items: ['React', 'Next.js', 'Astro', 'Vite', 'Tailwind CSS'] },
  { name: 'Backend',        items: ['Node.js', 'Express.js', 'NestJS', 'Flask'] },
  { name: 'Database',       items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'] },
  { name: 'Languages',      items: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
  { name: 'Infrastructure', items: ['Docker', 'Linux', 'Cloudflare', 'Git'] },
];

export function Technologies() {
  return (
    <section
      className="section-border"
      style={{
        minHeight: '100svh',
        padding: 'clamp(80px, 12vw, 120px) clamp(20px, 5.5vw, 80px)',
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
          marginBottom: 'clamp(36px, 5vw, 72px)',
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
        <h2 className="lbl-acid" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', lineHeight: 'inherit' }}>Technologies</h2>
      </div>

      <div className="tech-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="tech-col"
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(170,255,0,0.6)',
                textTransform: 'uppercase',
                marginBottom: '20px',
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
                    fontSize: 'clamp(14px, 1.35vw, 22px)',
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
          left: 'clamp(20px, 5.5vw, 80px)',
          right: 'clamp(20px, 5.5vw, 80px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(170,255,0,0.1), transparent)',
        }}
      />
    </section>
  );
}
