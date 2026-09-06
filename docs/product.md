# Product Definition

> **Purpose:** End-to-end definition of what we are building: scope, users, sitemap, every page,
> every flow, every state.
>
> **Status:** `PROVISIONAL` — first pass, 17 August 2026. Scope calls in section 1 are this
> document's, not the client's, and are marked as such. Everything traceable to the brief cites
> `§n`; everything else is labelled **inference** or **decision**.
>
> **Citation convention:** a bare `§n` **always means `brief.md`**. References to a section of
> another document are written with the filename (`design-system.md` §5). References to a section of
> *this* document are written in words ("section 4.2"). The `§` symbol is never used for anything
> but the brief.
>
> **What this owns:** scope, users, sitemap, pages, flows, states. It does **not** own visual
> specification (`design-system.md`), copy (`content-style.md`), entities and fields
> (`data-model.md`) or technology (`tech-stack.md`, ADR-0001/0002).
>
> **Reading note:** `design-system.md` §8.5 documents the reference concept's page anatomy in detail.
> Where this document names a component, that section describes it. They are not duplicated here.

---

## 1. Scope

### 1.1 In at launch

| | Why |
|---|---|
| Home | §37 specifies its narrative in seven layers |
| Shop — catalogue | §36 |
| Product pages — 3 heroes | §12, §38 |
| Matcha Ritual Set | §32, §33. A six-component kit sold as one item |
| Gift boxes | §32. Gifting is a **business pillar**, not a seasonal add-on |
| Cart, checkout, payment, order confirmation | The commerce spine |
| Shipping and order tracking | §53 |
| Accounts — guest checkout **and** registered | See section 5.1 |
| Our Story — Origin, The Craft, Tea Rituals | §36, §41 |
| Journal | §36. Repo-authored per R-34 |
| Tea education | §40 supplies ten topics |
| Policies — shipping, returns, privacy, terms, FAQ | §36 |
| Contact | §36 |
| Search | Basic. Postgres full-text per ADR-0002 |

### 1.2 Out at launch — **decisions, `PROVISIONAL`**

Each is a call this document makes. None is in the brief as an exclusion.

| Deferred | Reasoning | Revisit when |
|---|---|---|
| **Corporate gifting portal** | §2 names it a pillar but §32 never develops it. R-19: bulk pricing, personalisation, lead times, invoicing and delivery coordination are a **B2B quote-to-invoice flow**, not a D2C variant. Building it badly is worse than routing it to a human | A corporate proposition is defined. Launch handles enquiries via Contact |
| **Customer reviews / ratings** | The reference concept features them prominently (`design-system.md` §8.5.3). A new brand has none, and a review module showing zero reviews actively undermines §22's premium justification | Real reviews exist |
| **Wishlist** | The reference puts a heart on every tile. Against a catalogue of roughly six items the "save for later" need is weak, and it adds an account dependency to browsing | Catalogue grows, or gift-hinting is designed |
| **Subscriptions / replenishment** | §59's *Return* stage is the business model, but R-20 records that its mechanism is undefined — and §49 bars the usual lever (repeat-purchase discounts) | R-20 is resolved |
| **Loyalty scheme** | Same reason. Points are a discount mechanic in disguise (§49) | — |
| **International sale** | R-23, `accepted`. India only, INR only | Post-launch |
| ~~**Admin customisation**~~ **NO LONGER DEFERRED — 2 Sep 2026** | The original reason (*"deprioritised 17 Aug, storefront first; Medusa ships an admin regardless"*) failed twice over: the storefront shipped, and ADR-0003/0006 removed Medusa, so **nothing ships an admin**. [ADR-0008](adr/0008-admin-for-a-client-team.md) resolves R-22 — a non-technical client team operates it — and `features/admin.md` specifies it | **Now in scope.** Being built |

### 1.3 Explicit non-goals

These are not "later". They are things this product **must not become**:

