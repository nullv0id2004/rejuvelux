const DS = window.RejuveluxeDesignSystem_0fe2c7;
const { Button, IconButton, Icon, Input, Dialog, Badge, RadioGroup, Switch } = DS;
const Eyebrow = ({ children, muted, style }) => <div className={'eyebrow' + (muted ? ' muted' : '')} style={style}>{children}</div>;
const Ph = ({ children }) => <span className="ph">{children}</span>;
const Slot = ({ v }) => (/^\[.*\]$/.test(String(v)) ? <Ph>{v}</Ph> : v);
function Wordmark({ stacked, size = 22, onClick, inverse }) {
  const color = inverse ? 'var(--bone-100)' : 'var(--text-primary)';
  const strap = inverse ? 'var(--gold-300)' : 'var(--text-accent)';
  if (stacked) return <div onClick={onClick} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, color, cursor: onClick ? 'pointer' : 'default' }}><span className="wordmark" style={{ fontSize: size }}>Rejuveluxe</span><span className="strap" style={{ color: strap, fontSize: Math.max(8, size * .36) }}>◆ Earned not indulged ◆</span></div>;
  return <div onClick={onClick} className="wm" style={{ color, cursor: onClick ? 'pointer' : 'default' }}><span className="wordmark" style={{ fontSize: size }}>Rejuveluxe</span><span className="strap hide-m" style={{ color: strap, fontSize: 8 }}>◆ Earned not indulged ◆</span></div>;
}
function Greybox({ label, ratio = '3 / 2', style, className = '' }) {
  return <div className={'greybox photo ' + className} style={{ aspectRatio: ratio, ...style }} role="img" aria-label={label + ' — interim photograph'}><img src="assets/tea-field.jpeg" alt="" /><div className="gl">{label} · {ratio.replace(/\s/g, '')} · Interim</div></div>;
}
function Evidence({ rows, inverse, style }) {
  return <div className={'ev' + (inverse ? ' inv' : '')} style={style}>{rows.map(([k, v]) => <div className="ev-row" key={k}><span className="k">{k}</span><span className="v"><Slot v={v} /></span></div>)}</div>;
}
function Swatch({ p, size = 24, style }) {
  return <span className="swatch" title={p.name} style={{ width: size, height: size, background: p.tin, boxShadow: `inset 0 0 0 1px ${p.ink}`, ...style }} />;
}
function Scale({ label, value, color }) {
  return <div className="stack g2" style={{ color, minWidth: 0 }}><div className="between"><span className="eyebrow muted">{label}</span><span className="cap num">{value}/5</span></div><div className="scale" aria-label={`${label} ${value} of 5`}>{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= value ? 'on' : ''} />)}</div></div>;
}
function Accordion({ items, single }) {
  const [open, setOpen] = React.useState(null);
  return <div className="stack" style={{ borderTop: 'var(--rule)' }}>{items.map(([q, a], i) => <AccItem key={q} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}</div>;
}
function AccItem({ q, a, open, onToggle }) {
  const ref = React.useRef(null);
  const [h, setH] = React.useState(0);
  React.useEffect(() => { setH(open && ref.current ? ref.current.scrollHeight : 0); }, [open]);
  return <div className="acc"><button className="acc-h" aria-expanded={open} onClick={onToggle}><span>{q}</span><span className="sym" aria-hidden="true">{open ? '−' : '+'}</span></button><div className="acc-b" style={{ height: h }}><div ref={ref}><p className="small">{a}</p></div></div></div>;
}
function Tile({ p, onOpen, onAdd }) {
  return <article className="tile" style={{ borderTopColor: p.ink, borderTopWidth: 3 }}>
    <div className="tinbox" style={{ background: p.tin, cursor: 'pointer' }} onClick={() => onOpen(p)}><img src={p.image} alt={`${p.name} tin`} /></div>
    <div className="tile-body">
      <div className="between" style={{ alignItems: 'flex-start' }}><div><h3 className="h3" style={{ cursor: 'pointer' }} onClick={() => onOpen(p)}>{p.name}</h3><p className="small it">{p.descriptor}</p></div><Swatch p={p} /></div>
      <Evidence rows={[['Grade', SLOT.grade], ['Net weight', p.weight]]} />
      <div className="between"><span className="price">{fmt(PRICE)}<span className="cap" title="Placeholder price">*</span></span><span className="cap">{p.category}</span></div>
      <div className="row g2" style={{ flexWrap: 'wrap' }}><Button size="sm" onClick={() => onAdd(p)}>Add to cart</Button><Button size="sm" variant="outline" onClick={() => onOpen(p)}>Details</Button></div>
    </div>
  </article>;
}
function Ladder({ active, onSelect, onOpen, compact }) {
  return <div className="ladder">
    <div style={{ minWidth: compact ? 0 : 1120 }} className="ladder-inner">
      <div className="ladder-axis"><span>Ceremonial</span><span className="hide-m">One garden · five expressions</span><span>Everyday</span></div>
      <div className="ladder-track">{PRODUCTS.map((p, i) => <button key={p.id} className={'stop' + (active === p.id ? ' on' : '')} onMouseEnter={() => onSelect && onSelect(p.id)} onFocus={() => onSelect && onSelect(p.id)} onClick={() => onOpen && onOpen(p)} aria-pressed={active === p.id}>
        <div className="between"><span className="eyebrow muted">{String(i + 1).padStart(2, '0')}</span><Swatch p={p} /></div>
        <div className="tinbox"><img src={p.image} alt="" /></div>
        <div><h3 className="h3">{p.name}</h3><p className="small it">{p.descriptor}</p></div>
        <div className="stack g3" style={{ color: p.ink }}><Scale label="Body" value={p.body} /><Scale label="Briskness" value={p.brisk} /></div>
        <div className="between"><span className="price">{fmt(PRICE)}<span className="cap">*</span></span><span className="cap">{p.weight}</span></div>
      </button>)}</div>
    </div>
  </div>;
}
const ANN = ['Free shipping above ₹[0,000] · India-wide', 'Current flush · [FLUSH] [0000]', 'Dispatch within [00] hours · Lot number on every tin'];
function Announcement() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % ANN.length), 4000); return () => clearInterval(t); }, []);
  return <div className="ann" role="status"><span key={i}>{ANN[i]}</span></div>;
}
const NAV = [['shop', 'Shop'], ['garden', 'The Garden'], ['craft', 'The Craft'], ['wholesale', 'Wholesale'], ['contact', 'Contact']];
function Nav({ page, go, cartCount, onCart, toast, centred }) {
  const [menu, setMenu] = React.useState(false);
  const click = (k) => { setMenu(false); if (k === 'wholesale' || k === 'contact') return toast({ title: NAV.find((n) => n[0] === k)[1], description: 'Page not in this prototype.' }); go(k === 'shop' ? 'home' : k, k === 'shop' ? 'collection' : undefined); };
  const link = ([k, l]) => <button key={k} className={page === k || (k === 'shop' && (page === 'home' || page === 'product')) ? 'on' : ''} onClick={() => click(k)}>{l}</button>;
  if (centred) return <>
    <header className="nav"><div className="wrap nav-c">
      <nav className="nav-links" aria-label="Primary">{NAV.slice(0, 3).map(link)}</nav><span className="menu-btn"><IconButton label="Menu" variant="ghost" onClick={() => setMenu(!menu)}><Icon name={menu ? 'x' : 'menu'} size={20} /></IconButton></span>
      <Wordmark stacked size={20} onClick={() => go('home')} />
      <div className="row g6" style={{ justifyContent: 'flex-end' }}><nav className="nav-links" aria-label="Secondary">{NAV.slice(3).map(link)}</nav><IconButton label="Cart" variant="ghost" badge={cartCount || undefined} onClick={onCart}><Icon name="shopping-bag" size={20} /></IconButton></div>
    </div></header>
    {menu && <div className="mobile-menu">{NAV.map(([k, l]) => <button key={k} onClick={() => click(k)}>{l}</button>)}</div>}
  </>;
  return <>
    <header className="nav"><div className="wrap">
      <Wordmark onClick={() => go('home')} />
      <nav className="nav-links" aria-label="Primary">{NAV.map(([k, l]) => <button key={k} className={page === k || (k === 'shop' && (page === 'home' || page === 'product')) ? 'on' : ''} onClick={() => click(k)}>{l}</button>)}</nav>
      <div className="row g2"><IconButton label="Cart" variant="ghost" badge={cartCount || undefined} onClick={onCart}><Icon name="shopping-bag" size={20} /></IconButton><span className="menu-btn"><IconButton label="Menu" variant="ghost" onClick={() => setMenu(!menu)}><Icon name={menu ? 'x' : 'menu'} size={20} /></IconButton></span></div>
    </div></header>
    {menu && <div className="mobile-menu">{NAV.map(([k, l]) => <button key={k} onClick={() => click(k)}>{l}</button>)}</div>}
  </>;
}
function Footer({ go, toast }) {
  const [email, setEmail] = React.useState('');
  const dead = (l) => () => toast({ title: l, description: 'Page not in this prototype.' });
  return <footer className="footer"><div className="wrap stack g8">
    <div className="fgrid">
      <div className="stack g5" style={{ gap: 20 }}><Wordmark inverse stacked size={26} /><p className="small" style={{ color: 'var(--ink-400)', maxWidth: 280 }}>Single-origin Assam. One garden, one flush, one lot — printed on every tin.</p></div>
      <div className="stack g2"><div className="eyebrow">Shop</div>{PRODUCTS.map((p) => <button key={p.id} onClick={() => go('product', p.id)}>{p.name}</button>)}</div>
      <div className="stack g2"><div className="eyebrow">House</div><button onClick={() => go('garden')}>The Garden</button><button onClick={() => go('craft')}>The Craft</button><button onClick={dead('Wholesale')}>Wholesale</button><button onClick={dead('Contact')}>Contact</button></div>
      <div className="stack g2"><div className="eyebrow">Service</div><button onClick={dead('Shipping')}>Shipping</button><button onClick={dead('Returns')}>Returns</button><button onClick={dead('Brew guide')}>Brew guide</button><button onClick={dead('FAQ')}>FAQ</button></div>
      <div className="stack g4"><div className="eyebrow">The Flush Letter</div><p className="small" style={{ color: 'var(--ink-400)' }}>Flush notices. Brew notes. Garden reports. Lot releases.</p><form className="nl-form" onSubmit={(e) => { e.preventDefault(); if (!email.includes('@')) return toast({ tone: 'error', title: 'Enter a valid email' }); toast({ tone: 'success', title: 'Subscribed', description: email }); setEmail(''); }}><div data-theme="dark"><Input size="sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" /></div><Button size="sm" variant="inverse" type="submit">Join</Button></form></div>
    </div>
    <div className="between wrapm" style={{ gap: 12 }}><p className="cap" style={{ color: 'var(--ink-500)' }}>© 2026 RejuveLuxe · Assam, India · FSSAI Lic. No. <Ph>[00000000000000]</Ph></p><div className="row g6"><button onClick={dead('Instagram')}>Instagram</button><button onClick={dead('YouTube')}>YouTube</button><button onClick={dead('Privacy')}>Privacy</button><button onClick={dead('Terms')}>Terms</button></div></div>
  </div></footer>;
}
const FREE_AT = 2500;
function CartDrawer({ open, onClose, items, setItems, onAdd, toast, mobile }) {
  const total = items.reduce((s, it) => s + PRICE * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);
  const setQty = (id, q) => setItems(items.map((it) => it.id === id ? { ...it, qty: q } : it).filter((it) => it.qty > 0));
  const left = Math.max(0, FREE_AT - total);
  const addon = PRODUCTS.find((p) => !items.some((it) => it.id === p.id)) || PRODUCTS[0];
  React.useEffect(() => { if (!open) return; const d = document.querySelector('[role="dialog"]'); if (!d) return; const f = d.querySelectorAll('button,input,[tabindex]'); f[0] && f[0].focus(); const trap = (e) => { if (e.key !== 'Tab') return; const fs = [...d.querySelectorAll('button,input,[tabindex]')].filter((x) => !x.disabled); const a = fs[0], z = fs[fs.length - 1]; if (e.shiftKey && document.activeElement === a) { z.focus(); e.preventDefault(); } else if (!e.shiftKey && document.activeElement === z) { a.focus(); e.preventDefault(); } }; window.addEventListener('keydown', trap); return () => window.removeEventListener('keydown', trap); }, [open]);
  return <Dialog open={open} onClose={onClose} side="right" width={mobile ? '100%' : 420} eyebrow="Cart" title={count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Your cart is empty'}
    footer={items.length ? <div className="stack g4" style={{ width: '100%' }}>
      <div className="between small"><span>Shipping</span><span className="num">{left === 0 ? 'Free' : '₹[000]'}</span></div>
      <div className="between"><span className="eyebrow muted">Total</span><span className="price" style={{ fontSize: 26 }}>{fmt(total)}<span className="cap">*</span></span></div>
      <Button size="lg" fullWidth onClick={() => { onClose(); toast({ title: 'Checkout', description: 'Checkout is not part of this prototype.' }); }}>Checkout</Button>
      <p className="cap">Dispatch in <Ph>[00]</Ph> h · <Ph>[00]</Ph>-day return · *placeholder prices</p>
    </div> : null}>
    <div className="stack g3" style={{ paddingBottom: 20 }}><div className="between"><span className="eyebrow muted">{left === 0 ? 'Free shipping unlocked' : 'Free shipping'}</span><span className="cap num">{left === 0 ? '✓' : `${fmt(left)} to go`}</span></div><div className="progress"><i style={{ width: `${Math.min(100, total / FREE_AT * 100)}%` }} /></div></div>
    {items.length === 0 && <div className="stack g4" style={{ padding: '24px 0 32px' }}><p className="h3 it" style={{ color: 'var(--text-primary)' }}>Nothing in it yet.</p><p className="small">Five teas, one garden. Start with the one you already drink and work outward from there.</p><Button variant="outline" onClick={() => { onClose(); }}>Browse the collection</Button></div>}
    <div className="stack">{items.map(({ id, qty }) => { const p = byId(id); return <div key={id} style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 16, padding: '16px 0', borderBottom: 'var(--rule)', alignItems: 'center' }}>
      <div className="tinbox" style={{ background: p.tin, width: 72, height: 84 }}><img src={p.image} alt="" style={{ width: '70%', filter: 'drop-shadow(0 8px 8px rgba(20,19,17,.3))' }} /></div>
      <div className="stack g2"><div><div className="h3 it" style={{ color: 'var(--text-primary)', fontSize: 18 }}>{p.name}</div><div className="cap num">{p.weight} · Lot <Ph>{SLOT.lot}</Ph></div></div>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-default)', height: 32, borderRadius: 'var(--radius-xs)', width: 'fit-content' }}><button aria-label="Decrease" onClick={() => setQty(id, qty - 1)} style={{ width: 32, height: '100%', border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', display: 'grid', placeItems: 'center' }}><Icon name="minus" size={12} /></button><span className="small num" style={{ width: 28, textAlign: 'center', color: 'var(--text-primary)' }}>{qty}</span><button aria-label="Increase" onClick={() => setQty(id, qty + 1)} style={{ width: 32, height: '100%', border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', display: 'grid', placeItems: 'center' }}><Icon name="plus" size={12} /></button></div></div>
      <div className="stack g2" style={{ alignItems: 'flex-end' }}><span className="price" style={{ color: 'var(--text-primary)' }}>{fmt(PRICE * qty)}</span><button aria-label="Remove" onClick={() => setQty(id, 0)} style={{ border: 0, background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4, display: 'inline-flex' }}><Icon name="x" size={14} /></button></div>
    </div>; })}</div>
    {items.length > 0 && <div className="stack g3" style={{ paddingTop: 24 }}><div className="eyebrow muted">Add to the order</div><div style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 12, alignItems: 'center', border: 'var(--rule)', padding: 12 }}><div className="tinbox" style={{ background: addon.tin, width: 56, height: 64 }}><img src={addon.image} alt="" style={{ width: '70%', filter: 'none' }} /></div><div><div className="small" style={{ color: 'var(--text-primary)' }}>{addon.name}</div><div className="cap num">{addon.weight} · {fmt(PRICE)}*</div></div><Button size="sm" variant="outline" onClick={() => onAdd(addon)}>Add</Button></div></div>}
  </Dialog>;
}
function Popup({ open, onClose, toast }) {
  const [email, setEmail] = React.useState('');
  React.useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open]);
  if (!open) return null;
  return <div className="pop" onClick={onClose}><div role="dialog" aria-modal="true" aria-label="The Flush Letter" onClick={(e) => e.stopPropagation()}>
    <div className="between"><Eyebrow>The Flush Letter</Eyebrow><IconButton label="Close" size="sm" onClick={onClose}><Icon name="x" size={18} /></IconButton></div>
    <h2 className="h2">Hear when the next flush is picked.</h2>
    <p className="small">Flush notices. Brew notes. Garden reports. Lot releases. Four or five letters a year; nothing else.</p>
    <form className="stack g3" onSubmit={(e) => { e.preventDefault(); if (!email.includes('@')) return toast({ tone: 'error', title: 'Enter a valid email' }); toast({ tone: 'success', title: 'Subscribed', description: email }); onClose(); }}><Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" /><Button size="lg" fullWidth type="submit">Tell me when it's picked</Button><button type="button" onClick={onClose} style={{ background: 'none', border: 0, color: 'var(--text-tertiary)', cursor: 'pointer', font: 'var(--type-caption)', padding: 8, minHeight: 44 }}>I'll find out on my own</button></form>
  </div></div>;
}
Object.assign(window, { DS, Eyebrow, Ph, Slot, Wordmark, Greybox, Evidence, Swatch, Scale, Accordion, Tile, Ladder, Announcement, Nav, Footer, CartDrawer, Popup, FREE_AT });
