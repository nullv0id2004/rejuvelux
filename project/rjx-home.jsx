const { Button: HButton, Icon: HIcon } = window.RejuveluxeDesignSystem_0fe2c7;
function SectionHead({ eyebrow, title, aside, children }) {
  return <div className="between wrapm" style={{ alignItems: 'flex-end', paddingBottom: 24, borderBottom: 'var(--rule)', marginBottom: 40 }}><div className="stack g3"><Eyebrow>{eyebrow}</Eyebrow><h2 className="h1">{title}</h2></div>{aside && <p className="small" style={{ maxWidth: 360 }}>{aside}</p>}{children}</div>;
}
function Home({ go, onAdd, toast, scrollTo }) {
  const [active, setActive] = React.useState('golden');
  const ref = React.useRef(null);
  React.useEffect(() => { if (scrollTo === 'collection' && ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y }); } }, [scrollTo]);
  const a = byId(active);
  return <main>
    <section className="wrap" data-screen-label="S04 Hero"><div className="hero">
      <div className="stack g6">
        <Eyebrow>Single-origin Assam · <Ph>{SLOT.estate}</Ph></Eyebrow>
        <h1 className="display">Earned,<br /><em>not</em> indulged.</h1>
        <p className="lead">India doesn't need better tea. India needs better access to its best tea.</p>
        <div className="row g3"><HButton size="lg" onClick={() => { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }} iconRight={<HIcon name="arrow-right" size={16} />}>Shop the collection</HButton></div>
        <Evidence style={{ maxWidth: 360 }} rows={[['Garden', SLOT.estate], ['Elevation', SLOT.elevation], ['Current flush', SLOT.flush]]} />
      </div>
      <div className="xfade" aria-label="Dry leaf crossfading to brewed liquor"><Greybox label="Dry leaf macro · scale reference in frame" ratio="4 / 5" /><div className="b"><Greybox label="Brewed liquor · clear glass · white ground" ratio="4 / 5" style={{ background: 'var(--bone-400)' }} /></div></div>
    </div></section>
    <section className="wrap sec-sm rule-y" data-screen-label="S05 Objection bar"><div className="obj">
      {[['Origin', 'One estate in Assam, not a blend of many. Garden, district and elevation appear on every tin.'], ['Flush', 'Picked in a named month and sold within the season. The pluck date is printed, not implied.'], ['Proof', 'Grade, lot and brew parameters on every product. Nothing is claimed without a number beside it.'], ['Dispatch', 'Packed in the tin at source. Ships within [00] hours; free above ₹[0,000].']].map(([k, t]) => <div key={k}><Eyebrow muted>{k}</Eyebrow><p className="small" style={{ color: 'var(--text-primary)' }}>{t.split(/(\[[^\]]+\]|₹\[[^\]]+\])/).map((s, i) => /\[/.test(s) ? <Ph key={i}>{s}</Ph> : s)}</p></div>)}
    </div></section>
    <section className="wrap sec" data-screen-label="S06 Comparison">
      <SectionHead eyebrow="Against the default" title="What the supermarket tin leaves out." aside="Three rows. One of them is theirs." />
      <div className="cmp" role="table">
        <div className="hd">Measure</div><div className="hd">RejuveLuxe</div><div className="hd">Supermarket blend</div>
        <div className="lb">Origin</div><div className="us"><Ph>{SLOT.estate}</Ph>, single garden</div><div>Blended · several regions</div>
        <div className="lb">Leaf grade</div><div className="us"><Ph>{SLOT.grade}</Ph> · whole leaf and tips</div><div>Dust and fannings</div>
        <div className="lb">Pluck date on pack</div><div className="us"><Ph>{SLOT.pluck}</Ph> · lot <Ph>{SLOT.lot}</Ph></div><div>Best-before only</div>
        <div className="lb">Price per cup</div><div>₹<Ph>[00]</Ph></div><div className="us">₹<Ph>[0]</Ph> — they win here</div>
      </div>
    </section>
    <section className="wrap sec rule-t" ref={ref} data-screen-label="S07 Collection ladder">
      <SectionHead eyebrow="The collection" title="Five expressions. One garden." aside="Ceremonial to everyday. CTC is the finest version of the daily cup, not the cheap one in the set." />
      <Ladder active={active} onSelect={setActive} onOpen={(p) => go('product', p.id)} />
      <div className="between wrapm rule-t" style={{ paddingTop: 24, marginTop: 8 }}><p className="lead" style={{ maxWidth: 560, fontStyle: 'italic' }}>{a.tagline}</p><div className="row g3"><HButton onClick={() => onAdd(a)}>Add {a.name}</HButton><HButton variant="outline" onClick={() => go('product', a.id)}>Details</HButton></div></div>
      <p className="cap" style={{ marginTop: 16 }}>*All prices are a single placeholder value pending pricing.</p>
    </section>
    <section className="wrap sec rule-t" data-screen-label="S08 Brew guide">
      <SectionHead eyebrow="Brew guide · draft values" title="Water, weight, time." aside="Parameters for a 200 ml cup unless stated. Full guide covers vessels and re-steeping." />
      <div className="brew-wrap"><div className="brew" role="table">
        <div className="hd">Tea</div><div className="hd">Temp</div><div className="hd">Leaf</div><div className="hd">Water</div><div className="hd">Time</div><div className="hd">Steeps</div>
        {PRODUCTS.map((p) => <React.Fragment key={p.id}><div className="row g3"><Swatch p={p} size={12} />{p.name}</div><div>{p.brew.temp}</div><div>{p.brew.g}</div><div>{p.brew.ml}</div><div>{p.brew.min}</div><div>{p.brew.steeps}</div></React.Fragment>)}
      </div></div>
      <div style={{ paddingTop: 24 }}><HButton variant="ghost" onClick={() => toast({ title: 'Brew guide', description: 'Full guide page not in this prototype.' })} iconRight={<HIcon name="arrow-right" size={14} />}>The full brew guide</HButton></div>
    </section>
    <section className="wrap sec rule-t" data-screen-label="S09 Bundle and subscribe">
      <SectionHead eyebrow="Sets and subscription" title="Taste the ladder, or settle on a rung." />
      <div className="bundle">
        {[['Tasting box', 'All five, 25 g each', 'Save ₹[000]', 'Start here if you have not tasted the range.'], ['Sampler flight', 'Three teas of your choice, 25 g each', 'Save ₹[000]', 'Pick a register — pale, copper, or strong.'], ['Subscription', 'One tin, every 4 or 8 weeks', 'Save ₹[000] per tin', 'Same lot for the season. Pause or change any time.']].map(([t, d, s, c]) => <div key={t}><Eyebrow muted>{t}</Eyebrow><h3 className="h3">{d}</h3><p className="small">{c}</p><div className="between" style={{ marginTop: 'auto' }}><span className="price">{fmt(PRICE)}*</span><span className="cap"><Ph>{s}</Ph></span></div><HButton variant="outline" onClick={() => toast({ title: t, description: 'Set configuration not in this prototype.' })}>Choose</HButton></div>)}
      </div>
    </section>
    <section data-screen-label="S10 The garden" className="rule-t">
      <Greybox label="The garden · overcast · rows, sheds, sorting tables" ratio="16 / 9" className="bleed" style={{ maxHeight: 640 }} />
      <div className="wrap sec"><div className="split-wide">
        <div className="stack g6"><Eyebrow>The garden</Eyebrow><h2 className="h1">We went to the source.</h2><Evidence rows={[['Estate', SLOT.estate], ['District', SLOT.district], ['Elevation', SLOT.elevation], ['Flush', SLOT.flush]]} /></div>
        <div className="stack g6"><p className="lead">{STORY[2]}</p><div className="row g4" style={{ alignItems: 'flex-start' }}><Greybox label="Portrait · at work" ratio="4 / 5" style={{ width: 96, flex: 'none' }} /><div className="stack g1" style={{ paddingTop: 4 }}><span className="small" style={{ color: 'var(--text-primary)' }}><Ph>[MANAGER NAME]</Ph></span><span className="cap">Estate manager, <Ph>{SLOT.estate}</Ph>. Photographed at the sorting table.</span></div></div><HButton variant="outline" onClick={() => go('garden')}>Read about the garden</HButton></div>
      </div></div>
    </section>
    <section className="wrap sec rule-t" data-screen-label="S11 Reviews">
      <SectionHead eyebrow="Reviews · example content" title="From people who paid for it."><div className="stack g1" style={{ alignItems: 'flex-end' }}><span className="price num">4.8 / 5</span><span className="cap num"><Ph>[000]</Ph> reviews</span></div></SectionHead>
      <div className="grid cols-4" style={{ marginBottom: 40 }}>{['@handle_one', '@handle_two', '@handle_three', '@handle_four'].map((h) => <div key={h} className="stack g2"><Greybox label="Creator still" ratio="4 / 5" /><span className="cap">{h} · example</span></div>)}</div>
      <div className="grid cols-3">{REVIEWS.map((r) => <div key={r.name} className="stack g3 rule-t" style={{ paddingTop: 20 }}><span className="cap num" aria-label={`${r.rating} of 5`}>{'◆'.repeat(r.rating)}<span style={{ opacity: .3 }}>{'◆'.repeat(5 - r.rating)}</span></span><p className="body it">{r.text}</p><span className="cap">{r.name}, {r.city}</span></div>)}</div>
    </section>
    <section className="wrap sec rule-t" data-screen-label="S12 Gifting"><div className="split">
      <Greybox label="Gift box · closed · printed lot and pluck date visible" ratio="3 / 2" />
      <div className="stack g6"><Eyebrow>Gifting</Eyebrow><h2 className="h1">A box that says what is in it.</h2><p className="lead">Two tins, a brew card, and the lot sheet. The label carries the garden, the flush and the pluck month. No ribbon.</p><Evidence style={{ maxWidth: 360 }} rows={[['Contents', '2 × 50 g'], ['Card', 'Brew parameters, both teas'], ['Price', fmt(PRICE) + '*']]} /><div className="row g3"><HButton onClick={() => toast({ title: 'Gift box', description: 'Gift configuration not in this prototype.' })}>Build a box</HButton></div></div>
    </div></section>
    <section className="strip" data-screen-label="S13 Shipping and guarantee"><div className="wrap"><div className="grid cols-3">
      {[['Shipping', 'Free above ₹[0,000]', 'Dispatch within [00] hours, India-wide.'], ['Returns', '[00] days', 'Unopened tins, no questions. Opened tins, one question.'], ['Guarantee', '[TBC]', 'Terms pending. The slot is sized for one sentence.']].map(([k, v, d]) => <div key={k}><Eyebrow muted>{k}</Eyebrow><span className="h3">{v.split(/(\[[^\]]+\])/).map((s, i) => /\[/.test(s) ? <Ph key={i}>{s}</Ph> : s)}</span><p className="cap">{d.split(/(\[[^\]]+\])/).map((s, i) => /\[/.test(s) ? <Ph key={i}>{s}</Ph> : s)}</p></div>)}
    </div></div></section>
    <section className="wrap sec" data-screen-label="S14 FAQ"><div className="split-wide" style={{ alignItems: 'start' }}><div className="stack g3"><Eyebrow>Questions</Eyebrow><h2 className="h1">Asked before buying.</h2></div><Accordion items={FAQS} /></div></section>
  </main>;
}
Object.assign(window, { Home, SectionHead });