- **A discounting site.** No coupon field, no percent-off, no flash sale, no countdown timer, no
  spend-threshold banner (§49, §50). `design-system.md` §5 already forbids building the components.
- **A wellness or medical site.** §45–48. No claim without substantiation, and R-06 governs.
- **A generic catalogue.** §34 states it outright — commerce, storytelling and education together.
- **A site that invents facts.** §16. Where a field has no confirmed content it stays empty and the
  page is designed to survive its absence. See section 7.

---

## 2. Users

The brief profiles one buyer (§21). Three more are implied by the business it describes.

### 2.1 The self-purchaser — primary

§21, §23. Affluent urban, design-conscious, values provenance and craft. Trying to accomplish:
*"I want something genuinely exceptional, and I want to understand why it is."*

§23 is explicit that the benefit is **competence, not status** — *"I have chosen something exceptional
because I understand and value quality."* R-16 resolves the tension with §3's achievement platform as
an **audience of one**: address the buyer alone, never an implied spectator. That has a concrete
product consequence — **no social-proof counters, no "X people bought this", no scarcity theatre.**

Needs: to learn before being asked to buy (§34); to compare three expressions that are peers in
presentation but a 5× ladder in price (R-14); to feel the price is justified by the total experience
(§22, §49).

### 2.2 The gift giver — co-primary

§32 makes gifting a pillar. A materially different person: **buying for someone else's taste, not
their own.** The brief gives them no emotional benefit — `base.md` flags this gap, and it is not
this document's to invent.

What they need that the self-purchaser does not: confidence it will *present* well without seeing it;
control over delivery timing; the ability to avoid the recipient seeing a price; and a route to a
decision when they do not know the recipient's tea preference. That last need is what the **Assam
Collection** and gift boxes exist to answer.

### 2.3 The corporate buyer — out of launch scope

§2 names them. R-19 records that their requirements — volume pricing, personalisation, lead times,
invoicing, coordinated delivery — are undeveloped. **Launch routes them to Contact**, deliberately.

### 2.4 The returning customer

§59's *Return* stage: *"the customer develops preferences across the collection."* R-20's recommended
resolution is **curated progression** — FOCUS → ELEGANCE → LEGACY — rather than repeat-purchase
discounts, which §49 forbids and which would invert *earned*.

Product consequence: order history must be legible enough to support "you have had FOCUS; LEGACY is
the next step." **Not built at launch**, but the data model must not preclude it.

---

## 3. Sitemap

From §36. **Note:** §36's own indentation was lost when the brief was pasted as plain text —
`brief.md`'s header records this. The nesting below is **inference** from the item order and from
§12's product architecture, not from the source.

```
Home
Shop                          — catalogue, all purchasable items
  Assam Matcha                — FOCUS
  Silver Needle Assam         — ELEGANCE
  Assam Golden Tips           — LEGACY
  Green Tea                   — CONDITIONAL, see R-05
  Gift Sets
  Matcha Ritual Set
  The Assam Collection        — the three heroes as one proposition (§13)
Our Story
  Origin                      — Assam, §16
  The Craft                   — §12 process territory
  Tea Rituals                 — §33, §40
Gifting                       — §32. A destination, not a filter
Journal                       — §36, §41. Repo-authored (R-34)
Contact
─────────────────────────────
Cart · Checkout · Order confirmation · Account
Shipping Policy · Returns & Refunds · Privacy · Terms · FAQ
```

**Two structural decisions, `PROVISIONAL`:**

**Gifting is a top-level destination, not a shop filter.** §32 calls it a pillar and says it must not
be treated as a seasonal add-on. A filter inside Shop would make it exactly that. Ladurée does the
same (`design-system.md` §8.8).

**"The Assam Collection" is a page, not a category.** §13's platform is *Three expressions. One
origin.* — a story about how the three relate. As a category it would be a duplicate listing; as a
page it is the argument for the ladder, and it is where R-14's price hierarchy gets explained rather
than defended.

