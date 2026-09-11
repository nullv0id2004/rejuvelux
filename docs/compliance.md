# Statutory Compliance — Indian Obligations

> **Owns** every legal and regulatory obligation binding on selling packaged food online in India,
> and the mapping from each obligation to the surface that satisfies it. Wins on any question of
> *what the law requires*. It does **not** own page copy (`features/policies.md`), packaging
> artwork (`base.md` §8.6) or the technical mechanism (`architecture.md`, `data-model.md`).
>
> **This is not legal advice.** It records obligations as currently understood so they can be
> designed for rather than rediscovered. Every row carries a confidence marker, and the rows marked
> `needs-counsel` are not settled by this document being written.
>
> **Why it exists:** every other topic in this suite has a named owner. Regulatory obligation did
> not, which is why a research run surfaced ~74 Indian requirements and they were left in
> `work_done.md` — a history file, not a forward-looking one.

Confidence markers used throughout:
`researched` — established by agent research, not read against the primary instrument ·
`needs-counsel` — requires a qualified professional before it is relied on ·
`confirmed` — checked against the primary source or a professional ·
`not-applicable` — recorded so it is not built

Last reviewed: 18 August, 2026

---

## 1. The root dependency

**Every obligation below attaches to a legal entity that does not yet exist on paper.**
`base.md:926` records that licensing status is *unknown, not merely pending*, and that the licensed
entity may not be named "RejuveLuxe". Until the entity is settled, nothing here can be satisfied —
not the FSSAI licence number on the site, not the grievance officer's appointment, not the GSTIN on
an invoice, not the processor contracts.

This is the single longest serial chain in the project: **entity → registrations (FSSAI, GST) →
numbers that must appear on the site and on every pack**. It is tracked at `risks.md` and is the
first thing on the client message.

---

## 2. Obligation register

| # | Instrument | Core duty | Satisfied by | Confidence |
|---|---|---|---|---|
| C-1 | DPDP Act 2023 + DPDP Rules 2025 | Notice, consent, data-principal rights, breach reporting, retention | `data-model.md` fields, `features/accounts.md`, `features/policies.md` | `researched` |
| C-2 | Consumer Protection (E-Commerce) Rules 2020 | Identity disclosure, grievance officer, price break-up, cancellation terms | `features/policies.md`, `features/checkout.md`, `features/orders.md` | `researched` |
| C-3 | CCPA Dark Patterns Guidelines 2023 | Thirteen named patterns prohibited | `design-system.md` §5, `content-style.md` §3 | `researched` |
| C-4 | Legal Metrology (Packaged Commodities) Rules | Declarations on the **online listing**, separate from the pack | `features/product-page.md`, `data-model.md` | `researched` |
| C-5 | FSSAI — e-commerce specific | Central Licence, claim parity, residual shelf life at delivery | `features/inventory.md`, `features/product-page.md` | `researched` |
| C-6 | FSS (Labelling & Display) Regulations 2020 | Pack declarations | `base.md` §8.6, tracked as R-28 | `researched` |
| C-7 | CERT-In Directions, 28 April 2022 | 180-day log retention, 6-hour incident reporting, NTP sync | `architecture.md` security posture | `researched` |
| C-8 | CGST Act + Rules | Invoice numbering, credit notes, place of supply, HSN | `data-model.md`, `features/orders.md` | `needs-counsel` |
| C-9 | RBI card-on-file rules | Merchants must not store PAN, CVV or expiry | `features/payments.md` | `researched` |

---

## 3. C-1 — Digital Personal Data Protection Act 2023

The store collects names, addresses, phone numbers, email and purchase history from Indian
residents. That makes the operating entity a **Data Fiduciary**, with no turnover threshold to
shelter behind. The Act's s.17(3) startup exemption exists for the government to notify but
**has not been notified**, so no exemption may be assumed. `needs-counsel` to confirm current status.

### Commencement, stated honestly

The Rules were notified in November 2025 with phased commencement — the substantive duties
(notice, consent, data-principal rights, security safeguards, breach reporting, retention and
erasure) are **reported to commence 13 May 2027**. `researched`, and the dates should be confirmed
before being relied on.

