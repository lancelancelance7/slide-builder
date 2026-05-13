// BrandKit.jsx — Compact brand kit editor.
// Left column: logo, palette (3-4 swatches), fonts (display + text),
// tone dropdown, image style. Right column: live slide preview that
// updates as the user tweaks the kit.

function ColorSwatch({ color, role, hex }) {
  const isLight = ['#ffffff','#f5f5f7','#fafafa'].includes(color.toLowerCase());
  return (
    <div style={{
      flex: '1 1 0',
      borderRadius: 8,
      border: '1px solid var(--app-border)',
      background: 'var(--app-surface)',
      padding: 8,
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 0,
    }}>
      <div style={{
        height: 56, borderRadius: 5,
        background: color,
        border: isLight ? '1px solid var(--app-border)' : 'none',
      }}/>
      <div>
        <div className="micro" style={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, color: 'var(--app-text-2)' }}>
          {role}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--app-text)', marginTop: 2 }}>{hex}</div>
      </div>
    </div>
  );
}

function FontRow({ label, family, sample, size }) {
  return (
    <div className="row" style={{
      padding: '10px 12px',
      border: '1px solid var(--app-border)',
      borderRadius: 8,
      background: 'var(--app-surface)',
      gap: 12,
    }}>
      <div style={{ flex: '0 0 86px' }}>
        <div className="micro" style={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, color: 'var(--app-text-2)' }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--app-text)', marginTop: 2 }}>{family}</div>
      </div>
      <div className="vdivider" style={{ height: 30 }}/>
      <div style={{ flex: 1, fontFamily: family, fontSize: size, lineHeight: 1.1, letterSpacing: -0.4 }}>
        {sample}
      </div>
      <button className="btn-app btn-app--ghost"><Icon.chevDown/></button>
    </div>
  );
}

