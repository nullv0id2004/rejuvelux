const { Button: GButton, Tabs: GTabs } = window.RejuveluxeDesignSystem_0fe2c7;
function CraftPage({ go, onAdd }) {
  const [tea, setTea] = React.useState('golden');
  const c = CRAFT[tea]; const p = byId(tea);
  return <main data-screen-label="The Craft">
    <section className="wrap sec"><div className="split-wide" style={{ alignItems: 'end' }}><div className="stack g4"><Eyebrow>The Craft</Eyebrow><h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>Three teas. Three distinct journeys.</h1></div><p className="lead">Nothing rushed, nothing skipped. Each chapter is the process as it is run at <Ph>{SLOT.estate}</Ph>, in order, with the stages that take longest given the most room.</p></div></section>
    <div className="wrap rule-y" style={{ padding: '12px 0' }}><div className="between wrapm"><GTabs variant="underline" items={[{ value: 'matcha', label: 'I · Matcha' }, { value: 'silver', label: 'II · Silver Needle' }, { value: 'golden', label: 'III · Golden Tips' }]} value={tea} onChange={setTea} /><span className="cap">Chapter {['matcha', 'silver', 'golden'].indexOf(tea) + 1} of 3 · {c.steps.length} steps</span></div></div>
    <section className="wrap sec" key={tea} data-screen-label={'Craft chapter · ' + p.name}><div className="split-wide">
      <div className="stack g8 sticky">
        <div className="stack g3"><div className="row g3"><Swatch p={p} /><Eyebrow muted>Chapter {['matcha', 'silver', 'golden'].indexOf(tea) + 1}</Eyebrow></div><h2 className="h1">{c.title}</h2><p className="lead it">{p.tagline}</p></div>
        <div className="tinbox" style={{ background: p.tin, aspectRatio: '4 / 5', maxWidth: 360 }}><img src={p.image} alt={`${p.name} tin`} /></div>
        <Evidence style={{ maxWidth: 360 }} rows={[['Garden', SLOT.estate], ['Grade', SLOT.grade], ['Flush', SLOT.flush], ['Steps', String(c.steps.length)]]} />
        <div className="row g3"><GButton onClick={() => go('product', tea)}>See {p.name}</GButton><GButton variant="outline" onClick={() => onAdd(p)}>Add to cart</GButton></div>
      </div>
      <div className="timeline">
        {c.steps.map(([n, d], i) => <React.Fragment key={n}>
          <div className="step"><span className="n num">{String(i + 1).padStart(2, '0')}</span><div className="stack g2"><h3 className="h3" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 18 }}>{n}</h3><p className="body" style={{ color: 'var(--text-secondary)' }}>{d}</p></div></div>
          {(i + 1) % 3 === 0 && i + 1 < c.steps.length && <div className="step" style={{ borderBottom: 'var(--rule)' }}><span /><Greybox label={`Macro · after step ${String(i + 1).padStart(2, '0')} · ${n.toLowerCase()}`} ratio="3 / 2" /></div>}
        </React.Fragment>)}
        <p className="lead it" style={{ padding: '32px 0 0 80px' }}>{c.close}</p>
      </div>
    </div></section>
    <section className="wrap sec-sm rule-t"><p className="h2 it" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>Different leaves. Different craftsmanship. One origin: Assam.</p></section>
  </main>;
}
function GardenPage({ go }) {
  return <main data-screen-label="The Garden">
    <section className="wrap" style={{ padding: '96px 0 48px' }}><div className="editorial" style={{ gap: 32 }}><Eyebrow>The Garden · <Ph>{SLOT.district}</Ph>, Assam</Eyebrow><h1 className="display" style={{ fontSize: 'clamp(40px,4.6cqw,64px)' }}>One garden, on purpose.</h1><Evidence rows={[['Estate', SLOT.estate], ['District', SLOT.district], ['Elevation', SLOT.elevation], ['Area under tea', '[000 ha]'], ['Current flush', SLOT.flush], ['Manager', '[MANAGER NAME]']]} /></div></section>
    <Greybox label="The garden · rows under overcast sky" ratio="16 / 9" className="bleed" style={{ maxHeight: 720 }} />
    <section className="wrap sec"><div className="editorial">{STORY.slice(0, 2).map((t) => <p key={t}>{t}</p>)}</div></section>
    <div className="wrap"><div className="grid cols-2"><div className="stack g2"><Greybox label="Sorting table · working conditions" ratio="3 / 2" /><span className="cap"><Ph>[PLUCKER NAME]</Ph> and <Ph>[PLUCKER NAME]</Ph> at the sorting table, <Ph>[MONTH]</Ph>.</span></div><div className="stack g2"><Greybox label="Withering shed · interior" ratio="3 / 2" /><span className="cap">The withering shed. Silver Needle spends its longest stage here.</span></div></div></div>
    <section className="wrap sec"><div className="editorial">{STORY.slice(2).map((t) => <p key={t}>{t}</p>)}<div className="row g4 rule-t" style={{ paddingTop: 24, alignItems: 'flex-start' }}><Greybox label="Portrait" ratio="4 / 5" style={{ width: 120, flex: 'none' }} /><div className="stack g2" style={{ paddingTop: 4 }}><span className="body" style={{ color: 'var(--text-primary)' }}><Ph>[MANAGER NAME]</Ph></span><span className="small">Estate manager, <Ph>{SLOT.estate}</Ph>. <Ph>[00]</Ph> years in tea. Photographed in the factory, not in a field at sunset.</span></div></div></div></section>
    <Greybox label="Garden · sheds and factory · flat light" ratio="16 / 9" className="bleed" style={{ maxHeight: 560 }} />
    <section className="wrap sec"><div className="editorial" style={{ alignItems: 'flex-start' }}><Eyebrow>From this garden</Eyebrow><h2 className="h1">Five expressions of one leaf.</h2><div className="row g3" style={{ flexWrap: 'wrap' }}>{PRODUCTS.map((p) => <button key={p.id} onClick={() => go('product', p.id)} className="row g2 hair" style={{ background: 'none', padding: '10px 14px', cursor: 'pointer', color: 'var(--text-primary)', font: 'var(--type-body-sm)', minHeight: 44 }}><Swatch p={p} size={14} />{p.name}</button>)}</div></div></section>
  </main>;
}
Object.assign(window, { CraftPage, GardenPage });
