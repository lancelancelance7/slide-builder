// Preprocess.jsx — "Review the plan" screen.
// Vertical list of slide cards, editable inline. Each card shows:
//   number, layout chip, title, content (bullets/body), image idea, notes.
// Top: stats strip. Bottom-right docked: "Generate slides" CTA.

const PLAN = [
  {
    n: 1, layout: 'Title',
    title: 'Train hard. Sell harder.',
    body: 'A 10-slide plan to grow Iron Den Fitness membership 30% in two quarters.',
    bullets: null,
    image: 'Cinematic gym hero — barbell on platform, hard rim lighting, near-black background',
    notes: 'Open warm. Mention I worked with their head trainer\'s old gym in 2024.',
    editing: true,
  },
  {
    n: 2, layout: 'Section',
    title: 'The state of the local fitness market.',
    body: null,
    bullets: ['Membership is up 4% YoY locally', 'Online discovery now drives 68% of trial sign-ups', 'Boutique competitors are winning on brand, not price'],
    image: 'Editorial photo — busy reception desk at a competitor gym, dusk light',
    notes: 'Slow the pace here. They love stats, but anchor with the trainer story first.',
  },
  {
    n: 3, layout: 'Image + Text',
    title: 'Local gyms are losing the digital fight.',
    body: 'Iron Den\'s audience searches online first and walks in second. We close that loop with a brand-led funnel and a calendar built to convert trials.',
    bullets: null,
    image: 'Iron Den-branded mockup of search results and a paid social ad, dark UI',
    notes: 'Drop the 68% stat into the pause. Don\'t over-explain — the visual does the work.',
  },
  {
    n: 4, layout: 'Comparison',
    title: 'Why us — not the agency across the river.',
    body: null,
    bullets: ['Brand-first creative vs. template-driven', 'In-house production, no resellers', 'Fixed 6-week pilot, not an open retainer'],
    image: 'Three-column vendor compare table, Iron Den orange highlighting our column',
    notes: 'They mentioned Boldline and Northstar by name. Don\'t name them on the slide.',
  },
  {
    n: 5, layout: 'Quote',
    title: '"They knew our members before we did."',
    body: '— Mia R., owner, North Wing Boxing Club',
    bullets: null,
    image: 'Soft portrait of a gym owner, mid-laugh, low contrast — neutral background',
    notes: 'Mia agreed to be quoted. Cite the 22% lift you got her in Q3.',
  },
  {
    n: 6, layout: 'Stat hero',
    title: '3.2× lift from retargeting alone.',
    body: 'Across four boutique fitness brands we\'ve worked with in the last 18 months.',
    bullets: null,
    image: 'Type-only — large stat treatment on near-black',
    notes: '',
  },
];

function ImageIdeaThumb({ caption }) {
  return (
    <div style={{
      width: 124, height: 80,
      borderRadius: 6,
      background: 'radial-gradient(120% 80% at 30% 30%, #2a1a10 0%, #0c0c0d 60%, #000 100%)',
      position: 'relative', overflow: 'hidden', flex: '0 0 124px',
      border: '1px solid var(--app-border)',
    }}>
      <svg viewBox="0 0 124 80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" fill="none">
          <circle cx="40" cy="40" r="14"/>
          <circle cx="84" cy="40" r="14"/>
          <rect x="54" y="37" width="16" height="5" rx="1"/>
        </g>
        <text x="62" y="68" textAnchor="middle" fontSize="7" letterSpacing="1.4"
              fill="rgba(255,255,255,0.42)" fontFamily="var(--font-text)">
          AI · IMAGE BRIEF
        </text>
      </svg>
      <div style={{
        position: 'absolute', top: 6, left: 6,
        fontSize: 8, fontWeight: 700, letterSpacing: 1, color: '#ff8e5a',
        textTransform: 'uppercase',
      }}>
        Idea
      </div>
    </div>
  );
}

