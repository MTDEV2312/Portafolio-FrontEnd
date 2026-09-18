import { useEffect, useState } from 'react';

interface HeaderProps {
  name?: string;
}

export function Header({ name = 'Mathías Terán' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`portfolio-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#" className="header-logo">{name}</a>

      <span className="header-subtitle hide-mobile">Fullstack Software Developer</span>

      <nav className="header-nav" aria-label="Main Navigation">
        {['About', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="header-link"
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
