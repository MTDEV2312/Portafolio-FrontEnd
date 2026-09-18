import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const S = {
  header: (scrolled: boolean): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px',
    borderBottom: `1px solid ${scrolled ? 'rgba(241,237,230,0.06)' : 'transparent'}`,
    backgroundColor: scrolled ? 'rgba(10,9,9,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    transition: 'background-color 0.5s, border-color 0.5s, backdrop-filter 0.5s',
  }),
  name: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.08em',
    color: '#F1EDE6',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
  },
  subtitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.16em',
    color: 'rgba(241,237,230,0.32)',
    textTransform: 'uppercase' as const,
  },
  navLink: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '9px',
    letterSpacing: '0.16em',
    color: 'rgba(241,237,230,0.42)',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    transition: 'color 0.2s',
  },
};

interface HeaderProps {
  name?: string;
}

export function Header({ name = 'Mathías Terán' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={S.header(scrolled)}>
      <a href="#" style={S.name}>{name}</a>

      {!isMobile && (
        <span style={S.subtitle}>Fullstack Software Developer</span>
      )}

      <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {['About', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={S.navLink}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#AAFF00')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(241,237,230,0.42)')}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