function PlanCard({ s }) {
  return (
    <div className="surface" style={{
      padding: 0,
      boxShadow: s.editing ? '0 0 0 1.5px var(--color-accent)' : 'var(--app-shadow-soft)',
      borderColor: s.editing ? 'transparent' : 'var(--app-border)',
      overflow: 'hidden',
    }}>
      <div className="row" style={{ alignItems: 'stretch', minHeight: 152 }}>
        {/* Left rail */}
        <div style={{
          flex: '0 0 56px',
          background: s.editing ? 'rgba(0,113,227,0.05)' : 'var(--app-surface-2)',
          borderRight: '1px solid var(--app-divider)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '12px 0', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: s.editing ? 'var(--color-accent)' : 'rgba(0,0,0,0.06)',
            color: s.editing ? '#fff' : 'var(--app-text)',
            fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(s.n).padStart(2, '0')}
          </div>
          <div style={{ color: 'var(--app-text-3)', cursor: 'grab' }}>
            <Icon.drag/>
          </div>
        </div>

        {/* Middle — title + content */}
        <div style={{ flex: '1 1 0', minWidth: 0, padding: '16px 18px', borderRight: '1px solid var(--app-divider)' }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <span className="chip chip--blue">
              <Icon.layout/> {s.layout}
            </span>
            {s.editing && (
              <span className="chip" style={{ background: 'rgba(255,69,0,0.10)', color: '#c93800' }}>
                <Icon.pencil/> Editing
              </span>
            )}
            <span style={{ flex: 1 }}/>
            <button className="btn-app btn-app--ghost" style={{ height: 24, padding: '0 6px', fontSize: 11 }}>
              <Icon.spark/> Rewrite
            </button>
          </div>
          {/* Editable title */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 600, lineHeight: 1.18, letterSpacing: -0.4,
            color: 'var(--app-text)',
            borderBottom: s.editing ? '1px dashed var(--color-accent)' : 'none',
            paddingBottom: s.editing ? 4 : 0,
            marginBottom: 8,
            outline: 'none',
          }}>
            {s.title}
            {s.editing && <span style={{
              display: 'inline-block', width: 1.5, height: 22, background: 'var(--color-accent)',
              marginLeft: 2, verticalAlign: 'middle', animation: 'caret 1s steps(2) infinite',
            }}/>}
          </div>
          {/* Body or bullets */}
          {s.body && (
            <div style={{ fontSize: 13, color: 'var(--app-text-2)', lineHeight: 1.5, maxWidth: 520 }}>
              {s.body}
            </div>
          )}
          {s.bullets && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {s.bullets.map((b, i) => (
                <li key={i} style={{
                  fontSize: 13, color: 'var(--app-text)', lineHeight: 1.5,
                  paddingLeft: 14, position: 'relative', marginBottom: 2,
                }}>
                  <span style={{
                    position: 'absolute', left: 0, top: 7,
                    width: 5, height: 5, borderRadius: 50,
                    background: '#ff4500',
                  }}/>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right — image idea + notes */}
        <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{
            padding: '12px 14px', gap: 12, alignItems: 'flex-start',
            borderBottom: '1px solid var(--app-divider)', minHeight: 92,
          }}>
            <ImageIdeaThumb caption={s.image}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="micro" style={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, color: 'var(--app-text-2)' }}>
                Image prompt
              </div>
              <div style={{ fontSize: 12, color: 'var(--app-text)', lineHeight: 1.4, marginTop: 4,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                            overflow: 'hidden' }}>
                {s.image}
              </div>
            </div>
          </div>
          <div style={{ padding: '10px 14px', flex: 1 }}>
            <div className="row" style={{ marginBottom: 4 }}>
              <span className="micro" style={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, color: 'var(--app-text-2)' }}>
                Speaker notes
              </span>
              <span style={{ flex: 1 }}/>
              {!s.notes && <span className="micro" style={{ color: 'var(--app-text-3)' }}>Optional</span>}
            </div>
            <div style={{ fontSize: 12, color: s.notes ? 'var(--app-text-2)' : 'var(--app-text-3)',
                          lineHeight: 1.45, fontStyle: s.notes ? 'normal' : 'italic' }}>
              {s.notes || 'No notes yet — Slideline will draft these at generation if left blank.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preprocess() {
  return (
    <div className="artboard">
      <style>{`@keyframes caret { 50% { opacity: 0; } }`}</style>
      <AppNav
        breadcrumb={['Decks', 'Iron Den Fitness — Sales Proposal', 'Plan']}
        right={
          <>
            <button className="btn-app btn-app--ghost"><Icon.spark/>Regenerate plan</button>
            <button className="btn-app">Save plan</button>
            <button className="btn-app btn-app--primary"><Icon.check/>Generate slides</button>
          </>
        }
      />
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar active="decks" />
        <main className="grow" style={{ overflow: 'auto', padding: '24px 36px 80px' }}>
          {/* Step header */}
          <div className="row" style={{ gap: 8, marginBottom: 16, color: 'var(--app-text-2)', fontSize: 12 }}>
            <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                           background: '#34c759', color: '#fff',
                           alignItems: 'center', justifyContent: 'center', fontSize: 11 }}><Icon.check/></span>
            <span>Described</span>
            <span style={{ width: 24, height: 1, background: 'var(--app-border)' }}/>
            <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                           background: 'var(--color-accent)', color: '#fff',
                           alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>2</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 500 }}>Review the plan</span>
            <span style={{ width: 24, height: 1, background: 'var(--app-border)' }}/>
            <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                           background: 'var(--app-surface)', border: '1px solid var(--app-border)',
                           color: 'var(--app-text-2)',
                           alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>3</span>
            <span>Generate</span>
            <span style={{ flex: 1 }}/>
            <span className="micro">ChatGPT 5.5 · drafted in 11.8s</span>
          </div>

          {/* Hero */}
          <div className="row" style={{ alignItems: 'flex-end', gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600,
                            letterSpacing: -0.7, margin: 0 }}>
                Review the plan.
              </h1>
              <div style={{ color: 'var(--app-text-2)', marginTop: 4, fontSize: 14, maxWidth: 640 }}>
                Edit any title, bullet, image brief, or note inline. Drag to reorder.
                When it reads right, Slideline turns this into branded slides.
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="row" style={{
            padding: '12px 16px', gap: 28, marginTop: 16,
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border)', borderRadius: 10,
          }}>
            {[
              ['Slides', '10'],
              ['Layouts', '5 distinct'],
              ['Imagery', '8 prompts'],
              ['Notes', '6 of 10'],
              ['Brand kit', 'Iron Den Fitness'],
              ['Template', 'Standard · page #, title, logo'],
              ['Est. length', '7–9 min'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="micro" style={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, color: 'var(--app-text-2)' }}>
                  {k}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{v}</div>
              </div>
            ))}
            <span style={{ flex: 1 }}/>
            <button className="btn-app btn-app--ghost" style={{ alignSelf: 'center' }}>
              Customize layouts
            </button>
          </div>

          {/* Plan list */}
          <div className="col" style={{ gap: 10, marginTop: 16 }}>
            {PLAN.map((s) => <PlanCard key={s.n} s={s}/>)}

            {/* truncation hint */}
            <div style={{
              padding: '10px 16px',
              background: 'transparent',
              border: '1px dashed var(--app-border)',
              borderRadius: 10,
              fontSize: 12, color: 'var(--app-text-2)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon.chevDown/>
              4 more slides — Testimonial wall, Pilot scope, Pricing, Closing & next steps.
              <span style={{ flex: 1 }}/>
              <button className="btn-app btn-app--ghost" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>
                <Icon.plus/> Add slide
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { Preprocess });
