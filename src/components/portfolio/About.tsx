import { useIsMobile } from '../../hooks/useIsMobile';

interface AboutProps {
  bio?: string;
}

export function About({ bio }: AboutProps) {
  const isMobile = useIsMobile();
  const pad = isMobile ? '96px 24px 80px' : '140px 80px';

  return (
    <section
      id="about"
      className="section-border"
      style={{
        minHeight: '100vh',
        padding: pad,
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
          right: isMobile ? '-12px' : '-36px',
          top: '16px',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isMobile ? '22vw' : 'clamp(130px, 20vw, 300px)',
          lineHeight: 1,
          letterSpacing: '-0.055em',
          color: 'rgba(241,237,230,0.028)',
          userSelect: 'none',
          pointerEvents: 'none',
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
          marginBottom: isMobile ? '40px' : '56px',
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
            fontSize: isMobile
              ? 'clamp(22px, 6.5vw, 36px)'
              : 'clamp(28px, 3.6vw, 56px)',
            lineHeight: 1.15,
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
            margin: isMobile ? '36px 0' : '52px 0',
          }}
        />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? '15px' : 'clamp(15px, 1.6vw, 21px)',
            lineHeight: 1.76,
            color: 'rgba(241,237,230,0.43)',
            maxWidth: '600px',
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
          bottom: isMobile ? '28px' : '44px',
          right: isMobile ? '24px' : '80px',
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
