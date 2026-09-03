const { Button: RButton, Icon: RIcon, Input: RInput, Card: RCard } = window.RejuveluxeDesignSystem_0fe2c7;
function HomeRef({ go, onAdd, toast, scrollTo }) {
  const [email, setEmail] = React.useState('');
  const ref = React.useRef(null);
  const toLadder = () => { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); };
  React.useEffect(() => { if (scrollTo === 'collection' && ref.current) toLadder(); }, [scrollTo]);
  const cards = [['The collection', 'Five expressions of one garden', 'Silver Needle to CTC, arranged from ceremonial to everyday. Each carries its grade, lot and pluck month.', 'Product set · tins on seamless surface', () => toLadder()], ['Sets and subscription', 'Taste the ladder, or settle on a rung', 'A tasting box of all five, a flight of three, or one tin every four or eight weeks from the same lot.', 'Tasting box · open · five tins', () => toast({ title: 'Sets', description: 'Set configuration not in this prototype.' })], ['Gifting', 'A box that says what is in it', 'Two tins, a brew card and the lot sheet. The label carries the garden, the flush and the pluck month.', 'Gift box · closed · lot number visible', () => toast({ title: 'Gift box', description: 'Gift configuration not in this prototype.' })]];
  const why = [['map-pin', 'One estate', 'A single garden in Assam. Its name, district and elevation are printed on every tin.'], ['calendar', 'Named flush', 'Picked in a stated month and sold within the season. The pluck date is printed, not implied.'], ['clipboard-list', 'Graded and lotted', 'Grade, lot and brew parameters on every product. Nothing is claimed without a number beside it.'], ['package', 'Packed at source', 'Sealed in the tin at the garden. Ships within [00] hours, free above ₹[0,000].']];
  return <main>
    <section data-screen-label="Hero · full-bleed" data-theme="dark" style={{ position: 'relative', minHeight: 620, display: 'grid', alignItems: 'center', background: 'var(--ink-800)', color: 'var(--bone-100)', overflow: 'hidden' }}>
      <div className="greybox" style={{ position: 'absolute', inset: 0 }} role="img" aria-label="Garden photograph, interim"><img src="assets/tea-field.jpeg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,19,17,.72) 0%, rgba(20,19,17,.45) 55%, rgba(20,19,17,.2) 100%)' }} /><div className="gl" style={{ position: 'absolute', right: 16, bottom: 12, padding: '5px 8px', background: 'rgba(20,19,17,.6)', color: 'var(--bone-100)', fontSize: 9 }}>Hero · 21:9 · Interim</div></div>
      <div className="wrap" style={{ position: 'relative', padding: '96px var(--gutter-lg)' }}><div className="stack g6" style={{ maxWidth: 620 }}>
        <Eyebrow>Single-origin Assam · <Ph>{SLOT.estate}</Ph></Eyebrow>
        <h1 className="display" style={{ color: 'var(--bone-100)' }}>Earned, <em style={{ color: 'var(--gold-300)' }}>not indulged.</em></h1>
        <p className="lead" style={{ color: 'var(--ink-300)' }}>India doesn't need better tea. India needs better access to its best tea.</p>
        <div className="row g3" style={{ flexWrap: 'wrap' }}><RButton size="lg" variant="inverse" onClick={toLadder}>Shop the collection</RButton><RButton size="lg" variant="outline" style={{ color: 'var(--bone-100)', borderColor: 'var(--bone-100)' }} onClick={() => go('garden')}>The garden</RButton></div>
      </div></div>
    </section>
    <section className="wrap sec" data-screen-label="Cards">
      <div className="stack g3" style={{ marginBottom: 40 }}><Eyebrow>RejuveLuxe</Eyebrow><h2 className="h1">Not for the excess. For the earned.</h2></div>
      <div className="grid cols-3">{cards.map(([e, t, d, img, fn]) => <RCard key={e} padding={0} interactive><Greybox label={img} ratio="3 / 2" /><div className="stack g3" style={{ padding: 24 }}><Eyebrow muted>{e}</Eyebrow><h3 className="h3">{t}</h3><p className="small">{d}</p><div style={{ paddingTop: 8 }}><RButton size="sm" variant="outline" onClick={fn} iconRight={<RIcon name="arrow-right" size={14} />}>{e === 'The collection' ? 'See the range' : 'Discover'}</RButton></div></div></RCard>)}</div>
    </section>
    <section data-screen-label="Story band · full-bleed" style={{ position: 'relative', minHeight: 520, display: 'grid', alignItems: 'center', background: 'var(--ink-800)', overflow: 'hidden' }}>
      <div className="greybox" style={{ position: 'absolute', inset: 0 }} role="img" aria-label="Garden photograph, interim"><img src="assets/tea-field.jpeg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%' }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(20,19,17,.62)' }} /><div className="gl" style={{ position: 'absolute', right: 16, bottom: 12, padding: '5px 8px', background: 'rgba(20,19,17,.6)', color: 'var(--bone-100)', fontSize: 9 }}>The garden · 21:9 · Interim</div></div>
      <div className="wrap" style={{ position: 'relative', padding: '80px var(--gutter-lg)' }}><div className="split-wide" style={{ alignItems: 'end' }}>
        <div className="stack g6" style={{ color: 'var(--bone-100)' }}><Eyebrow style={{ color: 'var(--gold-300)' }}>The garden</Eyebrow><h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>We went to the source.</h2><p className="lead" style={{ color: 'var(--ink-300)' }}>{STORY[2]}</p><div><RButton variant="inverse" onClick={() => go('garden')}>Read about the garden</RButton></div></div>
        <div style={{ maxWidth: 360, justifySelf: 'end', width: '100%' }}><Evidence inverse rows={[['Estate', SLOT.estate], ['District', SLOT.district], ['Elevation', SLOT.elevation], ['Flush', SLOT.flush]]} /></div>
      </div></div>
    </section>
    <div ref={ref} className="wrap" style={{ paddingTop: 96, paddingBottom: 40 }}><div className="stack g3" style={{ textAlign: 'center', alignItems: 'center' }}><Eyebrow>The collection</Eyebrow><h2 className="h1 it">Five expressions. One garden.</h2><p className="small" style={{ maxWidth: 520 }}>Ceremonial to everyday. Scroll through the range; each tea holds the screen for one turn of the wheel.</p></div></div>
    <ScrollShowcase onAdd={onAdd} onOpen={(p) => go('product', p.id)} />
    <div className="wrap" style={{ paddingTop: 16 }}><p className="cap">*All prices are a single placeholder value pending pricing.</p></div>
    <section className="wrap sec rule-t" data-screen-label="Why RejuveLuxe">
      <div className="stack g3" style={{ textAlign: 'center', alignItems: 'center', marginBottom: 48 }}><Eyebrow>Why RejuveLuxe</Eyebrow><h2 className="h1 it">Proven, not asserted.</h2></div>
      <div className="grid cols-4" style={{ gap: 40 }}>{why.map(([ic, t, d]) => <div key={t} className="stack g4" style={{ alignItems: 'center', textAlign: 'center' }}><span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--gold-600)' }}><RIcon name={ic} size={26} /></span><h3 className="h3">{t}</h3><p className="small">{d.split(/(₹?\[[^\]]+\])/).map((s, i) => /\[/.test(s) ? <Ph key={i}>{s}</Ph> : s)}</p></div>)}</div>
    </section>
    <section data-screen-label="Newsletter band" data-theme="dark" style={{ background: 'var(--ink-900)', color: 'var(--bone-100)' }}><div className="wrap" style={{ padding: '96px var(--gutter-lg)' }}><div className="stack g6" style={{ alignItems: 'center', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
      <Eyebrow style={{ color: 'var(--gold-300)' }}>The Flush Letter</Eyebrow><h2 className="h1 it" style={{ color: 'var(--bone-100)' }}>Hear when the next flush is picked.</h2><p className="lead" style={{ color: 'var(--ink-300)' }}>Flush notices. Brew notes. Garden reports. Lot releases. Four or five letters a year; nothing else.</p>
      <form className="nl-form" style={{ width: '100%', maxWidth: 480 }} onSubmit={(e) => { e.preventDefault(); if (!email.includes('@')) return toast({ tone: 'error', title: 'Enter a valid email' }); toast({ tone: 'success', title: 'Subscribed', description: email }); setEmail(''); }}><div><RInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" /></div><RButton variant="inverse" type="submit">Join</RButton></form>
    </div></div></section>
  </main>;
}
Object.assign(window, { HomeRef });
