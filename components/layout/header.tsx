'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Menu, X, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'arena', href: '/arena' },
  { key: 'framework', href: '/framework' },
  { key: 'faq', href: '/faq' },
  { key: 'about', href: '/about' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href={withBasePath(`/${locale}`)} className="text-2xl font-bold text-primary">
            RWAI Arena
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === `/${locale}${item.href}`;
            return (
              <a
                key={item.key}
                href={withBasePath(`/${locale}${item.href}`)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-text-primary',
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary'
                )}
              >
                {t(item.key)}
              </a>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <button
              onClick={() => switchLocale(locale === 'en' ? 'zh' : 'en')}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {locale === 'en' ? 'EN' : '中文'}
            </button>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/THU-ZJAI/Real-World-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`;
              return (
                <a
                  key={item.key}
                  href={withBasePath(`/${locale}${item.href}`)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {t(item.key)}
                </a>
              );
            })}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => switchLocale(locale === 'en' ? 'zh' : 'en')}
                className="text-base font-medium text-text-secondary hover:text-text-primary"
              >
                {locale === 'en' ? '中文' : 'EN'}
              </button>
              <a
                href="https://github.com/THU-ZJAI/Real-World-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base font-medium text-text-secondary hover:text-text-primary"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
