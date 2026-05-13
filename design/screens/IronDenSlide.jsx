// IronDenSlide.jsx — the recurring Iron Den Fitness sales proposal slide,
// rendered at any pixel size. Used as the thumbnail in dashboard cards,
// as the live preview in the brand-kit editor, and as the canvas surface
// in the slide editor.
//
// All measurements are in slide-unit space (1280x720) and the slide is
// scaled by CSS transform: scale().

const IronDen = {
  bg: '#0c0c0d',
  bg2: '#16161a',
  text: '#ffffff',
  textDim: 'rgba(255,255,255,0.62)',
  accent: '#ff4500',
  accent2: '#ffb38a',
  rule: 'rgba(255,255,255,0.10)',
  font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  display: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
};

function ironDenStyles(showChrome = true, templates = { pageNumber: true, title: true, logo: true }) {
  return {
    slide: {
      width: 1280, height: 720,
      background: IronDen.bg,
      color: IronDen.text,
      fontFamily: IronDen.font,
      position: 'relative',
      overflow: 'hidden',
    },
    template_topRight: templates.title ? {
      position: 'absolute', top: 32, right: 40,
      fontSize: 14, fontWeight: 500, letterSpacing: 0.4,
      color: IronDen.textDim,
      textTransform: 'uppercase',
    } : null,
    template_logo: templates.logo ? {
      position: 'absolute', left: 40, bottom: 32,
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: IronDen.display,
      fontSize: 13, fontWeight: 700,
      letterSpacing: 2,
      textTransform: 'uppercase',
    } : null,
    template_pageNum: templates.pageNumber ? {
      position: 'absolute', right: 40, bottom: 32,
      fontSize: 13, fontWeight: 500,
      color: IronDen.textDim,
      fontVariantNumeric: 'tabular-nums',
    } : null,
  };
}

// Reusable mini brand-mark for Iron Den
function IronDenMark({ size = 22, ring = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flex: '0 0 auto' }}>
      {ring && <circle cx="16" cy="16" r="14.5" stroke={IronDen.accent} strokeWidth="1.5" fill="none"/>}
      <path d="M16 7 L23 16 L16 25 L9 16 Z" fill={IronDen.accent}/>
      <path d="M16 13 L20 16 L16 19 L12 16 Z" fill={IronDen.bg}/>
    </svg>
  );
}

// Hero "cover" slide — used in dashboard thumbnails
function IronDenCover({ templates }) {
  const s = ironDenStyles(true, templates);
  return (
    <div style={s.slide}>
      {/* Diagonal accent strip */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 360, height: '100%',
        background: 'linear-gradient(180deg, #ff4500 0%, #b22d00 100%)',
        clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 0.92,
      }}/>
      {/* eyebrow */}
      <div style={{ position: 'absolute', top: 220, left: 80,
                    fontSize: 18, fontWeight: 600, letterSpacing: 4,
                    color: IronDen.accent, textTransform: 'uppercase' }}>
        Sales Proposal · Q2 2026
      </div>
      <div style={{ position: 'absolute', top: 270, left: 80, width: 720 }}>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.4,
                      fontFamily: IronDen.display }}>
          Train hard.<br/>Sell harder.
        </div>
        <div style={{ marginTop: 30, fontSize: 22, color: IronDen.textDim, maxWidth: 620, lineHeight: 1.35 }}>
          A 10-slide plan to grow Iron Den Fitness membership by 30% in the next two quarters.
        </div>
      </div>
      <div style={s.template_logo}>
        <IronDenMark size={26}/> Iron Den Fitness
      </div>
      <div style={s.template_pageNum}>01 / 10</div>
      <div style={s.template_topRight}>Iron Den · Proposal</div>
    </div>
  );
}

// "Image + Text" content slide — used as the live preview throughout
function IronDenContent({ templates }) {
  const s = ironDenStyles(true, templates);
  return (
    <div style={s.slide}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid',
                    gridTemplateColumns: '1fr 1fr' }}>
        {/* Left text */}
        <div style={{ padding: '120px 60px 100px 80px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4,
                        color: IronDen.accent, textTransform: 'uppercase', marginBottom: 18 }}>
            03 · The Opportunity
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.06, letterSpacing: -1.6,
                        fontFamily: IronDen.display, marginBottom: 26 }}>
            Local gyms are losing the digital fight.
          </div>
          <div style={{ fontSize: 19, color: IronDen.textDim, lineHeight: 1.45, maxWidth: 460 }}>
            Iron Den's audience is searching online first and walking in second.
            We'll close that loop with a brand-led membership funnel and a
            calendar built to convert trial passes into recurring revenue.
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {[
              ['68%', 'find gyms online'],
              ['3.2x', 'lift from retargeting'],
              ['11 wk', 'to payback'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 36, fontWeight: 700, color: IronDen.accent, fontFamily: IronDen.display }}>{n}</div>
                <div style={{ fontSize: 13, color: IronDen.textDim, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right image */}
        <div style={{ position: 'relative', background: '#1d1d1f', margin: '60px 60px 80px 0',
                      borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(120% 80% at 30% 30%, #2a1a10 0%, #0c0c0d 60%, #000 100%)',
          }}/>
          {/* placeholder "gym photo" — abstract weight shapes */}
          <svg viewBox="0 0 400 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff4500" stopOpacity="0.0"/>
                <stop offset="100%" stopColor="#ff4500" stopOpacity="0.18"/>
              </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#g1)"/>
            <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" fill="none">
              <circle cx="120" cy="200" r="36"/>
              <circle cx="280" cy="200" r="36"/>
              <rect x="156" y="195" width="88" height="10" rx="2"/>
            </g>
            <g fill="rgba(255,255,255,0.05)">
              <circle cx="120" cy="200" r="34"/>
              <circle cx="280" cy="200" r="34"/>
            </g>
            <text x="200" y="350" textAnchor="middle"
                  fontFamily={IronDen.font} fontSize="11"
                  fill="rgba(255,255,255,0.32)" letterSpacing="2">
              IMG-03 · TRAINING FLOOR
            </text>
          </svg>
        </div>
      </div>
      <div style={s.template_logo}>
        <IronDenMark size={22}/> Iron Den
      </div>
      <div style={s.template_pageNum}>03 / 10</div>
      <div style={s.template_topRight}>The Opportunity</div>
    </div>
  );
}

// A scaled wrapper — pass `width` to scale.
function ScaledSlide({ width, children }) {
  const scale = width / 1280;
  const height = 720 * scale;
  return (
    <div style={{
      width, height,
      overflow: 'hidden',
      borderRadius: 6,
      background: '#000',
      flex: '0 0 auto',
      position: 'relative',
    }}>
      <div style={{
        width: 1280, height: 720,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
      }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { IronDen, IronDenMark, IronDenCover, IronDenContent, ScaledSlide, ironDenStyles });
