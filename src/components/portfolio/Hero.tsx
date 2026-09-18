import { useEffect, useRef } from 'react';

/** Animated vertical line — decorative system element */
function SystemLine({
  x, y1, y2, opacity = 0.04,
}: {
  x: number; y1: number; y2: number; opacity?: number;
}) {
  return (
    <line
      x1={`${x}%`} y1={`${y1}%`}
      x2={`${x}%`} y2={`${y2}%`}
      stroke="#F1EDE6"
      strokeWidth="0.5"
      opacity={opacity}
    />
  );
}

interface HeroProps {
  name?: string;
  projectCount?: number;
}

export function Hero({
  name = 'MATHÍAS TERÁN',
  projectCount = 13,
}: HeroProps) {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle pulse on scroll indicator
    const el = scrollIndicatorRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '0.35';
      return;
    }

    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.012;
      const opacity = 0.25 + Math.sin(t) * 0.12;
      el.style.opacity = String(opacity);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'MATHÍAS';
  const lastName = nameParts.slice(1).join(' ') || 'TERÁN';

  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(20px, 5.5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Technical grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(241,237,230,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(241,237,230,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          zIndex: 0,
        }}
      />

      {/* SVG system diagram lines */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <SystemLine x={8}  y1={0} y2={100} opacity={0.03} />
        <SystemLine x={25} y1={0} y2={100} opacity={0.025} />
        <SystemLine x={50} y1={0} y2={100} opacity={0.02} />
        <SystemLine x={75} y1={0} y2={100} opacity={0.025} />
        <SystemLine x={92} y1={0} y2={100} opacity={0.03} />
        {/* Horizontal accent marks */}
        <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#F1EDE6" strokeWidth="0.3" opacity="0.03" />
        <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#F1EDE6" strokeWidth="0.3" opacity="0.03" />
      </svg>

      {/* Radial vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, #0A0909 100%)',
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: 'clamp(32px, 5vw, 48px)',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '1px',
              background: '#AAFF00',
              opacity: 0.8,
            }}
          />
          <p className="lbl-acid">Portfolio · 2026</p>
        </div>

        <h1
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(46px, 12vw, 160px)',
            lineHeight: 0.88,
            letterSpacing: '-0.038em',
            color: '#F1EDE6',
            marginBottom: 'clamp(24px, 4vw, 48px)',
            textTransform: 'uppercase',
            wordBreak: 'break-word',
          }}
        >
          {firstName}
          <br />
          {lastName}
        </h1>

        {/* Subtitle row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 2vw, 20px)',
            marginBottom: 'clamp(24px, 3.5vw, 36px)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(8.5px, 1.2vw, 10px)',
              letterSpacing: '0.18em',
              color: 'rgba(241,237,230,0.4)',
              textTransform: 'uppercase',
            }}
          >
            Fullstack Software Developer
          </span>
          <div
            style={{
              width: '24px',
              height: '1px',
              background: 'rgba(241,237,230,0.15)',
            }}
          />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(8px, 1vw, 9px)',
              letterSpacing: '0.14em',
              color: 'rgba(241,237,230,0.22)',
              textTransform: 'uppercase',
            }}
          >
            {projectCount} Projects
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            lineHeight: 1.7,
            color: 'rgba(241,237,230,0.44)',
            maxWidth: 'min(360px, 100%)',
          }}
        >
          Building web applications,
          <br />
          APIs and digital products.
        </p>
      </div>

      {/* Ghost number — decorative right, hidden on mobile */}
      <div
        aria-hidden
        className="hide-mobile"
        style={{
          position: 'absolute',
          right: '40px',
          bottom: '48px',
          zIndex: 1,
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(100px, 18vw, 220px)',
            lineHeight: 1,
            letterSpacing: '-0.055em',
            color: 'rgba(241,237,230,0.03)',
          }}
        >
          {projectCount}
        </div>
        <p className="lbl-mono" style={{ marginTop: '-8px' }}>Projects</p>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: 'clamp(24px, 4vw, 44px)',
          left: 'clamp(20px, 5.5vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, rgba(170,255,0,0.5), transparent)',
          }}
        />
        <p className="lbl-mono" style={{ fontSize: '8px' }}>Scroll to explore</p>
      </div>

      {/* Coordinates — hidden on mobile */}
      <div
        aria-hidden
        className="hide-mobile"
        style={{
          position: 'absolute',
          bottom: '44px',
          right: '80px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px',
          letterSpacing: '0.1em',
          color: 'rgba(241,237,230,0.1)',
          zIndex: 1,
          lineHeight: 1.6,
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div>40.4168° N</div>
        <div>3.7038° W</div>
      </div>
    </section>
  );
}
