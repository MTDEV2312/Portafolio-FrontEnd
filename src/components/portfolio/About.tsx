interface AboutProps {
  bio?: string;
}

export function About({ bio }: AboutProps) {
  return (
    <section
      id="about"
      className="section-border"
      style={{
        minHeight: '100svh',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5.5vw, 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost word */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 'clamp(-10px, 2vw, 20px)',
          top: '16px',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(60px, 18vw, 240px)',
          lineHeight: 1,
          letterSpacing: '-0.055em',
          color: 'rgba(241,237,230,0.028)',
          userSelect: 'none',
          pointerEvents: 'none',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        ABOUT
      </div>

      {/* Section marker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: 'clamp(32px, 4.5vw, 56px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #AAFF00, transparent)', opacity: 0.6 }} />
        <h2 className="lbl-acid" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', lineHeight: 'inherit' }}>About</h2>
      </div>

      <div style={{ maxWidth: '980px', position: 'relative', zIndex: 1 }}>
        {/* Primary statement — editorial breaks */}
        <p
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(22px, 4vw, 50px)',
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            color: '#F1EDE6',
          }}
        >
          {bio || (
            <>
              I'm a FullStack Software Developer{' '}
              <span style={{ color: 'rgba(241,237,230,0.28)' }}>
                focused on building modern web applications,
              </span>{' '}
              APIs and digital products.
            </>
          )}
        </p>

        <div
          style={{
            width: '44px',
            height: '1px',
            background: 'rgba(241,237,230,0.13)',
            margin: 'clamp(28px, 4vw, 52px) 0',
          }}
        />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(14px, 1.6vw, 19px)',
            lineHeight: 1.76,
            color: 'rgba(241,237,230,0.43)',
            maxWidth: 'min(600px, 100%)',
          }}
        >
          I enjoy working across the stack — from interactive interfaces and
          backend systems to databases, automation and infrastructure.
        </p>
      </div>

      {/* Bottom-right acid accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 4vw, 44px)',
          right: 'clamp(20px, 5.5vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(170,255,0,0.3), transparent)',
            alignSelf: 'flex-end',
          }}
        />
        <p className="lbl-acid">Available for work</p>
      </div>
    </section>
  );
}
