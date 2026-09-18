import { useEffect, useRef, useCallback } from 'react';
import type { Project } from '../../data/projects';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useScrollRatio } from '../../hooks/useScrollRatio';

// ─────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────

function GhostNum({
  num,
  style,
}: {
  num: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className="par-ghost"
      style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        color: 'rgba(241,237,230,0.042)',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {num}
    </div>
  );
}

function CategoryLabel({ text }: { text: string }) {
  return (
    <p className="lbl-acid par-meta" style={{ marginBottom: '16px' }}>
      {text}
    </p>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="par-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '24px' }}>
      {items.map((t) => (
        <span key={t} className="tech-tag">{t}</span>
      ))}
    </div>
  );
}

function ActionLinks({
  githubLink,
  liveDemoLink,
  style,
}: {
  githubLink?: string;
  liveDemoLink?: string;
  style?: React.CSSProperties;
}) {
  if (!githubLink && !liveDemoLink) return null;
  return (
    <div
      className="par-meta"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginTop: '18px',
        ...style,
      }}
    >
      {liveDemoLink && (
        <a
          href={liveDemoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="acid-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <span>LIVE DEMO</span>
          <span aria-hidden style={{ fontSize: '10px', lineHeight: 1 }}>↗</span>
        </a>
      )}
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="acid-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
        >
          <span>SOURCE CODE</span>
          <span aria-hidden style={{ fontSize: '10px', lineHeight: 1 }}>↗</span>
        </a>
      )}
    </div>
  );
}

function Desc({ text, maxWidth = '400px' }: { text: string; maxWidth?: string }) {
  return (
    <p
      className="par-meta"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: '13.5px',
        lineHeight: 1.78,
        color: 'rgba(241,237,230,0.46)',
        maxWidth,
      }}
    >
      {text}
    </p>
  );
}

