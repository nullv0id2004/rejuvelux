'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon, IconButton } from '@/components/ds';
import { useCart } from '@/lib/cart';
import { useTheme } from '@/lib/theme';
import { Wordmark } from './primitives';

const NAV: { href: string; label: string }[] = [
  { href: '/#collection', label: 'Shop' },
  { href: '/garden', label: 'The Garden' },
  { href: '/craft', label: 'The Craft' },
  { href: '/wholesale', label: 'Wholesale' },
  { href: '/contact', label: 'Contact' },
];

function isActive(href: string, pathname: string) {
  if (href === '/#collection') return pathname === '/' || pathname.startsWith('/shop');
  return pathname === href;
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <IconButton
      label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      variant="ghost"
      onClick={toggle}
    >
      {/* Two overlapping discs — a light/dark mark that needs no extra icon set. */}
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
 * Sticky nav, 64–72px, hairline bottom border. The wordmark is centred with the
 * links split either side (the flow the design landed on); below the shell
 * breakpoint the links collapse into a disclosure menu.
 */
export function Nav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const { count, setOpen } = useCart();

  // Close the mobile menu whenever navigation completes.
  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  const link = ({ href, label }: { href: string; label: string }) => (
    <Link key={href} href={href} className={isActive(href, pathname) ? 'on' : ''}>
      {label}
    </Link>
  );

  return (
    <>
      <header className="nav">
        <div className="wrap nav-c">
          <nav className="nav-links" aria-label="Primary">
            {NAV.slice(0, 3).map(link)}
          </nav>
          <span className="menu-btn">
            <IconButton
              label={menu ? 'Close menu' : 'Menu'}
              variant="ghost"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? 'x' : 'menu'} size={20} />
            </IconButton>
          </span>

          <Wordmark stacked size={20} href="/" crest crestWidth={46} />

          <div className="row g6" style={{ justifyContent: 'flex-end' }}>
            <nav className="nav-links" aria-label="Secondary">
              {NAV.slice(3).map(link)}
            </nav>
            <ThemeToggle />
            <IconButton
              label={count ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart'}
              variant="ghost"
              badge={count || undefined}
              onClick={() => setOpen(true)}
            >
              <Icon name="shopping-bag" size={20} />
            </IconButton>
          </div>
        </div>
      </header>

      {menu && (
        <div className="mobile-menu">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
