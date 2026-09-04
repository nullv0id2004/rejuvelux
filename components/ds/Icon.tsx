'use client';

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';

// The design system specifies Lucide at stroke 1.5 (readme → Iconography). The
// prototype loaded the UMD build from a CDN at runtime; here the icons come from
// `lucide-react` so they render on the server and ship no extra network request.
// Registering only the glyphs the site uses keeps the client bundle small.
const REGISTRY = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  calendar: Calendar,
  check: Check,
  'chevron-down': ChevronDown,
  'clipboard-list': ClipboardList,
  leaf: Leaf,
  'map-pin': MapPin,
  menu: Menu,
  minus: Minus,
  package: Package,
  plus: Plus,
  search: Search,
  'shopping-bag': ShoppingBag,
  x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof REGISTRY;

export type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.5,
  color = 'currentColor',
  style,
}: IconProps) {
  const Glyph = REGISTRY[name];
  return (
    <span
      aria-hidden="true"
      style={{ display: 'inline-flex', width: size, height: size, flex: 'none', lineHeight: 0, ...style }}
    >
      <Glyph size={size} strokeWidth={strokeWidth} color={color} />
    </span>
  );
}
