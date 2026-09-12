'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon, IconButton } from '@/components/ds';
import { useCart } from '@/lib/cart';
import { useTheme } from '@/lib/theme';
import { Wordmark } from './primitives';

type Item = { href: string; label: string };
type Menu = { id: 'shop' | 'gifts'; label: string; items: Item[]; match: string[] };
type NavLink = Item & { match: string[] };

/** Main navigation from the content handover (two menus, three direct links), plus Contact. */
const SHOP: Menu = {
  id: 'shop',
  label: 'Shop Tea',
  items: [
    { href: '/shop', label: 'All Tea' },
    { href: '/collections/assam-collection', label: 'The Assam Collection' },
    { href: '/shop/assam-matcha', label: 'Assam Matcha' },
    { href: '/shop/silver-needle-assam', label: 'Silver Needle Assam' },
    { href: '/shop/assam-golden-tips', label: 'Assam Golden Tips' },
    { href: '/shop/green-tea', label: 'Green Tea' },
    { href: '/shop/ctc-tea', label: 'CTC Tea' },
    { href: '/shop/ube', label: 'Ube' },
  ],
  match: ['/shop', '/collections'],
};

const GIFTS: Menu = {
  id: 'gifts',
  label: 'Gifts',
  items: [
    { href: '/gifting', label: 'Gifting' },
    { href: '/collections/gift-sets', label: 'Tea Gift Sets' },
    { href: '/shop/complete-tasting-gift-set', label: 'Complete Tasting Set' },
    { href: '/shop/heritage-duo-gift-set', label: 'Heritage Duo' },
    { href: '/shop/vibrant-duo-gift-set', label: 'Vibrant Duo' },
    { href: '/shop/matcha-ritual-set', label: 'Matcha Ritual Set' },
    { href: '/corporate-gifting', label: 'Corporate Gifting' },
    { href: '/festive-gifting', label: 'Festive Gifting' },
  ],
  match: ['/gifting', '/corporate-gifting', '/festive-gifting', '/collections/gift-sets'],
};

const RITUALS: NavLink = {
  href: '/tea-rituals',
  label: 'Tea Rituals',
  match: ['/tea-rituals', '/how-to-make-matcha', '/choose-your-tea'],
};

const RIGHT: NavLink[] = [
  { href: '/our-story', label: 'Our Story', match: ['/our-story', '/assam-origin', '/craft'] },
  { href: '/journal', label: 'Journal', match: ['/journal'] },
  { href: '/contact', label: 'Contact', match: ['/contact'] },
];

const matches = (match: string[], path: string) => match.some((m) => path === m || path.startsWith(m + '/'));

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <IconButton
      label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      variant="ghost"
      onClick={toggle}
    >
      {/* Two overlapping discs: a light/dark mark that needs no extra icon set. */}
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid currentColor',
          background: 'linear-gradient(90deg, currentColor 50%, transparent 50%)',
        }}
      />
    </IconButton>
  );
}

/**
 * Sticky nav with the wordmark centred and links split either side. Shop Tea and
 * Gifts open a panel under the bar; Escape, a click outside or a navigation
 * closes it. Below the shell breakpoint everything collapses into one menu.
 */
export function Nav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<Menu['id'] | null>(null);
  const [group, setGroup] = useState<Menu['id'] | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const header = useRef<HTMLElement>(null);
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    setMenu(false);
    setOpen(null);
  }, [pathname]);

  /**
   * The mobile drawer: pinned under the header wherever the page is scrolled,
   * with the page behind it held still. Escape closes it and returns focus to
   * the menu button; widening past the breakpoint closes it too.
   */
  useEffect(() => {
    if (!menu) return;
    setMenuTop(Math.max(0, Math.round(header.current?.getBoundingClientRect().bottom ?? 0)));
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const close = () => {
      setMenu(false);
      document.querySelector<HTMLButtonElement>('.menu-btn button')?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onResize = () => {
      if (window.innerWidth > 800) setMenu(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menu]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(null);
      header.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const trigger = (m: Menu) => {
    const expanded = open === m.id;
    return (
      <button
        key={m.id}
        type="button"
        data-menu={m.id}
        className={'nav-dd' + (matches(m.match, pathname) ? ' on' : '')}
        aria-expanded={expanded}
        aria-controls={`nav-panel-${m.id}`}
        aria-label={`${expanded ? 'Close' : 'Open'} ${m.label} menu`}
        onClick={() => setOpen(expanded ? null : m.id)}
      >
        {m.label}
        <span className="caret" aria-hidden="true" />
      </button>
    );
  };

  const link = (l: NavLink) => (
    <Link key={l.href} href={l.href} className={matches(l.match, pathname) ? 'on' : ''}>
      {l.label}
    </Link>
  );

  const panel = open === 'shop' ? SHOP : open === 'gifts' ? GIFTS : null;

  return (
    <>
      <header className="nav" ref={header}>
        <div className="wrap nav-c">
          <nav className="nav-links" aria-label="Primary">
            {trigger(SHOP)}
            {trigger(GIFTS)}
            {link(RITUALS)}
          </nav>
          <span className="menu-btn">
            <IconButton
              label={menu ? 'Close menu' : 'Menu'}
              variant="ghost"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? 'x' : 'menu'} size={20} />
            </IconButton>
          </span>

          <Wordmark stacked size={20} href="/" crest crestWidth={46} />

          <div className="row g6" style={{ justifyContent: 'flex-end' }}>
            <nav className="nav-links" aria-label="Secondary">
              {RIGHT.map(link)}
            </nav>
            <ThemeToggle />
            <IconButton
              label={count ? `Shopping bag, ${count} item${count === 1 ? '' : 's'}` : 'Shopping bag'}
              variant="ghost"
              badge={count || undefined}
              onClick={() => setCartOpen(true)}
            >
              <Icon name="shopping-bag" size={20} />
            </IconButton>
          </div>
        </div>

        {panel && (
          <div className="nav-panel" id={`nav-panel-${panel.id}`}>
            <div className="wrap">
              <ul>
                {panel.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className={pathname === i.href ? 'on' : ''}>
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {menu && (
        <div id="mobile-menu" className="mobile-menu" style={{ top: menuTop }}>
          <nav aria-label="Mobile">
            {[SHOP, GIFTS].map((m) => {
              const expanded = group === m.id;
              return (
                <div key={m.id} className="mm-group">
                  <button
                    type="button"
                    className={'mm-toggle' + (matches(m.match, pathname) ? ' on' : '')}
                    aria-expanded={expanded}
                    aria-controls={`mm-${m.id}`}
                    onClick={() => setGroup(expanded ? null : m.id)}
                  >
                    {m.label}
                    <span className="caret" aria-hidden="true" />
                  </button>
                  {expanded && (
                    <div id={`mm-${m.id}`} className="mm-list">
                      {m.items.map((i) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          className={'mm-sub' + (pathname === i.href ? ' on' : '')}
                          onClick={() => setMenu(false)}
                        >
                          {i.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {[RITUALS, ...RIGHT].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={matches(l.match, pathname) ? 'on' : ''}
                onClick={() => setMenu(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
