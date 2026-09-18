import { useIsMobile } from '../../hooks/useIsMobile';
import { projects as fallbackProjects, type Project } from '../../data/projects';

interface Props {
  projects?: Project[];
  activeId: number;
}

export function ProgressIndicator({ projects = fallbackProjects, activeId }: Props) {
  const isMobile = useIsMobile();

  const scrollTo = (num: string) => {
    document.getElementById(`project-${num}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isMobile) {
    return (
      <div
        className="progress-indicator"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(10,9,9,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(241,237,230,0.07)',
          padding: '8px 12px',
          borderRadius: '20px',
        }}
      >
        {projects.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => scrollTo(p.num)}
              title={p.title}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: isActive ? '16px' : '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: isActive ? '#AAFF00' : 'rgba(241,237,230,0.18)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="progress-indicator"
      style={{
        position: 'fixed',
        right: '28px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '7px',
      }}
    >
      {projects.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={() => scrollTo(p.num)}
            title={p.title}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              className="progress-dot-label"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '7px',
                letterSpacing: '0.1em',
                color: isActive ? '#AAFF00' : 'transparent',
                transition: 'color 0.35s',
                minWidth: '18px',
                textAlign: 'right',
              }}
            >
              {p.num}
            </span>
            <div
              style={{
                width: isActive ? '18px' : '4px',
                height: '4px',
                borderRadius: '2px',
                background: isActive ? '#AAFF00' : 'rgba(241,237,230,0.18)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