**The design consequence is the point, not the date.** A site launching now will be live when these
commence. Consent records cannot be reconstructed retrospectively — you cannot recover consent you
never captured. `data-model.md` is the next substantive doc in the build order, which makes this the
cheapest moment it will ever be.

### What is schema-shaped rather than policy-shaped

- **Consent record as a first-class entity** — purpose, timestamp, the *version of the notice
  actually shown*, channel, and withdrawal timestamp. Versioning the notice text is what lets a
  historical consent be tied to what the person actually saw.
- **Transactional and marketing consent are separate.** Consent for order processing must not be
  bundled with consent to market. No pre-ticked boxes; no consent folded into T&C acceptance;
  withdrawal as easy as granting.
- **An erasure path that actually deletes** — including from backups, which are themselves personal
  data. `architecture.md` §6 sets PITR retention at 30 days, which is a *backup* window and has
  never been reconciled with a *retention* policy.
- **Breach detection good enough to report inside 72 hours** to the Data Protection Board. State the
  realistic detection path for one developer with a free-tier error tracker rather than implying a
  SOC exists.

### Deliberately not doing

- **No Data Protection Officer.** A DPO is required only of a Significant Data Fiduciary. This
  project will not be one; a published named contact suffices.
- **No three-year-inactivity erasure job.** That Third Schedule duty binds e-commerce entities with
  **two crore or more registered users**. Recorded so nobody builds it.

### Processors

Razorpay, Shiprocket, Resend, WhatsApp Cloud API and the hosting provider all process personal data
on our behalf, and DPDP requires processing under a valid contract. Whether standard vendor terms
already satisfy this is `needs-counsel`.

---

## 4. C-2 — Consumer Protection (E-Commerce) Rules 2020

**The trap is assuming these are marketplace-only.** A brand selling its own stock on its own site
is an **inventory e-commerce entity**. Rule 4 and Rule 7 apply directly; the marketplace-specific
rules do not.

Several duties are **product-shaped, not page-shaped**, which is why this belongs in the build order
before the commerce spine rather than in a policy page written at item 29:

- **Grievance officer** — name, designation and contact published; **acknowledge within 48 hours**;
  **redress within one month**; issue a ticket number the consumer can track. That is a complaint
  entity with a clock and a status, not a mailto link. *Who this person is* is a real decision.
- **A nodal contact person resident in India** — a separate appointment from the grievance officer.
- **Single total price with an itemised break-up** of every compulsory and voluntary charge. This is
  a checkout rendering rule, and the same requirement appears as the "drip pricing" dark pattern.
- **No cancellation charge** on a consumer unless the entity itself bears an equivalent charge.
- **Cannot refuse to take back** defective, deficient, spurious or misrepresented goods.
- **No pre-ticked consent boxes** — the same build as the DPDP consent mechanism.

### The returns tension

Food is ordinarily non-returnable; the Rules forbid refusing return of defective goods. The
resolution is a returns policy that distinguishes **defect** from **change of mind**, and it is
`needs-counsel`.

### Where the brand discipline already helps

`content-style.md` §3 bans urgency and scarcity language, and `design-system.md` §5 refuses to build
countdown timers, urgency badges, "only N left" and exit-intent modals. **Those already exclude
several named dark patterns as a by-product of §49/§50.** What is missing is the *mandatory-presence*
half — nothing yet requires the disclosures to exist. Two patterns still need explicit rules:

- **Basket sneaking** — nothing enters the cart the buyer did not choose, *including* any
  gift-with-purchase mechanic §50 contemplates.
- **Forced action** — no mandatory account creation to buy. **Guest checkout is therefore a
  compliance requirement, not a UX preference**, and `product.md` should say so.

**`needs-counsel`:** Rule 4(1) requires an e-commerce entity to be a company incorporated under the
Companies Act. What that means for a sole proprietorship or LLP selling online is a real question
and it interacts directly with §1 above. Do not guess at it.

---

## 5. C-4 — Legal Metrology, the online listing

`base.md` §8.6 covers the physical pack well. The LM Rules impose a **second, separate duty**: an
e-commerce entity must display the mandatory declarations **on the platform used for the
transaction**. Different regulator, different list, different enforcement route.

