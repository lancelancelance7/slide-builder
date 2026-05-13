// Shared chrome — top nav, left sidebar, simple icons, brand-kit chips.
// Pure presentation; nothing wires together yet.

const Icon = {
  search: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  plus: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  chev: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevDown: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  deck: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="3.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 14h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  brand: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="3.5" width="5" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  template: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2.5 6h11M6 6v7.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  trash: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10M6 5V3h4v2M5 5l.5 8h5l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  spark: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5c.4 2.5 1.5 3.6 4 4-2.5.4-3.6 1.5-4 4-.4-2.5-1.5-3.6-4-4 2.5-.4 3.6-1.5 4-4Z" fill="currentColor"/>
      <path d="M13 9.5c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" fill="currentColor"/>
    </svg>
  ),
  more: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="3.5" cy="8" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
      <circle cx="12.5" cy="8" r="1.2" fill="currentColor"/>
    </svg>
  ),
  download: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  share: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.7 7L10.3 5M5.7 9L10.3 11" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  textT: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M4 4h8M8 4v9M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  image: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="6" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 12l3.5-3.5L9 11l2-2 2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  shape: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  layout: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2.5 6h11M6 6v7.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  grid: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="9" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  drag: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="4" r="1" fill="currentColor"/>
      <circle cx="10" cy="4" r="1" fill="currentColor"/>
      <circle cx="6" cy="8" r="1" fill="currentColor"/>
      <circle cx="10" cy="8" r="1" fill="currentColor"/>
      <circle cx="6" cy="12" r="1" fill="currentColor"/>
      <circle cx="10" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pencil: () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M2.5 13.5l1-3 7-7 2 2-7 7-3 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
};

// Generic top nav. Pass either { product:true } for the dashboard nav or
// { fileName, breadcrumb, right } for the editor variants.
function AppNav({ breadcrumb, right, fileName, showSearch = true }) {
  return (
    <div className="appnav">
      <div className="appnav__brand">
        <div className="appnav__brand-mark">S</div>
        <span>Slideline</span>
      </div>
      {breadcrumb && (
        <>
          <div style={{ color: 'var(--app-text-3)' }}>/</div>
          <div className="appnav__crumbs">
            {breadcrumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">/</span>}
                <span style={i === breadcrumb.length - 1 ? { color: 'var(--app-text)', fontWeight: 500 } : null}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
      {fileName && (
        <div className="row" style={{ gap: 6, marginLeft: 4 }}>
          <span style={{ color: 'var(--app-text)', fontWeight: 500, fontSize: 13 }}>{fileName}</span>
          <span style={{ color: 'var(--app-text-3)', fontSize: 11 }}>· Saved</span>
        </div>
      )}
      <div className="appnav__spacer" />
      {showSearch && (
        <div className="appnav__search">
          <Icon.search />
          <span>Search decks & kits</span>
          <kbd>⌘K</kbd>
        </div>
      )}
      <div className="appnav__actions">
        {right}
        <div className="appnav__avatar">CD</div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, count, chip, ...rest }) {
  return (
    <div className={"sidebar__item" + (active ? " sidebar__item--active" : "")} {...rest}>
      {icon}
      <span>{label}</span>
      {count != null && <span className="sidebar__count">{count}</span>}
      {chip && <span className="sidebar__chip" style={{ background: chip }} />}
    </div>
  );
}

function Sidebar({ active = 'decks' }) {
  return (
    <aside className="sidebar">
      <SidebarItem icon={<Icon.deck />} label="Recent" active={active === 'decks'} count={12} />
      <SidebarItem icon={<Icon.spark />} label="AI plans" count={3} />
      <SidebarItem icon={<Icon.template />} label="Templates" count={6} />
      <SidebarItem icon={<Icon.trash />} label="Trash" />

      <div className="sidebar__section">Brand kits</div>
      <SidebarItem icon={<Icon.brand />} label="Iron Den Fitness" active={active === 'kit:iron-den'} chip="#ff4500" />
      <SidebarItem label="Northwind Retail" chip="#7c3aed" icon={<span style={{ width: 14 }} />} />
      <SidebarItem label="Acme Capital" chip="#0a6f3c" icon={<span style={{ width: 14 }} />} />
      <SidebarItem label="Lumen Robotics" chip="#0071e3" icon={<span style={{ width: 14 }} />} />
      <SidebarItem icon={<Icon.plus />} label="New brand kit" />

      <div style={{ flex: 1 }} />
      <div className="micro" style={{ padding: '8px 10px' }}>Slideline 0.8 · by CubDigital</div>
    </aside>
  );
}

Object.assign(window, { Icon, AppNav, Sidebar, SidebarItem });