### 3.1 URL scheme — `PROVISIONAL`

```
/                      /shop                  /shop/assam-matcha
/collection            /gifting               /gift-sets/<slug>
/rituals/matcha-set    /our-story             /our-story/origin
/journal               /journal/<slug>        /learn/<slug>
/cart                  /checkout              /order/<id>
/account               /policies/<slug>       /contact
```

Product URLs are flat under `/shop/` — with six items, nesting by category buys nothing and makes
every slug fragile if R-05 changes the taxonomy. `features/seo.md` owns the rest.

**Constraint from R-08:** "Hukhmal" and "halter" are quarantined from slugs and metadata as well as
copy. §17 does not name URLs; they are public surfaces and it applies.

---

## 4. Page specifications

Only the pages with real structure are specified here. `features/*.md` own behaviour and edge cases.

### 4.1 Home

§37 gives the narrative in layers, in order. This document keeps that order:

1. **Hero** — `EARNED, NOT INDULGED.` with the §37 support line. One statement, not a carousel;
   `design-system.md` §8 rejects Ladurée's five-slot rotation against §35's "spacious, fast".
2. **Collection** — *Three expressions. One origin.* The three heroes.
3. **Brand story** — the philosophy, linking to Our Story.
4. **Assam** — the sourcing region. **Constrained by R-03:** sub-regional provenance cannot appear
   until validated, so this layer speaks at state level only.
5. **Product craft** — how the three differ (§12).
6. **Ritual** — §33. Preparation made desirable.
7. **Gifting** — §32 formats.
8. **Quality philosophy** — *Exceptional Tea. Uncompromising Quality.*
9. **Shop the collection** — the CTA.

§6 governs which line appears where; they must not all appear together.

### 4.2 Product page

§38 lists eighteen fields. Every one is specified in `features/product-page.md`; what matters here is
**which of them cannot be filled today**:

| §38 field | Status |
|---|---|
| Name, Photography, Price, Weight, Description, Tea Type, Origin | Available |
| **Taste / Aroma Notes** | **BLOCKED — R-29.** No sensory vocabulary exists for any product |
| **Processing Story** | **BLOCKED — R-01.** §12's chain is unconfirmed by the supplier |
| Brewing Instructions, Storage, Gifting Suitability, Shipping | Available |
| Ingredients | Available |
| **Statutory / FSSAI** | **BLOCKED — R-28.** Required fields not enumerated anywhere |
| Add to Cart, Related Products, Product Character | Available |

**Three of eighteen fields are blocked, and they are the three that carry the argument.** §39 makes
*"What does it taste like?"* one of six required questions and §41 makes Taste a content pillar.

**Decision, `PROVISIONAL`:** the page is built so a blocked field is **absent, not empty**. No
placeholder, no "coming soon", no meter rendered with invented values. §16 forbids fabrication and a
half-filled premium page reads worse than a shorter complete one. This is the single most important
product constraint at launch.

### 4.3 Matcha Ritual Set

§32's six components — matcha, whisk, bamboo spoon, strainer, ceramic bowl, whisk stand — sold as
**one purchasable item**. R-30 confirmed Medusa models this natively via Inventory Kits: the set goes
out of stock the moment any single component does.

§33 makes preparation part of the product, so this page carries the ritual instruction (measure,
sift, whisk, water temperature, technique, whisk care) rather than deferring it to Journal.

**R-09 constrains the copy:** whisk terminology — *chasen* versus *whisk* versus *channi* — is
unstandardised, and it is a positioning choice, not a translation. The page cannot ship until it is
settled.

### 4.4 Gifting

A destination (§3). Carries the Regular Gift Box, the Matcha Tea Box and the Ritual Set, plus the
corporate enquiry route (§2.3).

**R-12 is unresolved and visible here:** §32 specifies "four tea variants" in the Regular Gift Box
against §13's three-hero collection. Either a fourth product exists or the contents are wrong. It
interacts with R-05 directly — if Green Tea is in the range, the arithmetic closes.

