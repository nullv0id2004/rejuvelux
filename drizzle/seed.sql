-- Seed: the catalogue as it exists in apps/web/lib/catalogue.ts, 27 Aug 2026.
-- Product facts come from the client's 18 Aug 2026 list and brief.md §12–§15 —
-- nothing invented, absences preserved (NULL prices stay NULL: R-04, open call #4).
--
-- STOCK QUANTITIES ARE DEVELOPMENT VALUES, not facts. No supplier exists on
-- paper (R-01/R-40) and no physical stock has been counted. These numbers exist
-- so availability and reservation are exercisable; they are zeroed or corrected
-- through adjustStock() before anything goes live. Flagged in features/inventory.md.
--
-- Idempotent: ON CONFLICT DO NOTHING throughout, keyed on slugs and SKUs.

-- Products ------------------------------------------------------------------
INSERT INTO product (slug, name, territory, tea_type, origin, short_description, ingredients,
                     brewing_leaf, brewing_water, brewing_time, is_hero, standin_src, standin_alt, sort_order)
VALUES
  ('assam-matcha', 'Assam Matcha', 'FOCUS', 'Finely milled whole-leaf green tea', 'Assam, India',
   'Intention, energy and clarity. A finely milled whole-leaf green tea, made for a deliberate morning rather than a hurried one.',
   'Whole-leaf green tea', '2 g', '80 °C', 'Whisked, 30 sec', true,
   '/stock/matcha.webp', 'A bamboo whisk resting on whisked green tea foam.', 10),
  ('silver-needle-assam', 'Silver Needle Assam', 'ELEGANCE', 'White tea, young buds', 'Assam, India',
   'Delicacy and quiet sophistication. Young, tender buds, gently handled and barely oxidised. Not a loud tea.',
   'Whole-leaf white tea', '3 g', '75 °C', '4-5 min', true,
   '/stock/silver-needle.webp', 'Steam rising from a pale cup in soft daylight.', 20),
  ('assam-golden-tips', 'Assam Golden Tips', 'LEGACY', 'Black tea, selected golden tips', 'Assam, India',
   'Depth, rarity and quiet prestige. A premium Assam black tea distinguished by its selected golden tips.',
   'Whole-leaf black tea', '3 g', '95 °C', '3-4 min', true,
   '/stock/golden-tips.webp', 'Dry black tea leaf, photographed close.', 30),
  ('green-tea', 'Green Tea', NULL, 'Green tea', 'Assam, India',
   'An everyday green tea from the same origin as the collection.',
   'Whole-leaf green tea', '2 g', '80 °C', '2-3 min', false,
   '/stock/green-tea.webp', 'Green tea leaves suspended in a tall glass beside a bowl of dry leaf.', 40),
  ('matcha-ritual-set', 'The Matcha Ritual Set', NULL, 'Matcha and accessories', 'Assam, India',
   'Preparation is part of the product. Everything the ritual asks for, and the tea it was made for.',
   'Whole-leaf green tea; bamboo; ceramic', NULL, NULL, NULL, false,
   '/stock/ritual-set.webp', 'Matcha being whisked in a ceramic bowl, with the tools laid out beside it.', 50)
ON CONFLICT (slug) DO NOTHING;
-- CTC tea deliberately absent: R-52, open call #3. No row, no flag.

-- Variants (one per product; prices in paise; NULL = unconfirmed, R-04) ------
INSERT INTO product_variant (product_id, sku, price_paise, net_quantity)
SELECT p.id, v.sku, v.price_paise, v.net_quantity
FROM (VALUES
  ('assam-matcha',        'RJ-MATCHA-50',  99900::bigint, '50 g'),
  ('silver-needle-assam', 'RJ-SILVER-50',  NULL::bigint,  '50 g'),
  ('assam-golden-tips',   'RJ-GOLDEN-50',  499900::bigint, '50 g'),
  ('green-tea',           'RJ-GREEN-200',  59900::bigint,  '200 g'),
  ('matcha-ritual-set',   'RJ-RITUAL-SET', NULL::bigint,   'Six pieces')
) AS v(slug, sku, price_paise, net_quantity)
JOIN product p ON p.slug = v.slug
ON CONFLICT (sku) DO NOTHING;

-- Inventory items: one per physical thing that runs out ----------------------
-- The Matcha tin is ONE item shared by the standalone variant and the Ritual
-- Set: selling either depletes the same tin (data-model.md §4.1).
INSERT INTO inventory_item (sku, name) VALUES
  ('INV-MATCHA-50',  'Assam Matcha tin, 50 g'),
  ('INV-SILVER-50',  'Silver Needle Assam tin, 50 g'),
  ('INV-GOLDEN-50',  'Assam Golden Tips tin, 50 g'),
  ('INV-GREEN-200',  'Green Tea pack, 200 g'),
  ('INV-WHISK',      'Bamboo whisk'),
  ('INV-SPOON',      'Bamboo spoon'),
  ('INV-STRAINER',   'Strainer'),
  ('INV-BOWL',       'Ceramic bowl'),
  ('INV-STAND',      'Whisk stand')
ON CONFLICT (sku) DO NOTHING;

-- Levels: DEVELOPMENT quantities (see header) --------------------------------
INSERT INTO inventory_level (inventory_item_id, stocked_quantity)
SELECT i.id, s.qty
FROM (VALUES
  ('INV-MATCHA-50', 100), ('INV-SILVER-50', 100), ('INV-GOLDEN-50', 40),
  ('INV-GREEN-200', 200), ('INV-WHISK', 25), ('INV-SPOON', 25),
  ('INV-STRAINER', 25), ('INV-BOWL', 25), ('INV-STAND', 25)
) AS s(sku, qty)
JOIN inventory_item i ON i.sku = s.sku
ON CONFLICT (inventory_item_id) DO NOTHING;

-- Kit links -------------------------------------------------------------------
-- Teas: 1 link each. Ritual Set: 6 links — one per §32 component. This is the
-- entire kit mechanism; availability = min(floor(available/required)) across links.
INSERT INTO variant_inventory_item (variant_id, inventory_item_id, required_quantity)
SELECT v.id, i.id, l.qty
FROM (VALUES
  ('RJ-MATCHA-50',  'INV-MATCHA-50', 1),
  ('RJ-SILVER-50',  'INV-SILVER-50', 1),
  ('RJ-GOLDEN-50',  'INV-GOLDEN-50', 1),
  ('RJ-GREEN-200',  'INV-GREEN-200', 1),
  ('RJ-RITUAL-SET', 'INV-MATCHA-50', 1),
  ('RJ-RITUAL-SET', 'INV-WHISK',     1),
  ('RJ-RITUAL-SET', 'INV-SPOON',     1),
  ('RJ-RITUAL-SET', 'INV-STRAINER',  1),
  ('RJ-RITUAL-SET', 'INV-BOWL',      1),
  ('RJ-RITUAL-SET', 'INV-STAND',     1)
) AS l(vsku, isku, qty)
JOIN product_variant v ON v.sku = l.vsku
JOIN inventory_item i ON i.sku = l.isku
ON CONFLICT (variant_id, inventory_item_id) DO NOTHING;

-- Kit display copy (§32's component list) — added with migration 0001.
UPDATE product SET components = ARRAY['Assam Matcha','Bamboo whisk','Bamboo spoon','Strainer','Ceramic bowl','Whisk stand']
WHERE slug = 'matcha-ritual-set' AND components IS NULL;