Declarations to display: manufacturer/packer/importer name and address · common or generic name ·
net quantity · retail sale price as **MRP inclusive of all taxes** · best-before or use-by ·
country of origin · consumer-care contact.

**The easy mistake:** date of manufacture or packing is *excluded* from the online display, while
best-before or use-by is *included*.

Two consequences for `data-model.md`:

- **Best-before is per-batch, not per-product.** It cannot be a product-level constant.
- **A gift box is itself a package** with its own declarations, including **aggregate net
  quantity** — not merely the sum of its components' labels.

**MRP is inclusive of all taxes.** `base.md` already flags that the brief never states whether §15's
prices are tax-inclusive. That unknown now blocks the *website listing* as well as printed artwork,
which raises its priority.

**`not-applicable`, recorded so it is not built:** the 2026 amendment requiring a searchable
country-of-origin filter applies to **imported** products. This range is domestic Assam tea.
Revisit only if an imported component enters the catalogue — the Ritual Set's non-food articles are
worth one check.

---

## 6. C-5 — FSSAI, selling online

R-28 tracks what must be *printed*. This is the separate body of duty triggered by selling online.

- **Licence class:** e-commerce is a kind of business for which a **Central Licence** is required
  irrespective of turnover. This converts `base.md`'s P18 from "which category applies" into
  "Central, plus whatever the manufacturing arrangement separately requires". `researched` — confirm
  against the current FoSCoS eligibility matrix, not a blog.
- **Display the FSSAI licence number and FBO details on the website**, not only on the pack — and
  the number displayed belongs to the *licensed entity*, which per §1 may not be branded RejuveLuxe.
- **Claim parity:** listing claims must not exceed or contradict the physical label. This is a
  useful ally for `content-style.md` — **the label text becomes the ceiling for the page**, which is
  a testable rule rather than a judgement call.

### Residual shelf life — an inventory constraint, not a labelling one

An e-commerce FBO must deliver with a minimum remaining shelf life, **commonly stated as 30% of
shelf life or 45 days, whichever is less** (`researched` — confirm the instrument and whether it is
a direction or an advisory, since enforceability differs).

This is the item in this document most expensive to retrofit:

- **Batch and expiry become attributes of a stock unit, not of a product.**
- **Allocation must refuse stock** that would breach the floor at projected delivery.
- The admin needs a visible near-expiry state.
- It gives a deadline to a problem `base.md` already raised commercially: ageing stock in a brand
  that cannot discount (§49). **Under this rule ageing stock does not merely lose margin — it
  becomes undeliverable while still looking saleable in the catalogue.**
- **Matcha bites first** — `base.md` notes it degrades fastest. Model against it.

**`needs-counsel`:** whether FSSAI's instruction to deliver food and non-food separately applies to a
co-packed kit like the Matcha Ritual Set (whisk, spoon, strainer, bowl, stand alongside tea). Do not
assume either way — R-30 established that Medusa's Inventory Kits **cannot split fulfilment**, so the
answer could change the Ritual Set's fulfilment model entirely.

---

## 7. C-7 — CERT-In Directions, 28 April 2022

The operating entity is a body corporate; the Directions apply.

- **Logs of all ICT systems retained for a rolling 180 days.** Carrying forward a correction already
  made and then lost to the history log: the Direction's text says within Indian jurisdiction, but
  **CERT-In's FAQ Q35 permits storage outside India** provided logs are produced on demand. Recorded
  here so it is not re-litigated.
- **180 days of logs is a hosting cost input.** `architecture.md` §8 budgets monitoring at "a hosted
  error tracker plus whatever the deploy platform gives" — free-tier retention is far below 180 days.
  This is a live input to the still-open Medusa host decision, not an afterthought.
- **Reportable incidents within six hours of noticing.** For a solo operator this is a genuine
  constraint. The honest response is to record the realistic detection path and, if six hours cannot
  be guaranteed, mark it an **accepted** risk with a reason — not to claim a capability that does not
  exist.
