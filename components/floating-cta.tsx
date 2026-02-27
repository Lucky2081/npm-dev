'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface FloatingCTAProps {
  locale: string;
}

export function FloatingCTA({ locale }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    if (!isHomePage) {
      // Always show on non-homepage
      setIsVisible(true);
      return;
    }

    // On homepage, show only after Hero section is out of view
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (!heroSection) {
        setIsVisible(true);
        return;
      }

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      // Show when hero section is completely out of viewport
      setIsVisible(heroBottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (!isVisible) return null;

  const text = locale === 'zh' ? '浏览最佳AI实践' : 'Browse Best AI Practices';

  return (
    <Link
      href={`/${locale}/arena`}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label={text}
    >
      <div className="relative flex items-center gap-3 px-6 py-4 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-full shadow-[0_8px_32px_-8px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_48px_-12px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <span className="text-base font-semibold whitespace-nowrap">{text}</span>
        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
          <ArrowRight size={18} className="text-white" />
        </div>
      </div>
    </Link>
  );
}
