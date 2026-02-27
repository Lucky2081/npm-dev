'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Github } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;

  return (
    <footer className="border-t border-gray-200 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-primary mb-4">{t('brand')}</h3>
            <p className="text-sm text-text-secondary">
              {t('brandDescription')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">{t('platform')}</h4>
            <ul className="space-y-2">
              <li>
                <a href={withBasePath(`/${locale}/arena`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('arena')}
                </a>
              </li>
              <li>
                <a href={withBasePath(`/${locale}/framework`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('framework')}
                </a>
              </li>
              <li>
                <a href={withBasePath(`/${locale}/faq`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('faq')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">{t('community')}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/THU-ZJAI/Real-World-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  {t('github')}
                </a>
              </li>
              <li>
                <a href={withBasePath(`/${locale}/about`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('about')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:xuyuyao@tsinghua-zj.edu.cn"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  {t('contactUs')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              <li>
                <a href={withBasePath(`/${locale}/privacy`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href={withBasePath(`/${locale}/terms`)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                  {t('terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-secondary">{t('copyright')}</p>
          <a
            href="https://github.com/THU-ZJAI/Real-World-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">{t('followOnGitHub')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
