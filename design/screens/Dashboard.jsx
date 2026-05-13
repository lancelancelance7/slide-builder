// Dashboard.jsx — Recent decks screen
// Apple-flavored: lots of whitespace, single accent, deck cards lined up
// in a clean 4-up grid. The hero card is the "New deck" affordance —
// dark-on-light to give it weight without using color noise.

const DECKS = [
  {
    title: 'Iron Den Fitness — Sales Proposal',
    sub: '10 slides · Local gym, Q2 2026',
    kit: 'Iron Den Fitness', chip: '#ff4500',
    edited: 'Edited 4 min ago',
    status: 'draft',
    thumb: 'iron-den',
  },
  {
    title: 'Q1 Board Update',
    sub: '14 slides · Acme Capital',
    kit: 'Acme Capital', chip: '#0a6f3c',
    edited: 'Yesterday',
    status: 'generated',
  },
  {
    title: 'New-hire onboarding',
    sub: '22 slides · Maven Co.',
    kit: 'Default', chip: '#0071e3',
    edited: '2 days ago',
    status: 'edited',
  },
  {
    title: 'Holiday Campaign Brief',
    sub: '8 slides · Northwind Retail',
    kit: 'Northwind Retail', chip: '#7c3aed',
    edited: 'Mar 12',
    status: 'pdf',
  },
  {
    title: 'Lumen Series A Pitch',
    sub: '18 slides · Lumen Robotics',
    kit: 'Lumen Robotics', chip: '#0071e3',
    edited: 'Mar 8',
    status: 'generated',
  },
  {
    title: 'Customer Story · Glasswing',
    sub: '6 slides · Glasswing Studios',
    kit: 'Default', chip: '#1d1d1f',
    edited: 'Mar 2',
    status: 'pdf',
  },
];

// Simple thumbnail variants so the grid doesn't feel uniform.
function DeckThumb({ deck, w = 248, h = 140 }) {
  if (deck.thumb === 'iron-den') {
    return (
      <ScaledSlide width={w}>
        <IronDenCover templates={{ pageNumber: true, title: true, logo: true }} />
      </ScaledSlide>
    );
  }
  // Stylized placeholder thumbs — match the deck's "kit" color
  const bg = deck.status === 'pdf' || deck.chip === '#0a6f3c'
    ? '#f5f5f7'
    : deck.chip === '#7c3aed' ? '#1d1d1f'
    : '#fff';
  const text = bg === '#1d1d1f' ? '#fff' : '#1d1d1f';
  return (
    <div style={{
      width: w, height: h,
      background: bg, color: text,
      borderRadius: 6,
      border: '1px solid rgba(0,0,0,0.06)',
      padding: 14,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div>
        <div style={{
          fontSize: 7, letterSpacing: 1.2,
          fontWeight: 700, textTransform: 'uppercase',
          color: deck.chip, opacity: 0.9,
        }}>
          {deck.kit}
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 16, fontWeight: 600, lineHeight: 1.12, letterSpacing: -0.4,
          fontFamily: 'var(--font-display)',
        }}>
          {deck.title.replace(/^.* — /, '').slice(0, 28)}
        </div>
      </div>
      {/* miniature content */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
        <div style={{ width: 50, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 2 }}/>
        <div style={{ width: 30, height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 2 }}/>
        <div style={{ width: 18, height: 6, background: deck.chip, borderRadius: 2 }}/>
      </div>
      {/* page number */}
      <div style={{ position: 'absolute', right: 10, bottom: 6, fontSize: 7,
                    color: text === '#fff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
        01 / {deck.sub.match(/\d+/)?.[0] || '10'}
      </div>
    </div>
  );
}

function DeckCard({ deck, active }) {
  const statusLabel = {
    draft:     { label: 'AI plan ready',  color: '#0071e3' },
    generated: { label: 'Generated',      color: '#1d1d1f' },
    edited:    { label: 'Edited',         color: '#1d1d1f' },
    pdf:       { label: 'PDF exported',   color: '#0a6f3c' },
  }[deck.status];

  return (
    <div className="surface" style={{
      padding: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
      cursor: 'pointer',
      boxShadow: active ? '0 0 0 1.5px var(--color-accent)' : 'var(--app-shadow-soft)',
      borderColor: active ? 'transparent' : 'var(--app-border)',
    }}>
      <DeckThumb deck={deck} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-text)', lineHeight: 1.3, letterSpacing: -0.1,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {deck.title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--app-text-2)', marginTop: 2 }}>
          {deck.sub}
        </div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <span className="chip" style={{ background: 'transparent', boxShadow: 'inset 0 0 0 1px var(--app-border)' }}>
          <span className="chip-dot" style={{ background: deck.chip, opacity: 1 }}/>
          {deck.kit}
        </span>
        <span style={{ flex: 1 }}/>
        <span className="micro" style={{ color: statusLabel.color, fontWeight: 500 }}>
          {statusLabel.label}
        </span>
      </div>
      <div className="row" style={{ borderTop: '1px solid var(--app-divider)', paddingTop: 10, gap: 8 }}>
        <span className="micro">{deck.edited}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ color: 'var(--app-text-3)' }}><Icon.more/></span>
      </div>
    </div>
  );
}

