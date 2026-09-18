interface ContactProps {
  email?: string;
}

export function Contact({ email = 'agusmaty.a23@gmail.com' }: ContactProps) {
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
        minHeight: '100svh',
        padding: 'clamp(80px, 12vw, 120px) clamp(20px, 5.5vw, 80px)',
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
          left: 'clamp(20px, 5.5vw, 80px)',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(46px, 14vw, 180px)',
          lineHeight: 0.88,
          letterSpacing: '-0.055em',
          color: 'rgba(241,237,230,0.022)',
          userSelect: 'none',
          pointerEvents: 'none',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        CONTACT
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', width: '100%' }}>
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
            fontSize: 'clamp(36px, 9vw, 120px)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            marginBottom: 'clamp(20px, 3.5vw, 36px)',
            wordBreak: 'break-word',
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
            marginBottom: 'clamp(32px, 4.5vw, 60px)',
          }}
        >
          Have a project, idea or opportunity?
        </p>

        {/* Contact rows */}
        <div style={{ width: '100%' }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-row"
            >
              <span
                className="lbl-mono"
                style={{ minWidth: '76px', flexShrink: 0 }}
              >
                {link.label.toUpperCase()}
              </span>
              <span className="contact-row-value">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
