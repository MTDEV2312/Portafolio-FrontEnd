import { useIsMobile } from '../../hooks/useIsMobile';

interface FooterProps {
  name?: string;
  email?: string;
}

export function Footer({
  name = 'Mathías Terán',
  email = 'agusmaty.a23@gmail.com',
}: FooterProps) {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        padding: isMobile ? '32px 28px' : '36px 80px',
        borderTop: '1px solid rgba(241,237,230,0.06)',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: isMobile ? '24px' : '0',
      }}
    >
      {/* Identity */}
      <div>
        <p
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.08em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {name}
        </p>
        <p className="lbl-mono" style={{ fontSize: '8px' }}>
          Fullstack Software Developer
        </p>
      </div>

      {/* Links */}
      <nav style={{ display: 'flex', gap: '28px' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/MTDEV2312' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/math%C3%ADas-ter%C3%A1n-236727290' },
          { label: 'Email', href: `mailto:${email}` },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="acid-link"
          >
            {l.label.toUpperCase()}
          </a>
        ))}
      </nav>

      {/* Copyright */}
      <p className="lbl-mono" style={{ fontSize: '8px' }}>
        © {new Date().getFullYear()} {name}
      </p>
    </footer>
  );
}
