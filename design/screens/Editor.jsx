// Editor.jsx — the Keynote-lite slide editor.
// Layout: top toolbar | slide thumbnails (left) | canvas (center) | inspector (right).
// Shown state: editing slide 3, the title text element is selected so the
// inspector is on the "Element" tab. The Template Controls artboard
// reuses the same layout with the inspector switched to "Template".

const SLIDE_THUMBS = [
  { n: 1, layout: 'Title',       title: 'Train hard. Sell harder.' },
  { n: 2, layout: 'Section',     title: 'State of the market' },
  { n: 3, layout: 'Image+Text',  title: 'The Opportunity', current: true },
  { n: 4, layout: 'Comparison',  title: 'Why us' },
  { n: 5, layout: 'Quote',       title: 'They knew our members' },
  { n: 6, layout: 'Stat hero',   title: '3.2× lift' },
  { n: 7, layout: 'Image+Text',  title: 'How we work' },
  { n: 8, layout: 'Comparison',  title: 'Pilot scope' },
  { n: 9, layout: 'Section',     title: 'Investment' },
  { n: 10, layout: 'Closing',    title: 'Next steps' },
];

function MiniSlide({ slide, current }) {
  return (
    <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
      <div className="mono micro" style={{ width: 16, textAlign: 'right', paddingTop: 8 }}>
        {String(slide.n).padStart(2, '0')}
      </div>
      <div style={{
        flex: 1,
        borderRadius: 6,
        padding: 3,
        background: current ? 'var(--color-accent)' : 'transparent',
        cursor: 'pointer',
      }}>
        <div style={{
          width: '100%', aspectRatio: '16/9',
          background: '#0c0c0d', color: '#fff',
          borderRadius: 4,
          padding: '8px 8px 6px',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {/* mini title */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: slide.layout === 'Title' ? 11 : 8,
            fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.1,
          }}>
            {slide.title}
          </div>
          {/* mini accent bar */}
          {slide.layout !== 'Stat hero' && (
            <div style={{
              width: '40%', height: 2, background: '#ff4500', borderRadius: 1,
            }}/>
          )}
          {slide.layout === 'Stat hero' && (
            <div style={{ color: '#ff4500', fontSize: 16, fontWeight: 800, lineHeight: 1 }}>3.2×</div>
          )}
          {/* footer */}
          <div className="row" style={{ fontSize: 5, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.6 }}>
            <span>IRON DEN</span>
            <span style={{ flex: 1 }}/>
            <span>{String(slide.n).padStart(2,'0')}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Top editor toolbar — file + tools + share/export
function EditorToolbar() {
  return (
    <div style={{
      flex: '0 0 auto',
      height: 56,
      background: 'var(--app-surface)',
      borderBottom: '1px solid var(--app-border)',
      padding: '0 14px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div className="appnav__brand" style={{ marginRight: 4 }}>
        <div className="appnav__brand-mark">S</div>
      </div>
      <div className="row" style={{ gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--app-text)', fontWeight: 500 }}>
          Iron Den Fitness — Sales Proposal
        </span>
        <span className="micro">· Saved 6s ago</span>
      </div>
      <div className="vdivider" style={{ height: 24, margin: '0 6px' }}/>
      <button className="btn-app btn-app--ghost btn-app--icon" title="Undo">
        <svg viewBox="0 0 16 16" fill="none"><path d="M3 7h7a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 5L3 7l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button className="btn-app btn-app--ghost btn-app--icon" title="Redo">
        <svg viewBox="0 0 16 16" fill="none"><path d="M13 7H6a3 3 0 000 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 5l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="vdivider" style={{ height: 24, margin: '0 6px' }}/>

      {/* Insert tools */}
      <button className="btn-app">
        <Icon.plus/> Add slide <Icon.chevDown/>
      </button>
      <button className="btn-app btn-app--ghost btn-app--icon" title="Text"><Icon.textT/></button>
      <button className="btn-app btn-app--ghost btn-app--icon" title="Image"><Icon.image/></button>
      <button className="btn-app btn-app--ghost btn-app--icon" title="Shape"><Icon.shape/></button>

      <span style={{ flex: 1 }}/>

      {/* Right cluster */}
      <span className="chip">
        <span className="chip-dot" style={{ background: '#ff4500', opacity: 1 }}/>
        Iron Den
      </span>
      <button className="btn-app btn-app--ghost">
        <Icon.spark/> Ask Slideline
      </button>
      <div className="vdivider" style={{ height: 24, margin: '0 2px' }}/>
      <button className="btn-app">
        <Icon.share/> Share
      </button>
      <button className="btn-app btn-app--dark">
        <Icon.download/> Export PDF <Icon.chevDown/>
      </button>
    </div>
  );
}

// Slide-thumb rail (left)
function SlideRail() {
  return (
    <aside style={{
      flex: '0 0 196px',
      background: 'var(--app-bg)',
      borderRight: '1px solid var(--app-border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="row" style={{ padding: '10px 14px 6px', gap: 6 }}>
        <span className="micro" style={{ fontWeight: 600, color: 'var(--app-text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
          Slides
        </span>
        <span className="mono micro">10</span>
        <span style={{ flex: 1 }}/>
        <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 22, height: 22 }}>
          <Icon.plus/>
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 10px 10px' }}>
        <div className="col" style={{ gap: 6 }}>
          {SLIDE_THUMBS.map((s) => (
            <MiniSlide key={s.n} slide={s} current={s.current} />
          ))}
          <div style={{
            marginTop: 4,
            border: '1px dashed var(--app-border)',
            borderRadius: 6, padding: 12,
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--app-text-2)', fontSize: 11,
            cursor: 'pointer',
          }}>
            <Icon.plus/> Add slide
          </div>
        </div>
      </div>
    </aside>
  );
}

// Center canvas — slide centered, with selection chrome on the title
function SlideCanvas({ showSelection = true, templates }) {
  const t = templates || { pageNumber: true, title: true, logo: true };
  return (
    <div className="grow" style={{
      background: 'var(--app-bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', minWidth: 0,
    }}>
      {/* Sub-toolbar (zoom + layout indicator) */}
      <div className="row" style={{
        flex: '0 0 38px',
        padding: '0 16px',
        borderBottom: '1px solid var(--app-divider)',
        background: 'var(--app-bg)',
        gap: 10,
      }}>
        <span className="chip" style={{ background: 'rgba(0,113,227,0.10)', color: '#0071e3' }}>
          <Icon.layout/> Slide 3 · Image + Text
        </span>
        <button className="btn-app btn-app--ghost" style={{ height: 24, padding: '0 8px', fontSize: 12 }}>
          Change layout <Icon.chevDown/>
        </button>
        <span style={{ flex: 1 }}/>
        <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 24, height: 24 }}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </button>
        <span className="mono micro" style={{ width: 38, textAlign: 'center' }}>78 %</span>
        <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 24, height: 24 }}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </button>
        <div className="vdivider" style={{ height: 18 }}/>
        <button className="btn-app btn-app--ghost" style={{ height: 24, padding: '0 8px', fontSize: 12 }}>Fit</button>
      </div>

      {/* Canvas area */}
      <div style={{
        flex: 1,
        background: 'var(--app-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 28,
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 22px 60px rgba(0,0,0,0.18)',
          borderRadius: 6,
        }}>
          <ScaledSlide width={720}>
            <IronDenContent templates={t}/>
          </ScaledSlide>
          {/* Selection overlay on the title (relative to scaled slide) */}
          {showSelection && (
            <div style={{
              position: 'absolute',
              top: 100 * 720/1280, left: 80 * 720/1280,
              width: 500 * 720/1280, height: 130 * 720/1280,
              border: '1.5px solid var(--color-accent)',
              borderRadius: 2,
              pointerEvents: 'none',
            }}>
              {/* corner handles */}
              {['tl','tr','bl','br'].map((c) => {
                const pos = {
                  tl: { top: -4, left: -4 }, tr: { top: -4, right: -4 },
                  bl: { bottom: -4, left: -4 }, br: { bottom: -4, right: -4 },
                }[c];
                return (
                  <div key={c} style={{
                    position: 'absolute', ...pos,
                    width: 8, height: 8, background: '#fff',
                    border: '1.5px solid var(--color-accent)',
                    borderRadius: 1,
                  }}/>
                );
              })}
              {/* selection label */}
              <div style={{
                position: 'absolute', bottom: '100%', left: 0,
                marginBottom: 6,
                background: 'var(--color-accent)',
                color: '#fff', fontSize: 10, fontWeight: 500,
                padding: '2px 6px', borderRadius: 3,
                whiteSpace: 'nowrap',
              }}>
                Title · Display 64 / 700
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Right inspector — Element tab open (text props for selected title)
function ElementInspector() {
  return (
    <aside style={{
      flex: '0 0 288px',
      background: 'var(--app-surface)',
      borderLeft: '1px solid var(--app-border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Tabs */}
      <div className="row" style={{
        padding: '6px 6px 0', gap: 2,
        borderBottom: '1px solid var(--app-divider)',
      }}>
        {['Slide', 'Element', 'Template', 'Notes'].map((t, i) => (
          <div key={t} style={{
            padding: '8px 12px',
            fontSize: 12, fontWeight: i === 1 ? 600 : 400,
            color: i === 1 ? 'var(--app-text)' : 'var(--app-text-2)',
            borderBottom: i === 1 ? '2px solid var(--color-accent)' : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer',
          }}>{t}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {/* Selected element */}
        <div className="row" style={{ gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(0,113,227,0.10)',
                        color: 'var(--color-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.textT/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Title</div>
            <div className="micro">Heading · slide 3</div>
          </div>
          <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 24, height: 24 }}><Icon.more/></button>
        </div>

        {/* Text */}
        <Section title="Text">
          <select className="select-app" style={{ marginBottom: 8 }}>
            <option>Inter — Display</option>
          </select>
          <div className="row" style={{ gap: 6 }}>
            <select className="select-app" style={{ flex: '1 1 0' }}>
              <option>700 Bold</option>
            </select>
            <div style={{ position: 'relative', flex: '0 0 84px' }}>
              <input className="input-app" defaultValue="64 px" />
            </div>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 8 }}>
            <SegBtn icon={<span style={{ fontWeight: 700, fontSize: 12 }}>B</span>} active/>
            <SegBtn icon={<span style={{ fontStyle: 'italic', fontSize: 12 }}>I</span>}/>
            <SegBtn icon={<span style={{ textDecoration: 'underline', fontSize: 12 }}>U</span>}/>
            <div style={{ flex: 1 }}/>
            <SegBtn icon={<TextAlign d="left"/>} active/>
            <SegBtn icon={<TextAlign d="center"/>}/>
            <SegBtn icon={<TextAlign d="right"/>}/>
          </div>

          <div className="row" style={{ marginTop: 12, gap: 8 }}>
            <ColorChip color="#ffffff" label="Color" active/>
            <ColorChip color="#ff4500" label="Accent"/>
            <ColorChip color="rgba(255,255,255,0.62)" label="Dim"/>
            <SegBtn icon={<Icon.plus/>}/>
          </div>

          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            <Slider label="Line height" value="1.06"/>
            <Slider label="Tracking" value="-1.6"/>
          </div>
        </Section>

        {/* Position */}
        <Section title="Position & size">
          <div className="row" style={{ gap: 6 }}>
            <NumberField label="X" value="80"/>
            <NumberField label="Y" value="100"/>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 6 }}>
            <NumberField label="W" value="500"/>
            <NumberField label="H" value="130"/>
          </div>
          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            <SegBtn icon={<AlignIcon d="ml"/>} title="Align left"/>
            <SegBtn icon={<AlignIcon d="mc"/>}/>
            <SegBtn icon={<AlignIcon d="mr"/>}/>
            <div className="vdivider" style={{ height: 22 }}/>
            <SegBtn icon={<AlignIcon d="mt"/>}/>
            <SegBtn icon={<AlignIcon d="mm"/>}/>
            <SegBtn icon={<AlignIcon d="mb"/>}/>
          </div>
        </Section>

        {/* Layout */}
        <Section title="Slide layout">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
          }}>
            {[
              ['Title','t'],
              ['Section','s'],
              ['Image+Text','it', true],
              ['Quote','q'],
              ['Compare','c'],
              ['Closing','cl'],
            ].map(([n, k, active]) => (
              <LayoutThumb key={k} kind={k} label={n} active={active}/>
            ))}
          </div>
        </Section>

        {/* Comments */}
        <div style={{ marginTop: 12, padding: 10,
                      background: 'var(--app-surface-2)',
                      borderRadius: 8, border: '1px solid var(--app-border)' }}>
          <div className="row" style={{ gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 50, background: '#34c759',
                          color: '#fff', fontSize: 10, fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JK</div>
            <div className="micro">Jamie · 2 min ago</div>
          </div>
          <div style={{ fontSize: 12, marginTop: 6, color: 'var(--app-text)' }}>
            Punch up this headline — "losing the digital fight" is heavy. Try "winning offline, missing online."
          </div>
        </div>
      </div>
    </aside>
  );
}

// Small primitives shared with TemplateControls
function Section({ title, right, children }) {
  return (
    <section style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--app-divider)' }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <div className="micro" style={{ fontWeight: 600, color: 'var(--app-text-2)',
                                          letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {title}
        </div>
        <span style={{ flex: 1 }}/>
        {right}
      </div>
      {children}
    </section>
  );
}

function SegBtn({ icon, active, title }) {
  return (
    <button className="btn-app" title={title} style={{
      height: 28, width: 28, padding: 0, justifyContent: 'center',
      background: active ? 'rgba(0,0,0,0.06)' : 'var(--app-surface)',
      borderColor: active ? 'var(--app-border-strong)' : 'var(--app-border)',
      color: 'var(--app-text)',
    }}>{icon}</button>
  );
}

function ColorChip({ color, label, active }) {
  const isLight = color === '#ffffff' || color === '#fff';
  return (
    <div title={label} style={{
      flex: 1, height: 28, borderRadius: 6,
      background: color,
      border: isLight ? '1px solid var(--app-border)' : 'none',
      boxShadow: active ? '0 0 0 1.5px var(--color-accent), 0 0 0 3px #fff inset' : 'none',
      outline: active ? '1.5px solid var(--color-accent)' : 'none',
      outlineOffset: 2,
      cursor: 'pointer',
    }}/>
  );
}

function NumberField({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="row" style={{
        height: 28, padding: '0 8px',
        border: '1px solid var(--app-border)', borderRadius: 6,
        background: 'var(--app-surface)',
      }}>
        <span className="micro" style={{ color: 'var(--app-text-3)', flex: '0 0 14px' }}>{label}</span>
        <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: 'var(--app-text)' }}>{value}</span>
      </div>
    </div>
  );
}

function Slider({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="row" style={{ marginBottom: 3 }}>
        <span className="micro">{label}</span>
        <span style={{ flex: 1 }}/>
        <span className="mono micro" style={{ color: 'var(--app-text)' }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 999, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, right: '40%',
                      background: 'var(--color-accent)', borderRadius: 999 }}/>
        <div style={{ position: 'absolute', top: -4, left: '60%', transform: 'translateX(-50%)',
                      width: 12, height: 12, background: '#fff',
                      border: '1px solid var(--app-border)', borderRadius: 50,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.18)' }}/>
      </div>
    </div>
  );
}

function TextAlign({ d }) {
  const lines = d === 'left'   ? [12, 9, 11]
              : d === 'center' ? [12, 9, 11]
              : [12, 9, 11];
  const x = d === 'left' ? 2 : d === 'center' ? 8 : 14;
  const xa = d === 'left' ? 2 : d === 'center' ? 5 : 11;
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1={xa} y1="8" x2={xa + (d === 'center' ? 6 : 9)} y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function AlignIcon({ d }) {
  // simplified — show a square and an axis line
  const map = {
    ml: { box: [2,5,6,6], line: 'M2 4v8' },
    mc: { box: [5,5,6,6], line: 'M8 2v12' },
    mr: { box: [8,5,6,6], line: 'M14 4v8' },
    mt: { box: [5,2,6,6], line: 'M4 2h8' },
    mm: { box: [5,5,6,6], line: 'M2 8h12' },
    mb: { box: [5,8,6,6], line: 'M4 14h8' },
  }[d];
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
      <rect x={map.box[0]} y={map.box[1]} width={map.box[2]} height={map.box[3]}
            fill="currentColor" opacity="0.5"/>
      <path d={map.line} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function LayoutThumb({ kind, label, active }) {
  return (
    <div style={{
      borderRadius: 6,
      border: '1.5px solid ' + (active ? 'var(--color-accent)' : 'var(--app-border)'),
      padding: 4,
      background: 'var(--app-surface)',
      cursor: 'pointer',
    }}>
      <div style={{
        aspectRatio: '16/10',
        background: '#0c0c0d',
        borderRadius: 3,
        position: 'relative', overflow: 'hidden',
      }}>
        {kind === 't' && (
          <>
            <div style={{ position: 'absolute', left: 6, bottom: 6, width: 28, height: 4, background: '#fff', borderRadius: 1 }}/>
            <div style={{ position: 'absolute', left: 6, bottom: 12, width: 14, height: 2, background: '#ff4500', borderRadius: 1 }}/>
          </>
        )}
        {kind === 's' && (
          <div style={{ position: 'absolute', inset: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 24, height: 4, background: '#fff', borderRadius: 1 }}/>
          </div>
        )}
        {kind === 'it' && (
          <>
            <div style={{ position: 'absolute', left: 4, top: 6, width: 18, height: 3, background: '#fff', borderRadius: 1 }}/>
            <div style={{ position: 'absolute', left: 4, top: 12, width: 14, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }}/>
            <div style={{ position: 'absolute', right: 3, top: 3, bottom: 3, width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}/>
          </>
        )}
        {kind === 'q' && (
          <div style={{ position: 'absolute', inset: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: '90%', height: 3, background: '#fff', borderRadius: 1, marginBottom: 2 }}/>
            <div style={{ width: '70%', height: 3, background: '#fff', borderRadius: 1, marginBottom: 4 }}/>
            <div style={{ width: '30%', height: 2, background: '#ff4500', borderRadius: 1 }}/>
          </div>
        )}
        {kind === 'c' && (
          <div style={{ position: 'absolute', inset: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 1 }}/>
            <div style={{ background: '#ff4500', borderRadius: 1 }}/>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 1 }}/>
          </div>
        )}
        {kind === 'cl' && (
          <div style={{ position: 'absolute', inset: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <div style={{ width: 30, height: 4, background: '#fff', borderRadius: 1 }}/>
            <div style={{ width: 14, height: 3, background: '#ff4500', borderRadius: 1, marginTop: 2 }}/>
          </div>
        )}
      </div>
      <div className="row" style={{ marginTop: 4, gap: 4 }}>
        <span className="micro" style={{ color: active ? 'var(--color-accent)' : 'var(--app-text-2)', fontWeight: active ? 500 : 400 }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function Editor() {
  return (
    <div className="artboard">
      <EditorToolbar/>
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <SlideRail/>
        <SlideCanvas/>
        <ElementInspector/>
      </div>
    </div>
  );
}

Object.assign(window, { Editor, SlideRail, SlideCanvas, EditorToolbar,
                        Section, SegBtn, ColorChip, NumberField, Slider, LayoutThumb });
