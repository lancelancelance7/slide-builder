// NewDeck.jsx — "Describe the deck you want" prompt entry.
// Centered, calm. The prompt textarea is the hero. Below it: a row of
// dialed-in controls (brand kit, length, audience, tone), then sample
// prompts and a primary "Plan the deck" CTA.

function NewDeck() {
  return (
    <div className="artboard">
      <AppNav
        breadcrumb={['Decks', 'New deck']}
        right={
          <>
            <button className="btn-app btn-app--ghost">Cancel</button>
          </>
        }
      />
      <div className="row" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar active="decks" />
        <main className="grow" style={{ overflow: 'auto', padding: '40px 60px 60px',
                                         display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 820, maxWidth: '100%' }}>
            {/* Step header */}
            <div className="row" style={{ gap: 8, marginBottom: 20, color: 'var(--app-text-2)', fontSize: 12 }}>
              <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                             background: 'var(--color-accent)', color: '#fff',
                             alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>1</span>
              <span style={{ color: 'var(--app-text)', fontWeight: 500 }}>Describe</span>
              <span style={{ width: 24, height: 1, background: 'var(--app-border)' }}/>
              <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                             background: 'var(--app-surface)', border: '1px solid var(--app-border)',
                             color: 'var(--app-text-2)',
                             alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>2</span>
              <span>Review the plan</span>
              <span style={{ width: 24, height: 1, background: 'var(--app-border)' }}/>
              <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 50,
                             background: 'var(--app-surface)', border: '1px solid var(--app-border)',
                             color: 'var(--app-text-2)',
                             alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>3</span>
              <span>Generate</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600,
                          lineHeight: 1.05, letterSpacing: -1, margin: 0 }}>
              Describe the deck.
            </h1>
            <p style={{ fontSize: 17, color: 'var(--app-text-2)', maxWidth: 560,
                        marginTop: 10, lineHeight: 1.45 }}>
              A title, an audience, a few bullets. Slideline will draft a slide-by-slide plan
              for you to review before any pixels move.
            </p>

            {/* Prompt panel */}
            <div className="surface" style={{
              marginTop: 28, padding: 0, overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.06)',
            }}>
              <div style={{ padding: '18px 20px 12px' }}>
                <div style={{
                  fontSize: 17, color: 'var(--app-text)', lineHeight: 1.5,
                  minHeight: 140, letterSpacing: -0.2,
                }}>
                  10 slides for a sales proposal to <strong>Iron Den Fitness</strong>, a local
                  gym opening a second location. Pitch a 2-quarter membership growth
                  plan — brand-led funnel, trial pass program, retargeting. Audience is
                  the owner and his business partner. Make it punchy and confident, not corporate.
                  Include a slide comparing us to two other agencies, and end with a clear
                  ask: a 6-week paid pilot at $14k.<span style={{
                    display: 'inline-block', width: 1.5, height: 18,
                    background: 'var(--color-accent)', marginLeft: 2,
                    verticalAlign: 'middle',
                  }}/>
                </div>
              </div>

              {/* Toolbar */}
              <div className="row" style={{
                padding: '10px 14px',
                borderTop: '1px solid var(--app-divider)',
                background: 'var(--app-surface-2)',
                gap: 10,
              }}>
                <span className="chip">
                  <span className="chip-dot" style={{ background: '#ff4500', opacity: 1 }}/>
                  Iron Den Fitness <Icon.chevDown/>
                </span>
                <span className="chip"><Icon.deck/> 10 slides <Icon.chevDown/></span>
                <span className="chip">Audience: Owner + partner <Icon.chevDown/></span>
                <span className="chip">Tone: Direct <Icon.chevDown/></span>
                <span style={{ flex: 1 }}/>
                <span className="micro mono">312 / 1200</span>
              </div>
            </div>

            {/* CTA row */}
            <div className="row" style={{ marginTop: 22, gap: 12 }}>
              <button className="btn-app btn-app--primary btn-app--lg">
                <Icon.spark/> Plan the deck
              </button>
              <button className="btn-app btn-app--lg">
                Save as draft
              </button>
              <span style={{ flex: 1 }}/>
              <div className="row" style={{ gap: 6, color: 'var(--app-text-2)', fontSize: 12 }}>
                Powered by ChatGPT 5.5 · est. 12s
              </div>
            </div>

            {/* Detail flap */}
            <div className="row" style={{ marginTop: 30, gap: 28, alignItems: 'flex-start' }}>
              {/* Suggested prompts */}
              <section style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="field-label">Start from a sample</label>
                <div className="col" style={{ gap: 8 }}>
                  {[
                    ['Sales proposal', 'For a local business, 8–12 slides, ends with an ask.'],
                    ['Board update', 'Quarterly, 5 financial slides + roadmap, sober tone.'],
                    ['Customer story', '6 slides, problem → solution → result with quotes.'],
                    ['Product launch', 'Internal kickoff, 14 slides with positioning & timeline.'],
                  ].map(([t, s], i) => (
                    <div key={t} style={{
                      padding: 12, border: '1px solid var(--app-border)',
                      background: 'var(--app-surface)', borderRadius: 8,
                      cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, flex: '0 0 28px',
                        background: 'rgba(0,113,227,0.08)',
                        color: 'var(--color-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon.deck/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                        <div className="micro" style={{ marginTop: 2 }}>{s}</div>
                      </div>
                      <span style={{ color: 'var(--app-text-3)' }}><Icon.chev/></span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Advanced */}
              <section style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="field-label">Plan settings</label>
                <div className="col" style={{ gap: 12 }}>
                  <div>
                    <div className="row" style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>Slide count</span>
                      <span style={{ flex: 1 }}/>
                      <span className="mono micro" style={{ color: 'var(--app-text)' }}>10 slides</span>
                    </div>
                    <div style={{ position: 'relative', height: 6, background: 'rgba(0,0,0,0.08)',
                                  borderRadius: 999 }}>
                      <div style={{ position: 'absolute', inset: 0, right: '50%',
                                    background: 'var(--color-accent)', borderRadius: 999 }}/>
                      <div style={{ position: 'absolute', top: -5, left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 16, height: 16, background: '#fff',
                                    borderRadius: '50%', border: '1px solid var(--app-border)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}/>
                    </div>
                    <div className="row" style={{ marginTop: 4, color: 'var(--app-text-3)', fontSize: 11 }}>
                      <span>4</span><span style={{ flex: 1 }}/><span>30</span>
                    </div>
                  </div>

                  <div>
                    <div className="micro" style={{ marginBottom: 6, color: 'var(--app-text-2)', fontWeight: 500 }}>Layouts to include</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {[
                        ['Title', true],
                        ['Section', true],
                        ['Image + text', true],
                        ['Quote', true],
                        ['Comparison', true],
                        ['Stat hero', false],
                        ['Closing', true],
                      ].map(([l, on]) => (
                        <span key={l} className="chip" style={{
                          background: on ? 'rgba(0,113,227,0.10)' : 'transparent',
                          boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--app-border)',
                          color: on ? 'var(--color-accent)' : 'var(--app-text-2)',
                        }}>
                          {on && <Icon.check/>}
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="row" style={{ gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div className="micro" style={{ marginBottom: 6, color: 'var(--app-text-2)', fontWeight: 500 }}>Images</div>
                      <select className="select-app">
                        <option>Generate prompts</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="micro" style={{ marginBottom: 6, color: 'var(--app-text-2)', fontWeight: 500 }}>Speaker notes</div>
                      <select className="select-app">
                        <option>Yes — short</option>
                      </select>
                    </div>
                  </div>

                  <div className="row" style={{ gap: 6, padding: '10px 0', alignItems: 'flex-start' }}>
                    <div className="toggle toggle--on" style={{ marginTop: 2 }}/>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>Preview plan before generating</div>
                      <div className="micro" style={{ marginTop: 2 }}>Review and edit slide titles, content, and image briefs.</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { NewDeck });
