import { useIsMobile } from '../../hooks/useIsMobile';

interface ContactProps {
  email?: string;
}

export function Contact({ email = 'agusmaty.a23@gmail.com' }: ContactProps) {
  const isMobile = useIsMobile();

  const links = [
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'GitHub', value: 'github.com/MTDEV2312', href: 'https://github.com/MTDEV2312' },
    { label: 'LinkedIn', value: 'linkedin.com/in/mathiasteran', href: 'https://www.linkedin.com/in/math%C3%ADas-ter%C3%A1n-236727290' },
  ];

  return (
    <section
      id="contact"
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
      {/* Ghost word */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '16px',
          left: isMobile ? '24px' : '80px',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: isMobile ? '20vw' : 'clamp(80px, 14.5vw, 210px)',
          lineHeight: 0.88,
          letterSpacing: '-0.055em',
          color: 'rgba(241,237,230,0.022)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        CONTACT
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
        {/* Section marker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '36px',
              background: 'linear-gradient(to bottom, #AAFF00, transparent)',
              opacity: 0.6,
            }}
          />
          <p className="lbl-acid">Let's work together</p>
        </div>

        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: isMobile
              ? 'clamp(42px, 12vw, 78px)'
              : 'clamp(58px, 8.5vw, 136px)',
            lineHeight: 0.86,
            letterSpacing: '-0.042em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            marginBottom: isMobile ? '28px' : '36px',
          }}
        >
          LET'S BUILD
          <br />
          SOMETHING.
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '15px',
            color: 'rgba(241,237,230,0.4)',
            marginBottom: isMobile ? '44px' : '60px',
          }}
        >
          Have a project, idea or opportunity?
        </p>

        {/* Contact rows */}
        <div>
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'baseline',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '4px' : '24px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(241,237,230,0.055)',
                borderTop: i === 0 ? '1px solid rgba(241,237,230,0.055)' : 'none',
                padding: isMobile ? '18px 0' : '22px 0',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = 'rgba(170,255,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = 'rgba(241,237,230,0.055)';
              }}
            >
              <span
                className="lbl-mono"
                style={{ minWidth: '76px', flexShrink: 0 }}
              >
                {link.label.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 500,
                  fontSize: isMobile
                    ? 'clamp(14px, 4vw, 20px)'
                    : 'clamp(17px, 2.3vw, 34px)',
                  color: '#F1EDE6',
                  letterSpacing: '-0.01em',
                }}
              >
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
