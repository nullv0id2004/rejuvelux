const { Button: WButton, Icon: WIcon } = window.RejuveluxeDesignSystem_0fe2c7;
// Scroll-driven split-panel showcase, after the reference video: each product owns one viewport of scroll; a dark wipe sweeps between products.
function ScrollShowcase({ onAdd, onOpen, mobile }) {
  const N = PRODUCTS.length;
  const wrapRef = React.useRef(null);
  const [idx, setIdx] = React.useState(0);
  const [shown, setShown] = React.useState(0);
  const [wipe, setWipe] = React.useState('idle');
  const target = React.useRef(0);
  const shownRef = React.useRef(0);
  const busy = React.useRef(false);
  const timers = React.useRef([]);
  const run = React.useCallback(() => {
    if (busy.current || target.current === shownRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { shownRef.current = target.current; setShown(target.current); return; }
    busy.current = true; setWipe('in');
    timers.current = [
      setTimeout(() => { shownRef.current = target.current; setShown(target.current); setWipe('out'); }, 460),
      setTimeout(() => { setWipe('idle'); busy.current = false; run(); }, 960),
    ];
  }, []);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  React.useEffect(() => { target.current = idx; run(); }, [idx, run]);
  React.useEffect(() => {
    const onScroll = () => { const el = wrapRef.current; if (!el) return; const r = el.getBoundingClientRect(); const span = r.height - window.innerHeight; const prog = Math.min(1, Math.max(0, -r.top / span)); setIdx(Math.min(N - 1, Math.floor(prog * N))); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  const jump = (i) => { const el = wrapRef.current; const r = el.getBoundingClientRect(); const span = r.height - window.innerHeight; const y = window.scrollY + r.top + span * ((i + .5) / N); window.scrollTo({ top: y, behavior: 'smooth' }); };
  const p = PRODUCTS[shown];
  const dot = p.id === 'silver' ? 'var(--gold-500)' : 'var(--bone-100)';
  return <section ref={wrapRef} className="sc-wrap" data-screen-label="Collection · scroll showcase" style={{ height: `${(N + 1) * 100}vh` }}>
    <div className="sc-stage">
      <div className="sc-left" style={{ background: p.tin }}>
        <div className="sc-block-ink" style={{ background: p.ink }} />
        <div className="sc-block-dark" />
        <img key={p.id} className="tin-in sc-tin" src={p.image} alt={`${p.name} tin`} onClick={() => onOpen(p)} />
        <div className="sc-dots">{PRODUCTS.map((q, i) => <button key={q.id} aria-label={q.name} aria-current={i === idx} onClick={() => jump(i)} style={{ borderColor: dot, background: i === idx ? dot : 'transparent' }} />)}</div>
      </div>
      <div className="sc-right">
        <div key={p.id} className="copy-in sc-copy">
          <div className="sc-frame sc-tag">{p.category} · {p.descriptor}</div>
          <div className="sc-frame sc-title"><h2 className="h1 it" style={{ textAlign: 'center', fontSize: 'clamp(34px,4.2cqw,60px)' }}>{p.name}</h2></div>
          <div className="sc-grid">
            <div className="sc-frame sc-desc"><p className="small">{p.description}</p></div>
            <div className="sc-frame sc-notes">
              <div style={{ color: p.ink }}><Scale label="Body" value={p.body} /></div>
              <div style={{ color: p.ink }}><Scale label="Briskness" value={p.brisk} /></div>
              <div className="stack g2"><span className="eyebrow muted">Brew</span><span className="cap num" style={{ color: 'var(--text-primary)' }}>{p.brew.temp} · {p.brew.g}<br />{p.brew.min}</span></div>
            </div>
          </div>
          <Evidence style={{ marginTop: 12 }} rows={[['Grade', SLOT.grade], ['Lot', SLOT.lot], ['Net weight', p.weight]]} />
        </div>
        <div className="sc-foot">
          <div key={'pr' + p.id} className="copy-in row g2" style={{ alignItems: 'baseline' }}><span className="price" style={{ fontSize: 26 }}>{fmt(PRICE)}<span className="cap">*</span></span><span className="cap">/ {p.weight}</span></div>
          <div className="row g2">
            <WButton variant="outline" size="sm" style={{ width: 44, padding: 0 }} onClick={() => jump(Math.max(0, idx - 1))} aria-label="Previous"><WIcon name="arrow-left" size={14} /></WButton>
            <WButton variant="outline" size="sm" style={{ width: 44, padding: 0 }} onClick={() => jump(Math.min(N - 1, idx + 1))} aria-label="Next"><WIcon name="arrow-right" size={14} /></WButton>
            <WButton onClick={() => onAdd(p)}>Add to cart</WButton>
          </div>
        </div>
        <div className="sc-count cap num">{String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</div>
      </div>
      <div className={'wipe ' + wipe} aria-hidden="true" />
    </div>
  </section>;
}
Object.assign(window, { ScrollShowcase });
