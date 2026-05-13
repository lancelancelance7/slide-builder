// TemplateControls.jsx — same editor shell, inspector switched to "Template"
// to show all template-element customisation:
//   page numbers, top-right titles, bottom logos. Each can be toggled,
//   restyled, or hidden per slide.

function TemplateInspector() {
  return (
    <aside style={{
      flex: '0 0 288px',
      background: 'var(--app-surface)',
      borderLeft: '1px solid var(--app-border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div className="row" style={{
        padding: '6px 6px 0', gap: 2,
        borderBottom: '1px solid var(--app-divider)',
      }}>
        {['Slide', 'Element', 'Template', 'Notes'].map((t, i) => (
          <div key={t} style={{
            padding: '8px 12px',
            fontSize: 12, fontWeight: i === 2 ? 600 : 400,
            color: i === 2 ? 'var(--app-text)' : 'var(--app-text-2)',
            borderBottom: i === 2 ? '2px solid var(--color-accent)' : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer',
          }}>{t}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div className="row" style={{ marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Standard template</div>
            <div className="micro">Applies to all 10 slides</div>
          </div>
          <span style={{ flex: 1 }}/>
          <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 24, height: 24 }}><Icon.more/></button>
        </div>

        {/* Page numbers */}
        <Section title="Page numbers" right={<div className="toggle toggle--on"/>}>
          <div className="row" style={{ gap: 6, marginBottom: 8 }}>
            {[['01/10', true], ['1 of 10'], ['01'], ['•']].map(([l, a]) => (
              <button key={l} className="btn-app" style={{
                flex: 1, height: 32, padding: 0,
                background: a ? 'rgba(0,113,227,0.10)' : 'var(--app-surface)',
                color: a ? 'var(--color-accent)' : 'var(--app-text)',
                borderColor: a ? 'transparent' : 'var(--app-border)',
                fontSize: 11, fontVariantNumeric: 'tabular-nums', justifyContent: 'center',
              }}>{l}</button>
            ))}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <select className="select-app" style={{ flex: 1 }}>
              <option>Bottom right</option>
            </select>
            <NumberField label="px" value="13"/>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 8, padding: '8px 10px',
                                          background: 'var(--app-surface-2)',
                                          border: '1px solid var(--app-border)',
                                          borderRadius: 6 }}>
            <Icon.check/>
            <span className="micro" style={{ color: 'var(--app-text-2)' }}>
              Skip on slide 1 & closing
            </span>
            <span style={{ flex: 1 }}/>
            <div className="toggle toggle--on" style={{ width: 26, height: 14 }}/>
          </div>
        </Section>

        {/* Top-right title */}
        <Section title="Top-right title" right={<div className="toggle toggle--on"/>}>
          <input className="input-app" defaultValue="{{slide.section}}" style={{ marginBottom: 8 }}/>
          <div className="micro" style={{ marginBottom: 8, color: 'var(--app-text-2)' }}>
            Uses each slide's section name. <a href="#">Use deck title instead</a>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <select className="select-app" style={{ flex: 2 }}>
              <option>Body 13 / 500</option>
            </select>
            <select className="select-app" style={{ flex: 1 }}>
              <option>Dim</option>
            </select>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 8 }}>
            <SegBtn icon={<TextAlignCaps d="upper"/>} active title="Uppercase"/>
            <SegBtn icon={<TextAlignCaps d="title"/>} title="Title case"/>
            <SegBtn icon={<TextAlignCaps d="none"/>} title="As written"/>
            <div style={{ flex: 1 }}/>
            <span className="mono micro">letter-spacing&nbsp;0.4</span>
          </div>
        </Section>

        {/* Bottom-left logo */}
        <Section title="Brand logo" right={<div className="toggle toggle--on"/>}>
          <div className="row" style={{ gap: 8, marginBottom: 8, padding: 8,
                                          border: '1px solid var(--app-border)',
                                          borderRadius: 6, background: 'var(--app-surface-2)' }}>
            <div style={{
              width: 40, height: 28, borderRadius: 4,
              background: '#0c0c0d',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <IronDenMark size={14}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>iron-den-mark.svg</div>
              <div className="micro">From Iron Den Fitness kit</div>
            </div>
            <button className="btn-app btn-app--ghost" style={{ height: 24, padding: '0 8px', fontSize: 11 }}>Replace</button>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <select className="select-app" style={{ flex: 1 }}>
              <option>Bottom left</option>
            </select>
            <NumberField label="px" value="22"/>
          </div>
          <div className="row" style={{ marginTop: 8, gap: 6 }}>
            <Slider label="Opacity" value="100%"/>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 10, padding: '8px 10px',
                                          background: 'var(--app-surface-2)',
                                          border: '1px solid var(--app-border)',
                                          borderRadius: 6 }}>
            <span className="micro">Show wordmark next to logo</span>
            <span style={{ flex: 1 }}/>
            <div className="toggle toggle--on" style={{ width: 26, height: 14 }}/>
          </div>
        </Section>

        {/* Per-slide overrides */}
        <Section title="Per-slide overrides">
          <div className="col" style={{ gap: 4 }}>
            {[
              ['01 · Title', 'Hide page #'],
              ['05 · Quote', 'Hide top-right title'],
              ['10 · Closing', 'Hide all template chrome'],
            ].map(([s, o]) => (
              <div key={s} className="row" style={{ gap: 8, padding: '6px 8px',
                                                       background: 'var(--app-surface-2)',
                                                       borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--app-text)' }}>{s}</span>
                <span style={{ flex: 1 }}/>
                <span className="micro">{o}</span>
                <button className="btn-app btn-app--ghost btn-app--icon" style={{ width: 22, height: 22 }}>
                  <Icon.more/>
                </button>
              </div>
            ))}
          </div>
          <button className="btn-app btn-app--ghost" style={{ marginTop: 8, height: 28, fontSize: 12 }}>
            <Icon.plus/> Add override
          </button>
        </Section>

        <div style={{ padding: 10, background: 'rgba(0,113,227,0.06)',
                      border: '1px solid rgba(0,113,227,0.20)',
                      borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--color-accent)', flex: '0 0 14px', marginTop: 1 }}>
            <Icon.spark/>
          </span>
          <div style={{ fontSize: 12, color: 'var(--app-text)' }}>
            <div style={{ fontWeight: 600 }}>Save as deck template</div>
            <div className="micro" style={{ marginTop: 2 }}>
              Reuse this template chrome for future Iron Den decks.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Canvas variant: highlight the three template elements with hint badges
function TemplateCanvas() {
  return (
    <div className="grow" style={{
      background: 'var(--app-bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', minWidth: 0,
    }}>
      <div className="row" style={{
        flex: '0 0 38px',
        padding: '0 16px',
        borderBottom: '1px solid var(--app-divider)',
        background: 'var(--app-bg)',
        gap: 10,
      }}>
        <span className="chip" style={{ background: 'rgba(0,113,227,0.10)', color: '#0071e3' }}>
          <Icon.template/> Editing template chrome
        </span>
        <button className="btn-app btn-app--ghost" style={{ height: 24, padding: '0 8px', fontSize: 12 }}>
          Preview slide <Icon.chevDown/>
        </button>
        <span style={{ flex: 1 }}/>
        <span className="micro">Showing on slide 3 — applies to all unless overridden</span>
      </div>

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
        <div style={{ position: 'relative',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 22px 60px rgba(0,0,0,0.18)',
                      borderRadius: 6 }}>
          <ScaledSlide width={720}>
            <IronDenContent templates={{ pageNumber: true, title: true, logo: true }}/>
          </ScaledSlide>

          {/* Annotation overlays for each template element */}
          {/* Top-right title */}
          <TemplateAnnot
            x={720 - 200} y={6} w={184} h={26}
            label="Top-right title"
            anchor="bottom"
          />
          {/* Bottom-left logo */}
          <TemplateAnnot
            x={12} y={720 * 720/1280 - 38} w={96} h={28}
            label="Brand logo"
            anchor="top"
          />
          {/* Bottom-right page # */}
          <TemplateAnnot
            x={720 - 70} y={720 * 720/1280 - 38} w={56} h={26}
            label="Page #"
            anchor="top"
          />
        </div>
      </div>
    </div>
  );
}

function TemplateAnnot({ x, y, w, h, label, anchor = 'bottom' }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        border: '1.5px dashed rgba(0,113,227,0.65)',
        borderRadius: 4, pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', left: x, top: anchor === 'bottom' ? y + h + 6 : y - 22,
        background: '#0071e3', color: '#fff',
        fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 3,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </>
  );
}

function TextAlignCaps({ d }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5 }}>
      {d === 'upper' ? 'AB' : d === 'title' ? 'Ab' : 'ab'}
    </span>
  );
}

function TemplateControls() {
  return (
    <div className="artboard">
      <EditorToolbar/>
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <SlideRail/>
        <TemplateCanvas/>
        <TemplateInspector/>
      </div>
    </div>
  );
}

Object.assign(window, { TemplateControls });
