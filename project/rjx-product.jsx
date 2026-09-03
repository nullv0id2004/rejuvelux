const { Button: PButton, Icon: PIcon, RadioGroup: PRadio, Badge: PBadge } = window.RejuveluxeDesignSystem_0fe2c7;
function ProductPage({ p, onAdd, go, toast }) {
  const [img, setImg] = React.useState(0);
  const [plan, setPlan] = React.useState('once');
  const [qty, setQty] = React.useState(1);
  const shots = [['Tin · front', '4 / 5', true], ['Tin · lot number and pluck date', '4 / 5'], ['Dry leaf at scale · coin in frame', '4 / 5'], ['Brewed liquor · clear glass', '4 / 5'], ['Wet leaf after first steep', '4 / 5'], ['Garden · overcast', '4 / 5']];
  const unit = Math.round(PRICE / parseInt(p.weight) * 10) / 10;
  const others = PRODUCTS.filter((q) => q.id !== p.id).slice(0, 3);
  React.useEffect(() => { setImg(0); setQty(1); }, [p.id]);
  return <main data-screen-label={'Product · ' + p.name}>
    <div className="wrap" style={{ paddingTop: 24 }}><div className="row g2 cap"><button onClick={() => go('home', 'collection')} style={{ background: 'none', border: 0, padding: 0, color: 'var(--text-tertiary)', cursor: 'pointer', font: 'inherit' }}>Shop</button><span>/</span><span>{p.category}</span><span>/</span><span style={{ color: 'var(--text-primary)' }}>{p.name}</span></div></div>
    <section className="wrap" style={{ padding: '24px 0 96px' }}><div className="pdp">
      <div className="gallery">
        <div className="thumbs">{shots.map(([l, r, tin], i) => <button key={l} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={l}>{tin ? <img src={p.image} alt="" style={{ width: '70%' }} /> : <span className="cap num">{i + 1}</span>}</button>)}</div>
        <div>{shots[img][2] ? <div className="tinbox" style={{ background: p.tin, aspectRatio: '4 / 5' }}><img src={p.image} alt={`${p.name} tin, front`} /></div> : <Greybox label={shots[img][0]} ratio={shots[img][1]} />}</div>
      </div>
      <div className="stack g8 sticky">
        <div className="stack g3">
          <div className="between"><Eyebrow>{p.category} · <Ph>{SLOT.grade}</Ph></Eyebrow><Swatch p={p} /></div>
          <h1 className="h1" style={{ fontSize: 44 }}>{p.name}</h1>
          <p className="lead it">{p.descriptor}. {p.tagline}</p>
          <div className="row g3 cap"><span className="num" aria-label="4.8 of 5">◆◆◆◆<span style={{ opacity: .3 }}>◆</span></span><span className="num">4.8 · <Ph>[000]</Ph> reviews · example</span></div>
        </div>
        <div className="stack g4">
          <div className="between" style={{ alignItems: 'baseline' }}><span className="price" style={{ fontSize: 28 }}>{fmt(plan === 'sub' ? PRICE - 100 : PRICE)}<span className="cap">*</span></span><span className="cap num">{p.weight} · ₹{unit}/g · {p.cups} cups</span></div>
          <PRadio name="plan" value={plan} onChange={setPlan} direction="column" options={[{ value: 'once', label: `One-time · ${fmt(PRICE)}*` }, { value: 'sub', label: `Subscribe · ${fmt(PRICE - 100)}* per tin`, description: 'Every 4 or 8 weeks. Same lot for the season. Pause any time. Saving is a placeholder.' }]} />
          <div className="row g3" style={{ flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-strong)', height: 52, borderRadius: 'var(--radius-xs)' }}><button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: '100%', border: 0, background: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'grid', placeItems: 'center' }}><PIcon name="minus" size={14} /></button><span className="body num" style={{ width: 28, textAlign: 'center' }}>{qty}</span><button aria-label="Increase" onClick={() => setQty(qty + 1)} style={{ width: 44, height: '100%', border: 0, background: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'grid', placeItems: 'center' }}><PIcon name="plus" size={14} /></button></div>
            <PButton size="lg" style={{ flex: 1 }} onClick={() => onAdd(p, qty)}>{plan === 'sub' ? 'Subscribe' : 'Add to cart'} · {fmt((plan === 'sub' ? PRICE - 100 : PRICE) * qty)}</PButton>
          </div>
          <p className="cap">Free shipping above ₹<Ph>[0,000]</Ph> · dispatch in <Ph>[00]</Ph> h · <Ph>[00]</Ph>-day return</p>
        </div>
        <ul className="stack g2" style={{ margin: 0, paddingLeft: 18, font: 'var(--type-body)' }}>{p.bullets.map((b) => <li key={b}><Slot v={b} />{/\[/.test(b) && null}</li>)}</ul>
        <div className="stack g3"><Eyebrow>Evidence</Eyebrow><Evidence rows={[['Garden', SLOT.estate], ['District', SLOT.district], ['Elevation', SLOT.elevation], ['Grade', SLOT.grade], ['Flush', SLOT.flush], ['Pluck month', SLOT.pluck], ['Lot', SLOT.lot], ['Net weight', p.weight], ['Cups per tin', p.cups]]} /></div>
        <div className="stack g3"><Eyebrow>Brew · draft values</Eyebrow><Evidence rows={[['Water', p.brew.temp], ['Leaf', p.brew.g], ['Volume', p.brew.ml], ['Time', p.brew.min], ['Steeps', p.brew.steeps]]} /><div className="grid cols-2" style={{ color: p.ink, paddingTop: 8 }}><Scale label="Body" value={p.body} /><Scale label="Briskness" value={p.brisk} /></div></div>
        <Accordion items={[['Description', p.description + ' ' + p.why], ['How to brew', `${p.brew.g} of leaf in ${p.brew.ml} of water at ${p.brew.temp}. ${p.brew.min}. Good for ${p.brew.steeps} steep${p.brew.steeps === '1' ? '' : 's'}. Draft values pending cupping.`], ['Specification', `Net weight ${p.weight}. Grade [GRADE]. Lot [LOT-0000], plucked [MONTH 0000]. Packed at source in a lined steel tin. Ingredients: tea (Camellia sinensis). FSSAI Lic. No. [00000000000000].`], ['Shipping and returns', 'India-wide shipping. Free above ₹[0,000]; ₹[000] below. Dispatch within [00] hours. Unopened tins returnable within [00] days. All values are placeholders.']]} />
      </div>
    </div></section>
    <section className="wrap sec rule-t" data-screen-label="Product reviews"><SectionHead eyebrow="Reviews · example content" title={`What people said about ${p.name}.`}><span className="price num">4.8 / 5</span></SectionHead><div className="grid cols-3">{REVIEWS.map((r) => <div key={r.name} className="stack g3 rule-t" style={{ paddingTop: 20 }}><span className="cap">{'◆'.repeat(r.rating)}<span style={{ opacity: .3 }}>{'◆'.repeat(5 - r.rating)}</span></span><p className="body it">{r.text}</p><span className="cap">{r.name}, {r.city}</span></div>)}</div></section>
    <section className="wrap sec rule-t" data-screen-label="Cross-sell"><SectionHead eyebrow="Elsewhere on the ladder" title="Three to try next." /><div className="grid cols-3">{others.map((q) => <Tile key={q.id} p={q} onOpen={(x) => go('product', x.id)} onAdd={onAdd} />)}</div></section>
    <section className="wrap sec rule-t" data-screen-label="Product FAQ"><div className="split-wide" style={{ alignItems: 'start' }}><div className="stack g3"><Eyebrow>{p.name}</Eyebrow><h2 className="h1">Four questions.</h2></div><Accordion items={p.faqs} /></div></section>
  </main>;
}
Object.assign(window, { ProductPage });