function BrowserImg({
  src,
  alt,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  height: string | number;
  priority?: boolean;
}) {
  return (
    <div className="img-wrap" style={{ height, display: 'flex', flexDirection: 'column' }}>
      <div className="browser-bar">
        <div className="browser-dot" style={{ background: '#FF5F57' }} />
        <div className="browser-dot" style={{ background: '#FEBC2E' }} />
        <div className="browser-dot" style={{ background: '#28C840' }} />
        <div
          style={{
            flex: 1,
            height: '12px',
            background: 'rgba(241,237,230,0.06)',
            borderRadius: '6px',
            marginLeft: '8px',
          }}
        />
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div className="par-img">
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

function PlainImg({
  src,
  alt,
  height,
  style,
  priority = false,
}: {
  src: string;
  alt: string;
  height: string | number;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  return (
    <div className="img-wrap" style={{ height, position: 'relative', overflow: 'hidden', ...style }}>
      <div className="par-img">
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Project-specific visual elements
// ─────────────────────────────────────────────

/** API terminal panel — Project 05 (Prima S.A. API) */
function ApiPanel() {
  const rows: Array<{ method: string; path: string; status: string; ms: string }> = [
    { method: 'GET',    path: '/api/v1/sales',           status: '200', ms: '124ms' },
    { method: 'POST',   path: '/api/v1/inventory',        status: '201', ms: '89ms' },
    { method: 'GET',    path: '/api/v1/customers',        status: '200', ms: '67ms' },
    { method: 'PUT',    path: '/api/v1/products/5',       status: '204', ms: '143ms' },
    { method: 'DELETE', path: '/api/v1/stock/12',         status: '200', ms: '55ms' },
    { method: 'GET',    path: '/api/v1/reports/monthly',  status: '200', ms: '211ms' },
  ];

  return (
    <div
      style={{
        background: '#0E0D0C',
        border: '1px solid rgba(241,237,230,0.07)',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Terminal header */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(241,237,230,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FF5F57', opacity: 0.5 }} />
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FEBC2E', opacity: 0.5 }} />
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28C840', opacity: 0.5 }} />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '8px',
            letterSpacing: '0.1em',
            color: 'rgba(241,237,230,0.25)',
            marginLeft: '8px',
          }}
        >
          prima-api — curl
        </span>
      </div>

      {rows.map((r, i) => (
        <div key={i} className="api-row">
          <span
            className={`api-method-${r.method}`}
            style={{ minWidth: '56px', letterSpacing: '0.06em' }}
          >
            {r.method}
          </span>
          <span style={{ color: 'rgba(241,237,230,0.6)', flex: 1, letterSpacing: '0.02em' }}>
            {r.path}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '8px',
              color: 'rgba(241,237,230,0.22)',
              marginRight: '16px',
            }}
          >
            {r.ms}
          </span>
          <span className="api-status-2xx" style={{ fontSize: '9px' }}>
            {r.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/** AR tracking visualization — Project 10 (Pythonra) */
function ArViz() {
  const markers = [
    { x: 28, y: 30, id: 'id:042', size: 52 },
    { x: 67, y: 58, id: 'id:017', size: 44 },
    { x: 20, y: 68, id: 'id:031', size: 36 },
    { x: 78, y: 22, id: 'id:009', size: 48 },
  ];

  return (
    <div className="ar-frame">
      <div className="ar-scanlines" />
      <div className="ar-grid" />

      {/* Center crosshair */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '20px',
          height: '20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(170,255,0,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(170,255,0,0.3)',
          }}
        />
      </div>

      {markers.map((m, i) => (
        <div
          key={i}
          className="ar-marker"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          <div
            style={{
              position: 'relative',
              width: `${m.size}px`,
              height: `${m.size}px`,
              transform: 'translate(-50%,-50%)',
            }}
          >
            <div className="ar-corner ar-corner-tl" />
            <div className="ar-corner ar-corner-tr" />
            <div className="ar-corner ar-corner-bl" />
            <div className="ar-corner ar-corner-br" />

            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#AAFF00',
                transform: 'translate(-50%,-50%)',
                opacity: 0.8,
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: `${m.size / 2 + 4}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '7px',
              letterSpacing: '0.08em',
              color: '#AAFF00',
              opacity: 0.75,
              whiteSpace: 'nowrap',
            }}
          >
            {m.id}
          </div>
        </div>
      ))}

      {/* Coordinate readout */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '7px',
          color: 'rgba(170,255,0,0.5)',
          lineHeight: 1.6,
        }}
      >
        <div>X: 348.2px</div>
        <div>Y: 291.7px</div>
        <div>FPS: 30</div>
      </div>

      {/* REC indicator */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px',
          color: 'rgba(241,237,230,0.4)',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#AAFF00',
            opacity: 0.7,
          }}
        />
        LIVE
      </div>
    </div>
  );
}

/** Ticket lifecycle flow — Project 12 */
function TicketFlow() {
  const stages = [
    { label: 'TICKET', num: '01', desc: 'Submitted' },
    { label: 'ASSIGN', num: '02', desc: 'Triaged' },
    { label: 'PROCESS', num: '03', desc: 'In progress' },
    { label: 'RESOLVE', num: '04', desc: 'Closed' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
      {stages.map((s, i) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={`ticket-stage ${i === 3 ? 'ticket-stage-active' : ''}`}
          >
            <p className="lbl-mono" style={{ fontSize: '7px', marginBottom: '4px' }}>{s.num}</p>
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: i === 3 ? '#AAFF00' : 'rgba(241,237,230,0.75)',
              }}
            >
              {s.label}
            </p>
            <p className="lbl-mono" style={{ fontSize: '7px', color: 'rgba(241,237,230,0.25)', marginTop: '4px' }}>
              {s.desc}
            </p>
          </div>
          {i < stages.length - 1 && (
            <div
              style={{
                width: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  background: 'rgba(241,237,230,0.1)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '-3px',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid rgba(241,237,230,0.1)',
                    borderTop: '3px solid transparent',
                    borderBottom: '3px solid transparent',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Cinema seat grid (Project 08)
// ─────────────────────────────────────────────
function SeatGrid() {
  const ROWS = 7;
  const COLS = 12;
  return (
    <div>
      <p
        className="lbl-mono"
        style={{ marginBottom: '12px', textAlign: 'center', fontSize: '8px' }}
      >
        SCREEN
      </p>
      <div
        style={{
          width: '100%',
          height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(170,255,0,0.5), transparent)',
          marginBottom: '16px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {Array.from({ length: COLS }, (_, c) => {
              const reserved = (r * COLS + c) % 5 === 0;
              const selected = r === 3 && c >= 4 && c <= 7;
              const aisle = c === 5;
              return (
                <div
                  key={c}
                  style={{
                    width: '13px',
                    height: '10px',
                    borderRadius: '2px 2px 0 0',
                    background: selected
                      ? '#AAFF00'
                      : reserved
                        ? 'rgba(241,237,230,0.05)'
                        : 'rgba(241,237,230,0.18)',
                    marginLeft: aisle ? '8px' : '0',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p
        className="lbl-mono"
        style={{
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '7px',
          color: 'rgba(170,255,0,0.55)',
        }}
      >
        4 SEATS SELECTED · ROW D
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Layout variants
// ─────────────────────────────────────────────

/** Layout A — Ghost num left · title center · browser screenshot right */
function LayoutA({ p, totalProjects = 13 }: { p: Project; totalProjects?: number }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '0 80px',
        display: 'grid',
        gridTemplateColumns: '18% 1fr 46%',
        alignItems: 'center',
        gap: '0 28px',
        position: 'relative',
      }}
    >
      {/* Ghost number — col 1, very tall */}
      <GhostNum
        num={p.num}
        style={{
          gridColumn: '1',
          alignSelf: 'center',
          fontSize: 'clamp(120px, 16vw, 240px)',
        }}
      />

      {/* Text — col 2 */}
      <div style={{ gridColumn: '2', paddingRight: '16px', zIndex: 1 }}>
        <CategoryLabel text={p.category} />
        <h2
          className="par-title"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(44px, 5.5vw, 92px)',
            lineHeight: 0.88,
            letterSpacing: '-0.038em',
            color: '#F1EDE6',
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
            marginBottom: '36px',
          }}
        >
          {p.shortTitle || p.title}
        </h2>
        <div
          style={{
            width: '32px',
            height: '1px',
            background: 'rgba(241,237,230,0.16)',
            marginBottom: '22px',
          }}
        />
        <Desc text={p.description} />
        <Tags items={p.technologies} />
        <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
      </div>

      {/* Browser screenshot — col 3 */}
      <div style={{ gridColumn: '3', height: 'clamp(340px, 54vh, 580px)', zIndex: 1 }}>
        <BrowserImg src={p.image} alt={p.imageAlt} height="100%" priority={p.id === 1} />
      </div>

      {/* Counter */}
      <p
        className="lbl-mono"
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '80px',
          fontSize: '8px',
        }}
      >
        {p.num} / {String(totalProjects).padStart(2, '0')}
      </p>
    </div>
  );
}

/** Layout B — Full-bleed image · text overlay bottom */
function LayoutB({ p }: { p: Project }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed image with parallax */}
      <div style={{ position: 'absolute', inset: '-50px', zIndex: 0 }}>
        <div className="par-img" style={{ inset: 0 }}>
          <img
            src={p.image}
            alt={p.imageAlt}
            loading={p.id === 1 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(30%) contrast(1.1) brightness(0.35)',
            }}
          />
        </div>
      </div>

      {/* Gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(10,9,9,0.97) 30%, rgba(10,9,9,0.22) 70%, rgba(10,9,9,0.6) 100%)',
          zIndex: 1,
        }}
      />

      {/* Ghost number — top right */}
      <GhostNum
        num={p.num}
        style={{
          position: 'absolute',
          top: '-16px',
          right: '16px',
          fontSize: 'clamp(140px, 20vw, 280px)',
          color: 'rgba(241,237,230,0.055)',
          zIndex: 1,
        }}
      />

      {/* Content — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          left: '80px',
          right: '80px',
          zIndex: 2,
        }}
      >
        <p className="lbl-acid" style={{ marginBottom: '14px' }}>{p.num}</p>
        <h2
          className="par-title"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(52px, 8.5vw, 130px)',
            lineHeight: 0.87,
            letterSpacing: '-0.038em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}
        >
          {p.title}
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="lbl-mono" style={{ marginBottom: '10px' }}>{p.category}</p>
            <Desc text={p.description} maxWidth="520px" />
            <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', flexShrink: 0 }}>
            {p.technologies.map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Layout C — Giant title top · image left + meta right below */
function LayoutC({ p }: { p: Project }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '100px 80px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GhostNum
        num={p.num}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '-16px',
          fontSize: 'clamp(130px, 20vw, 280px)',
        }}
      />

      {/* Top: label + giant title */}
      <div style={{ zIndex: 1 }}>
        <p className="lbl-acid" style={{ marginBottom: '18px' }}>
          {p.num} — {p.category}
        </p>
        <h2
          className="par-title"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(58px, 9.5vw, 150px)',
            lineHeight: 0.86,
            letterSpacing: '-0.042em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            maxWidth: '92%',
          }}
        >
          {p.title}
        </h2>
      </div>

      {/* Bottom: image left, info right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56% 1fr',
          gap: '48px',
          alignItems: 'end',
          zIndex: 1,
          marginTop: '48px',
        }}
      >
        <PlainImg src={p.image} alt={p.imageAlt} height="clamp(260px, 38vh, 460px)" priority={p.id === 1} />
        <div style={{ paddingBottom: '8px' }}>
          <Desc text={p.description} />
          <Tags items={p.technologies} />
          <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
        </div>
      </div>
    </div>
  );
}

/** Layout D — Image left · info right (with ticket-flow for project 12) */
function LayoutD({ p }: { p: Project }) {
  const isTicket = p.id === 12;

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '52% 1fr',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left: image */}
      <div className="img-wrap" style={{ height: '100vh', position: 'relative' }}>
        <div className="par-img">
          <img
            src={p.image}
            alt={p.imageAlt}
            loading={p.id === 1 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(20%) contrast(1.06) brightness(0.68)',
            }}
          />
        </div>
        {/* Feather right edge */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100px',
            background: 'linear-gradient(to right, transparent, #0A0909)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Right: info */}
      <div
        style={{
          padding: '0 60px 0 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <GhostNum
          num={p.num}
          style={{
            position: 'absolute',
            top: '28px',
            right: '-8px',
            fontSize: 'clamp(80px, 11vw, 170px)',
          }}
        />

        <CategoryLabel text={p.category} />

        <h2
          className="par-title"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 4.5vw, 78px)',
            lineHeight: 0.88,
            letterSpacing: '-0.034em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            whiteSpace: 'pre-line',
            marginBottom: '32px',
          }}
        >
          {p.shortTitle || p.title}
        </h2>

        <div
          style={{
            width: '28px',
            height: '1px',
            background: 'rgba(241,237,230,0.16)',
            marginBottom: '20px',
          }}
        />

        <Desc text={p.description} />

        {isTicket && (
          <div className="par-meta" style={{ marginTop: '28px' }}>
            <TicketFlow />
          </div>
        )}

        <Tags items={p.technologies} />
        <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
      </div>
    </div>
  );
}

/** Layout E — Centered visual · giant ghost number behind */
function LayoutE({ p }: { p: Project }) {
  const isApi = p.id === 5;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Very large ghost number */}
      <GhostNum
        num={p.num}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -54%)',
          fontSize: 'clamp(220px, 32vw, 440px)',
          letterSpacing: '-0.06em',
          color: 'rgba(241,237,230,0.038)',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      />

      <CategoryLabel text={p.category} />

      {/* Central visual */}
      <div
        className="par-title"
        style={{
          width: 'min(700px, 84%)',
          height: 'clamp(240px, 36vh, 420px)',
          border: '1px solid rgba(241,237,230,0.06)',
          zIndex: 1,
          marginBottom: '36px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isApi ? (
          <ApiPanel />
        ) : (
          <div style={{ position: 'relative', height: '100%' }}>
            <div className="par-img" style={{ inset: 0 }}>
              <img
                src={p.image}
                alt={p.imageAlt}
                loading={p.id === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          </div>
        )}
      </div>

      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(40px, 5.5vw, 90px)',
          lineHeight: 0.9,
          letterSpacing: '-0.035em',
          color: '#F1EDE6',
          textTransform: 'uppercase',
          whiteSpace: 'pre-line',
          zIndex: 1,
          marginBottom: '24px',
        }}
      >
        {p.shortTitle || p.title}
      </h2>

      <div
        className="par-meta"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', zIndex: 1 }}
      >
        {p.technologies.map((t) => (
          <span key={t} className="tech-tag">{t}</span>
        ))}
      </div>

      <Desc text={p.description} maxWidth="460px" />
      <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} style={{ zIndex: 1, justifyContent: 'center' }} />
    </div>
  );
}

/** Layout F — Asymmetric · title breaks left grid · image lower-right */
function LayoutF({ p }: { p: Project }) {
  const isAr = p.id === 10;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GhostNum
        num={p.num}
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: 'clamp(150px, 22vw, 310px)',
        }}
      />

      {/* Title — offset left, bleeds slightly */}
      <div
        style={{
          paddingTop: '72px',
          paddingLeft: '7%',
          maxWidth: '80%',
          marginBottom: '60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CategoryLabel text={p.category} />
        <h2
          className="par-title"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(46px, 7vw, 116px)',
            lineHeight: 0.87,
            letterSpacing: '-0.04em',
            color: '#F1EDE6',
            textTransform: 'uppercase',
            whiteSpace: 'pre-line',
          }}
        >
          {p.shortTitle || p.title}
        </h2>
      </div>

      {/* Two-column lower section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40% 1fr',
          gap: '48px',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ paddingLeft: '7%' }}>
          <Desc text={p.description} />
          <Tags items={p.technologies} />
          <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
        </div>

        {/* Image or AR viz — offset downward */}
        <div
          className={isAr ? '' : 'img-wrap'}
          style={{
            height: 'clamp(260px, 38vh, 460px)',
            transform: 'translateY(36px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {isAr ? (
            <ArViz />
          ) : (
            <div className="par-img">
              <img
                src={p.image}
                alt={p.imageAlt}
                loading={p.id === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Layout G — Large image top · floating card · title + desc below */
function LayoutG({ p }: { p: Project }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Top image */}
      <div
        className="img-wrap"
        style={{
          margin: '80px 80px 0',
          height: 'clamp(300px, 54vh, 540px)',
          position: 'relative',
        }}
      >
        <div className="par-img">
          <img
            src={p.image}
            alt={p.imageAlt}
            loading={p.id === 1 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(16%) contrast(1.07) brightness(0.65)',
            }}
          />
        </div>

        {/* Floating card */}
        <div
          className="par-meta"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(10,9,9,0.84)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(241,237,230,0.07)',
            padding: '16px 20px',
            zIndex: 2,
          }}
        >
          <p className="lbl-acid" style={{ marginBottom: '5px' }}>{p.num}</p>
          <p className="lbl-mono">{p.category}</p>
        </div>
      </div>

      {/* Lower section */}
      <div
        style={{
          padding: '40px 80px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        <div style={{ position: 'relative' }}>
          <GhostNum
            num={p.num}
            style={{ fontSize: 'clamp(72px, 10vw, 160px)', marginBottom: '-18px' }}
          />
          <h2
            className="par-title"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 4.5vw, 78px)',
              lineHeight: 0.88,
              letterSpacing: '-0.034em',
              color: '#F1EDE6',
              textTransform: 'uppercase',
              whiteSpace: 'pre-line',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {p.shortTitle || p.title}
          </h2>
        </div>

        <div style={{ paddingTop: '8px' }}>
          <Desc text={p.description} />
          <Tags items={p.technologies} />
          <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
        </div>
      </div>
    </div>
  );
}

/** Layout H — Minimal typography · cinema seat grid */
function LayoutH({ p }: { p: Project }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '100px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GhostNum
        num={p.num}
        style={{
          position: 'absolute',
          top: '28px',
          left: '60px',
          fontSize: 'clamp(110px, 16vw, 220px)',
        }}
      />

      <CategoryLabel text={p.category} />

      <h2
        className="par-title"
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(72px, 12.5vw, 190px)',
          lineHeight: 0.84,
          letterSpacing: '-0.048em',
          color: '#F1EDE6',
          textTransform: 'uppercase',
          marginBottom: '64px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {p.title}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '80px',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <Desc text={p.description} maxWidth="460px" />
          <Tags items={p.technologies} />
          <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
        </div>
        <SeatGrid />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mobile layout (all projects)
// ─────────────────────────────────────────────

function MobileLayout({ p }: { p: Project }) {
  const isAr = p.id === 10;
  const isApi = p.id === 5;
  const isTicket = p.id === 12;
  const isCinema = p.id === 8;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '88px 24px 64px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <p className="lbl-acid" style={{ marginBottom: '10px' }}>{p.num}</p>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(38px, 10.5vw, 64px)',
          lineHeight: 0.9,
          letterSpacing: '-0.034em',
          color: '#F1EDE6',
          whiteSpace: 'pre-line',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        {p.shortTitle || p.title}
      </h2>
      <p className="lbl-mono" style={{ marginBottom: '24px' }}>{p.category}</p>

      {/* Visual element */}
      <div
        style={{
          height: isCinema ? 'auto' : '220px',
          marginBottom: '24px',
          overflow: 'hidden',
          position: 'relative',
          border: isApi || isAr ? '1px solid rgba(241,237,230,0.07)' : 'none',
        }}
      >
        {isAr ? (
          <div style={{ height: '220px' }}><ArViz /></div>
        ) : isApi ? (
          <div style={{ height: '220px' }}><ApiPanel /></div>
        ) : isCinema ? (
          <div style={{ padding: '20px 0' }}><SeatGrid /></div>
        ) : (
          <div className="img-wrap" style={{ height: '220px' }}>
            <div className="par-img">
              <img
                src={p.image}
                alt={p.imageAlt}
                loading={p.id === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          </div>
        )}
      </div>

      <Desc text={p.description} maxWidth="none" />

      {isTicket && (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <TicketFlow />
        </div>
      )}

      <Tags items={p.technologies} />
      <ActionLinks githubLink={p.githubLink} liveDemoLink={p.liveDemoLink} />
    </div>
  );
}

// ─────────────────────────────────────────────
// ProjectScene — orchestration wrapper
// ─────────────────────────────────────────────

interface Props {
  project: Project;
  totalProjects?: number;
  onActive: (id: number) => void;
}

export function ProjectScene({ project: p, totalProjects, onActive }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Continuous scroll ratio → CSS custom property on section
  useScrollRatio(ref);

  const handleActive = useCallback((id: number) => onActive(id), [onActive]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add('state-entering');

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { intersectionRatio, boundingClientRect } = entry;
        el.classList.remove('state-entering', 'state-active', 'state-exiting');

        if (intersectionRatio > 0.4) {
          el.classList.add('state-active');
          handleActive(p.id);
        } else if (boundingClientRect.top > 0) {
          el.classList.add('state-entering');
        } else {
          el.classList.add('state-exiting');
        }
      },
      { threshold: [0, 0.08, 0.2, 0.4, 0.6, 0.8, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [p.id, handleActive]);

  return (
    <section
      ref={ref}
      id={`project-${p.num}`}
      className="project-scene section-border"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {isMobile ? (
        <MobileLayout p={p} />
      ) : (
        <>
          {p.layout === 'A' && <LayoutA p={p} totalProjects={totalProjects} />}
          {p.layout === 'B' && <LayoutB p={p} />}
          {p.layout === 'C' && <LayoutC p={p} />}
          {p.layout === 'D' && <LayoutD p={p} />}
          {p.layout === 'E' && <LayoutE p={p} />}
          {p.layout === 'F' && <LayoutF p={p} />}
          {p.layout === 'G' && <LayoutG p={p} />}
          {p.layout === 'H' && <LayoutH p={p} />}
        </>
      )}
    </section>
  );
}