function NewDeckHero() {
  return (
    <div style={{
      padding: 18,
      background: 'var(--color-near-black)',
      color: '#fff',
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
      minHeight: 230,
    }}>
      <div style={{
        position: 'absolute', inset: 'auto -40px -40px auto', width: 200, height: 200,
        background: 'radial-gradient(closest-side, rgba(0,113,227,0.55), transparent)',
        filter: 'blur(8px)',
      }}/>
      <div className="row" style={{ gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 11, position: 'relative' }}>
        <Icon.spark/> AI · Start from a brief
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600,
                      lineHeight: 1.05, letterSpacing: -0.6 }}>
          Describe the deck<br/>you want.
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.65)', maxWidth: 220 }}>
          A title, an audience, a few bullets — Slideline plans the slides
          before generating them.
        </div>
      </div>
      <div className="row" style={{ gap: 8, position: 'relative' }}>
        <button className="btn-app btn-app--primary" style={{ height: 32 }}>
          <Icon.plus/> New deck
        </button>
        <button className="btn-app" style={{ height: 32, background: 'rgba(255,255,255,0.10)',
                                              borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          Use template
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="artboard">
      <AppNav
        breadcrumb={['Decks']}
        right={<button className="btn-app btn-app--primary"><Icon.plus/>New deck</button>}
      />
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar active="decks" />
        <main className="grow" style={{ overflow: 'auto', padding: '32px 40px 40px' }}>
          {/* Page header */}
          <div className="row" style={{ alignItems: 'baseline', marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600,
                         letterSpacing: -0.7, margin: 0 }}>
              Recent decks
            </h1>
            <div style={{ flex: 1 }}/>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn-app"><Icon.grid/> Grid</button>
              <button className="btn-app btn-app--ghost">Sort: Last edited <Icon.chevDown/></button>
            </div>
          </div>
          <p style={{ color: 'var(--app-text-2)', marginTop: 4, fontSize: 14, maxWidth: 580 }}>
            Twelve decks in your workspace. Drafts hold the AI plan; generated decks
            keep their version history.
          </p>

          {/* Filter tabs */}
          <div className="row" style={{ gap: 4, marginTop: 22, borderBottom: '1px solid var(--app-divider)' }}>
            {[
              { l: 'All', c: 12, active: true },
              { l: 'AI plans', c: 3 },
              { l: 'Generated', c: 7 },
              { l: 'PDF exported', c: 5 },
              { l: 'Shared with me', c: 2 },
            ].map((t) => (
              <div key={t.l} style={{
                padding: '10px 14px',
                fontSize: 13, fontWeight: t.active ? 500 : 400,
                color: t.active ? 'var(--app-text)' : 'var(--app-text-2)',
                borderBottom: t.active ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {t.l}
                <span className="mono" style={{ fontSize: 11, color: 'var(--app-text-3)' }}>{t.c}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            marginTop: 24,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          }}>
            <NewDeckHero/>
            {DECKS.map((d, i) => (
              <DeckCard key={i} deck={d} active={i === 0} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, DeckCard, DeckThumb });