- **NTP synchronisation** to NIC/NPL or traceable sources. Cheap, easily forgotten, and it interacts
  with `architecture.md` §2's append-only order events: **timestamps that arbitrate money need a
  defensible clock.**

**Two regimes, two clocks, one incident** — six hours to CERT-In, 72 hours to the Data Protection
Board. One runbook covering both, not two.

---

## 8. C-8 — GST, and a contradiction to resolve

R-31 correctly records that GST invoicing has no solution. What it does not carry is the set of
consequences that are **irreversible once orders exist**:

- **Invoice numbering is a schema decision.** Consecutive series, at most sixteen characters,
  unique per financial year, reset each 1 April, cancelled numbers never reused, gaps explainable.
  That is a sequence generator with a uniqueness constraint — not a formatted order ID. Per
  `architecture.md` §2's own reasoning, **the database constraint is the only reliable arbiter.**
  Fixing this after a hundred live invoices means reissuing them.
- **Refunds are credit notes**, a separate document type with its own numbering — not a field on the
  order. Order state and tax documents are two lifecycles. Map the Razorpay refund event to the
  credit note explicitly so the money trail and the tax trail cannot diverge.
- **Place of supply for gifts** — a gift shipped to a recipient in a different state from the paying
  buyer decides CGST+SGST versus IGST. A real edge case for a gifting-led brand. `needs-counsel`.
- **HSN** — tea sits under heading 0902 and the rate turns on the form supplied. Store HSN and rate
  **against the product**, never in application logic. Matcha is milled; ask about it specifically.
- **Corporate gifting** needs GSTIN capture and validation at checkout plus a different invoice
  template, or B2B buyers cannot claim input credit.

### ⚠ Flagged conflict — not resolved here

`base.md:520` records **"price suppressed on packing slip and invoice"** as a gifting requirement.
A taxable supply requires a tax invoice stating value and tax; **it cannot be price-suppressed.**

The likely resolution is that the *packing slip* carries no price while the *tax invoice* goes to
the buyer separately — but whether the invoice must physically accompany the consignment is
`needs-counsel`. Per `readme.md` §4 this is flagged for Sayon rather than resolved unilaterally.

**`not-applicable`:** e-invoicing via the IRP applies above an aggregate turnover threshold this
project will not approach at launch. Revisit only if turnover changes.

---

## 9. C-9 — Card data

**We never store card numbers, CVV or expiry.** RBI's card-on-file rules prohibit merchants storing
PAN, CVV and expiry; only network or issuer tokenisation is permitted, and Razorpay's tokenisation
is the sole saved-card mechanism. Recorded here because it is the one payment rule that is settled
and should never be re-opened by a convenience request.

This also bounds our PCI-DSS scope — but the **integration mode determines that scope**, and it is
undecided. Until it is, no PCI scope statement can be written.

---

## 10. Who confirms what

| Professional | Items |
|---|---|
| **Company secretary / corporate lawyer** | The entity itself (§1); Rule 4(1) incorporation question (C-2) |
| **FSSAI-aware food lawyer or consultant** | Licence class, claim parity, residual shelf life, kit fulfilment (C-5); health-claims position (R-06) |
| **Legal Metrology specialist** | Online declaration list and current rule numbering (C-4) — *the same engagement as the packaging labelling question `base.md` already calls for; one brief, both answers* |
| **Chartered accountant** | Registration and place of supply, HSN and rate, invoice and credit-note mechanics, the gift-invoice contradiction (C-8) |
| **Privacy lawyer** | Notice wording, processor-contract position, exemption status (C-1) |
| **Us** | Every mechanism — schema, fields, flows, logging, detection paths |

---

## 11. Deliberately not doing

Recorded so nobody builds them: no Data Protection Officer · no ISO certification · no formal DPIA
programme · no three-year-inactivity erasure job · no country-of-origin filter · no e-invoicing ·
no on-call rotation. Each is either threshold-gated well above this project or inapplicable to a
domestic single-brand catalogue.

---

## 12. Review trigger

Re-read **before launch**, and on any change to the legal entity, the product category, or the
market served. `risks.md` R-23 records that international sale is deliberately out of scope —
opening it re-opens this entire document.
