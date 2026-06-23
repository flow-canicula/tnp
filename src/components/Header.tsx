'use client';

import Link from 'next/link';
import Image from 'next/image';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const LOCALES = ['en', 'vi', 'ja'] as const;

function useLocaleFromPath(): string {
  const pathname = usePathname();
  const seg = pathname.split('/')[1];
  return LOCALES.includes(seg as 'en' | 'vi' | 'ja') ? seg : 'en';
}

interface HeaderMessages {
  nav: { home: string; pricing: string; contact: string; getQuote: string };
  languageSwitcher: { label: string };
}

interface HeaderProps {
  messages: HeaderMessages;
}

export default function Header({ messages }: HeaderProps) {
  const locale = useLocaleFromPath();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { nav, languageSwitcher } = messages;

  const navLinks = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/pricing`, label: nav.pricing },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-cream-200 animate-header-drop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <Image
              src={`${base}/assets/logo/tnp_logo_primary.png`}
              alt="TNP — Solid wood flooring and timber furniture"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium text-forest-800 hover:text-timber-500 rounded-lg hover:bg-cream-50 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher label={languageSwitcher.label} />
            <Link
              href={`/${locale}/contact`}
              className="px-4 py-2 bg-timber-500 hover:bg-timber-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              {nav.getQuote}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-lg text-forest-800 hover:bg-cream-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-cream-200 bg-white px-4 py-4"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-forest-800 hover:text-timber-500 hover:bg-cream-50 rounded-lg transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-cream-100 flex items-center justify-between">
              <LanguageSwitcher label={languageSwitcher.label} align="left" />
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 bg-timber-500 hover:bg-timber-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {nav.getQuote}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