function ToneOption({ label, sample, active }) {
  return (
    <div style={{
      padding: 12,
      border: '1px solid ' + (active ? 'var(--color-accent)' : 'var(--app-border)'),
      background: active ? 'rgba(0,113,227,0.04)' : 'var(--app-surface)',
      borderRadius: 8,
      cursor: 'pointer',
      flex: '1 1 0',
      minWidth: 0,
    }}>
      <div className="row" style={{ gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        {active && <span style={{ color: 'var(--color-accent)', marginLeft: 'auto' }}><Icon.check/></span>}
      </div>
      <div style={{ fontSize: 11, color: 'var(--app-text-2)', fontStyle: 'italic', lineHeight: 1.35 }}>"{sample}"</div>
    </div>
  );
}

function BrandKit() {
  return (
    <div className="artboard">
      <AppNav
        breadcrumb={['Brand kits', 'Iron Den Fitness']}
        right={
          <>
            <button className="btn-app btn-app--ghost">Duplicate</button>
            <button className="btn-app">Discard</button>
            <button className="btn-app btn-app--primary"><Icon.check/>Save kit</button>
          </>
        }
      />
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar active="kit:iron-den" />
        <main className="grow" style={{ overflow: 'auto', padding: '28px 36px 36px',
                                         display: 'grid', gridTemplateColumns: '1fr 1fr',
                                         gap: 32, alignContent: 'start' }}>
          {/* ============ LEFT: form ============ */}
          <div className="col" style={{ gap: 22 }}>
            <div>
              <div className="row" style={{ gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: '#0c0c0d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--app-border)',
                }}>
                  <IronDenMark size={36}/>
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600,
                               letterSpacing: -0.5, margin: 0 }}>
                    Iron Den Fitness
                  </h1>
                  <div style={{ fontSize: 13, color: 'var(--app-text-2)', marginTop: 4 }}>
                    Local gym · Fitness · 6 decks
                  </div>
                </div>
                <div className="chip chip--outline">
                  <span className="chip-dot" style={{ background: '#34c759', opacity: 1 }}/>
                  Active default
                </div>
              </div>
            </div>

            {/* Logo */}
            <section>
              <label className="field-label">Logo</label>
              <div className="row" style={{ gap: 10 }}>
                <div style={{
                  width: 140, height: 90, borderRadius: 8,
                  background: '#0c0c0d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, color: '#fff', fontWeight: 700, letterSpacing: 2, fontSize: 11,
                  border: '1px solid var(--app-border)',
                }}>
                  <IronDenMark size={20}/> IRON DEN
                </div>
                <div className="col grow" style={{ gap: 6 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn-app">Upload SVG</button>
                    <button className="btn-app btn-app--ghost">Replace</button>
                  </div>
                  <div className="micro">iron-den-mark.svg · 4.2 KB · Updated 3 days ago</div>
                  <div className="row" style={{ gap: 14, marginTop: 6 }}>
                    <div className="row" style={{ gap: 6, fontSize: 12, color: 'var(--app-text-2)' }}>
                      <div className="toggle toggle--on"/> Show on every slide
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Palette */}
            <section>
              <div className="row" style={{ marginBottom: 6 }}>
                <label className="field-label" style={{ margin: 0 }}>Palette</label>
                <span style={{ flex: 1 }}/>
                <span className="micro">4 colors · WCAG AA passing</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <ColorSwatch color="#0c0c0d" role="Background" hex="#0C0C0D"/>
                <ColorSwatch color="#ffffff" role="Foreground" hex="#FFFFFF"/>
                <ColorSwatch color="#ff4500" role="Accent" hex="#FF4500"/>
                <ColorSwatch color="#ffb38a" role="Highlight" hex="#FFB38A"/>
              </div>
            </section>

            {/* Fonts */}
            <section>
              <label className="field-label">Type</label>
              <div className="col" style={{ gap: 8 }}>
                <FontRow label="Display" family="Inter" sample="Train hard." size={28}/>
                <FontRow label="Body" family="Inter Text" sample="A 10-slide plan to grow membership 30%."
                         size={15}/>
              </div>
              <div className="micro" style={{ marginTop: 8 }}>
                Display ≥ 20px · Body &lt; 20px. Slideline switches automatically.
              </div>
            </section>

            {/* Tone */}
            <section>
              <label className="field-label">Tone of voice</label>
              <div className="row" style={{ gap: 8 }}>
                <ToneOption label="Direct" sample="Train hard. Sell harder." active/>
                <ToneOption label="Warm" sample="A gym that knows your name."/>
                <ToneOption label="Technical" sample="Cohort retention up 31% YoY."/>
              </div>
            </section>

            {/* Image style */}
            <section>
              <div className="row" style={{ marginBottom: 6 }}>
                <label className="field-label" style={{ margin: 0 }}>Image style</label>
                <span style={{ flex: 1 }}/>
                <span className="micro">Used when AI suggests imagery</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                {[
                  { l: 'High-contrast photography', active: true, bg: '#1d1d1f' },
                  { l: 'Editorial illustration', bg: '#f5f5f7' },
                  { l: 'Flat product shots', bg: '#fafafa' },
                  { l: 'None', bg: '#fff' },
                ].map((o, i) => (
                  <div key={i} style={{
                    flex: '1 1 0',
                    border: '1px solid ' + (o.active ? 'var(--color-accent)' : 'var(--app-border)'),
                    borderRadius: 8,
                    padding: 8,
                    background: 'var(--app-surface)',
                    minWidth: 0,
                  }}>
                    <div style={{
                      height: 56, borderRadius: 5, background: o.bg,
                      backgroundImage: i === 0
                        ? 'radial-gradient(60% 80% at 30% 30%, #2a1a10 0%, #0c0c0d 70%)'
                        : i === 1
                        ? 'linear-gradient(135deg, #ffd4b8 0%, #ff7a3d 60%, #b22d00 100%)'
                        : i === 2
                        ? 'radial-gradient(80% 60% at 50% 60%, #d6d6d6 0%, #fafafa 70%)'
                        : 'none',
                      border: i === 3 ? '1px dashed var(--app-border)' : 'none',
                    }}/>
                    <div style={{ marginTop: 6, fontSize: 11, fontWeight: 500, color: 'var(--app-text)' }}>
                      {o.l}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ============ RIGHT: live preview ============ */}
          <div className="col" style={{ gap: 14, position: 'sticky', top: 0 }}>
            <div className="row">
              <label className="field-label" style={{ margin: 0 }}>Live preview</label>
              <span style={{ flex: 1 }}/>
              <div className="row" style={{ gap: 4 }}>
                <button className="btn-app btn-app--ghost" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>Cover</button>
                <button className="btn-app" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>Content</button>
                <button className="btn-app btn-app--ghost" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>Section</button>
              </div>
            </div>

            <div style={{
              borderRadius: 12,
              border: '1px solid var(--app-border)',
              background: '#0c0c0d',
              padding: 16,
            }}>
              <ScaledSlide width={540}>
                <IronDenContent templates={{ pageNumber: true, title: true, logo: true }} />
              </ScaledSlide>
            </div>

            {/* mini chrome under preview */}
            <div className="row" style={{ gap: 8 }}>
              <div className="chip chip--outline">
                <span className="chip-dot" style={{ background: '#ff4500', opacity: 1 }}/>
                Iron Den · Image + text
              </div>
              <span style={{ flex: 1 }}/>
              <button className="btn-app btn-app--ghost" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>
                <Icon.chev/> Cycle layout
              </button>
            </div>

            {/* Compliance card */}
            <div style={{
              padding: 14,
              background: 'rgba(52,199,89,0.08)',
              border: '1px solid rgba(52,199,89,0.30)',
              borderRadius: 10,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 50, flex: '0 0 18px',
                background: '#34c759', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon.check/>
              </div>
              <div style={{ flex: 1, fontSize: 12, color: 'var(--app-text)' }}>
                <div style={{ fontWeight: 600 }}>Brand compliance · passing</div>
                <div style={{ color: 'var(--app-text-2)', marginTop: 2 }}>
                  Body and accent contrast at 9.4:1. Logo present on cover and footer.
                </div>
              </div>
            </div>

            <div style={{
              padding: 12,
              background: 'var(--app-surface)',
              border: '1px solid var(--app-border)',
              borderRadius: 10,
              fontSize: 12, color: 'var(--app-text-2)',
            }}>
              <div className="row" style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: 'var(--app-text)' }}>Applies to</span>
                <span style={{ flex: 1 }}/>
                <a href="#" style={{ fontSize: 12 }}>Manage 6 decks</a>
              </div>
              Iron Den Fitness · Sales Proposal, Q1 Quarterly Review, Studio Launch deck and 3 more.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { BrandKit });