### 4.5 Journal, Our Story, Tea Education

Repo-authored (R-34); the client cannot edit them. §40 supplies ten education topics — but several
are unwritable today for the same reason as section 4.2: *"What is Silver Needle?"* is answerable, *"what
does it taste like"* is not.

---

## 5. Flows

§59 gives the journey: Discover → Understand → Desire → Purchase → Receive → Prepare → Experience →
Return → Gift. The first three and the last three are largely content and fulfilment. The flows that
are software:

### 5.1 Purchase — the spine

```
Catalogue → Product → [variant] → Add to cart → Cart
  → Checkout: contact → address → shipping method → payment
  → Razorpay → webhook → Order confirmed → Email
```

Governed by `architecture.md` §2. Three rules restated because they are product-visible:

- **Stock is reserved at the point it is committed, under lock.** A kit reserves all six components
  or fails as a unit. The customer must never learn at payment that a component ran out.
- **Checkout is idempotent.** A double-clicked pay button produces one order.
- **Order state is derived from an append-only event log**, so an out-of-order gateway webhook cannot
  regress a confirmed order.

**Guest checkout is supported.** *Inference:* §21's buyer is not seeking a relationship at first
purchase, and forcing account creation before a ₹4,999 first order adds friction at the exact moment
§22 needs confidence. An account may be created *after* the order from the confirmation.

### 5.2 Gift purchase

Diverges from section 5.1 after cart: gift options — message, recipient address distinct from billing,
delivery-date preference — then **no price in the parcel**. That last is not in the brief; it is an
**inference** from §32 treating gifting as a pillar, and it is a hard requirement of gift commerce.

### 5.3 Corporate enquiry

Contact form → human. No quoting, no invoicing, no bulk pricing at launch (§2.3, R-19).

### 5.4 Return / refund

Blocked on policy, not code: §36 requires a Returns policy and none exists. Food products carry
statutory constraints on returnability that R-28's FSSAI work will touch. `features/policies.md`.

---

## 6. State inventory

Every surface must specify these. Defaults below; `features/*.md` may override with reason.

| State | Rule |
|---|---|
| **Loading** | Skeleton matching final layout. No spinner on a full page. Never a layout shift — `architecture.md` §3 budgets CLS < 0.1 |
| **Empty** | Explains and offers one route out. An empty cart says what to do, not "your cart is empty" alone |
| **Partial** | **The defining state of this launch.** A product page missing Taste Notes (R-29) renders *without that section* — not with a placeholder |
| **Error** | Says what happened, whether money moved, and what to do. Payment errors always state whether the customer has been charged |
| **Success** | Confirms specifically. Order number, what was bought, when it arrives |
| **Out of stock** | Shown at catalogue level, not discovered at checkout. For kits, the set is unavailable when any component is |
| **Disabled** | Never silent. A disabled control says why |

Interactive component states — hover, focus, active — are `design-system.md` §5's, not this
document's.

---

## 7. What this document is waiting on

| Blocks | Risk | Effect if unresolved |
|---|---|---|
| Catalogue shape, nav, gift-box contents | **R-05** Green Tea | §3's sitemap has a conditional node; R-12's arithmetic stays broken |
| Product page completeness | **R-29** sensory vocabulary | Three §38 fields absent on every hero |
| Product page legality | **R-28** FSSAI fields | Cannot ship a food product page |
| Processing Story | **R-01** supplier process | §12's chain unusable as claim |
| Provenance depth | **R-03** Deenukhiya | Origin speaks at state level only |
| Ritual Set copy | **R-09** whisk terminology | Page cannot ship |
| Gift box contents | **R-12** four teas vs three | Spec and costing blocked |
| Return policy | — | §36 requires it; none drafted |

**None of these is a code problem.** Seven of eight need a supplier, a lawyer, a printer or a client
decision — which is why `risks.md` exists and why those rows were written before this document.
