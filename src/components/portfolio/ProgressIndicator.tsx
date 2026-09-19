import { projects as fallbackProjects, type Project } from '../../data/projects';

interface Props {
  projects?: Project[];
  activeId: number;
  onSelect?: (id: number) => void;
}

export function ProgressIndicator({ projects = fallbackProjects, activeId, onSelect }: Props) {
  const scrollTo = (num: string, id: number) => {
    onSelect?.(id);
    const el = document.getElementById(`project-${num}`);
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile bottom pill indicator */}
      <nav
        className="progress-indicator-mobile show-mobile"
        aria-label="Mobile Projects Navigation"
      >
        {projects.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => scrollTo(p.num, p.id)}
              title={p.title}
              aria-label={`Proyecto ${p.num}: ${p.title}`}
              className="progress-mobile-dot"
            >
              <div className={`progress-mobile-bar ${isActive ? 'is-active' : ''}`} />
            </button>
          );
        })}
      </nav>

      {/* Desktop vertical sidebar rail */}
      <nav
        className="progress-indicator-desktop hide-mobile"
        aria-label="Desktop Projects Navigation"
      >
        {projects.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => scrollTo(p.num, p.id)}
              title={p.title}
              aria-label={`Proyecto ${p.num}: ${p.title}`}
              className="progress-desktop-btn"
            >
              <span className={`progress-dot-label ${isActive ? 'is-active' : ''}`}>
                {p.num}
              </span>
              <div className={`progress-desktop-bar ${isActive ? 'is-active' : ''}`} />
            </button>
          );
        })}
      </nav>
    </>
  );
}
