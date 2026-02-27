'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Arena } from '@/lib/types';
import { industries } from '@/lib/data';

interface FeaturedArenasShowcaseProps {
  arenas: Arena[];
  locale: string;
  title: string;
  subtitle: string;
}

// Helper function to map Chinese industry name to industry key
function getIndustryKey(chineseName: string): string | null {
  for (const [key, value] of Object.entries(industries)) {
    if (value.zh === chineseName) {
      return key;
    }
  }
  return null;
}

// Helper function to find the industry key from arena's industry string
function findIndustryKeyFromArena(industryString: string, locale: string): string | null {
  // Split by comma and try each part
  const parts = industryString.split(',').map(s => s.trim());

  for (const part of parts) {
    // Try to find exact match first
    for (const [key, value] of Object.entries(industries)) {
      if ((locale === 'zh' && value.zh === part) ||
          (locale === 'en' && value.en === part)) {
        return key;
      }
    }

    // Try to find partial match (e.g., "金融贸易" contains "金融")
    if (locale === 'zh') {
      for (const [key, value] of Object.entries(industries)) {
        if (part.includes(value.zh) || value.zh.includes(part)) {
          return key;
        }
      }
    } else {
      // For English, try fuzzy matching
      for (const [key, value] of Object.entries(industries)) {
        const partLower = part.toLowerCase();
        const valueEnLower = value.en.toLowerCase();
        if (partLower.includes(valueEnLower) || valueEnLower.includes(partLower)) {
          return key;
        }
      }
    }
  }

  return null;
}

// Helper function to map Chinese category name to category key
function getCategoryKey(chineseName: string): string | null {
  // Categories are stored in the arena data as comma-separated strings
  // We'll use the first category for linking
  return chineseName.toLowerCase().replace(/\s+/g, '-');
}

// Skeleton component for loading state
export function FeaturedArenasShowcaseSkeleton() {
  return (
    <section className="relative py-section bg-[#0A0E17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left Side */}
          <div className="lg:col-span-2 lg:border-r lg:border-white/10 lg:pr-8">
            <div className="mb-8">
              <div className="h-12 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/5 rounded w-full"></div>
            </div>
            <div className="divide-y divide-white/10 space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2 mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                    <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-3 lg:pl-8 mt-8 lg:mt-0">
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              <div className="w-full aspect-video bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 11-12 0 6 6 0 0112 0zm-1-6a1 1 0 00-2 0v4a1 1 0 102 0v-4z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Demo Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedArenasShowcase({ arenas, locale, title, subtitle }: FeaturedArenasShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;

  const selectedArena = arenas[selectedIndex] || arenas[0];
  const isZh = locale === 'zh';

  // Reset video state when changing arena
  useEffect(() => {
    setVideoError(false);
    setVideoLoading(true);
  }, [selectedIndex]);

  return (
    <section className="relative py-section bg-[#0A0E17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left Side - Case Menu */}
          <div className="lg:col-span-2 lg:border-r lg:border-white/10 lg:pr-8">
            {/* Fixed Header */}
            <div className="mb-8">
              <h2 className="text-h1 text-white mb-4 tracking-tight">{title}</h2>
              <p className="text-body-lg text-gray-400 leading-relaxed">{subtitle}</p>
            </div>

            {/* Case List */}
            <div className="divide-y divide-white/10 space-y-0">
              {arenas.map((arena, index) => (
                <div
                  key={arena.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(index)}
                >
                  {/* Background - highlight on selected/hover */}
                  <div className={`
                    absolute inset-0 rounded-lg transition-all duration-300
                    ${selectedIndex === index ? 'bg-blue-600/20 border-2 border-blue-500' : 'bg-transparent hover:bg-white/5'}
                  `} />

                  <div className="relative p-4">
                    {/* Main Title - Clickable link to arena details */}
                    <Link
                      href={`/${locale}/arena/${arena.folderId}`}
                      className={`
                        text-base font-semibold mb-2 transition-colors duration-300 block
                        ${selectedIndex === index ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}
                      `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {arena.title[locale as keyof typeof arena.title] || arena.title.zh}
                    </Link>

                    {/* Expanded Description - show on hover or selected */}
                    {(hoveredIndex === index || selectedIndex === index) && (
                      <div className="overflow-hidden">
                        <p className="text-sm text-gray-400 leading-relaxed mb-3 animate-fadeIn">
                          {isZh ? arena.highlights : arena.highlightsEn}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Industry Tag - Link to filtered arena page */}
                      {(() => {
                        const industryString = isZh ? arena.industry : arena.industryEn;
                        const industryList = industryString.split(',').map(s => s.trim());
                        const firstIndustry = industryList[0];
                        const industryKey = findIndustryKeyFromArena(industryString, locale);

                        if (industryKey) {
                          return (
                            <Link
                              href={`/${locale}/arena?industry=${industryKey}`}
                              className={`
                                text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300
                                ${selectedIndex === index
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300'}
                              `}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {firstIndustry}
                            </Link>
                          );
                        }
                        return (
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-medium
                            ${selectedIndex === index
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-white/5 text-gray-400 border border-white/10'}
                          `}>
                            {firstIndustry}
                          </span>
                        );
                      })()}

                      {/* Category Tag - Link to filtered arena page */}
                      {(() => {
                        const categoryString = isZh ? arena.category : arena.categoryEn;
                        const categoryList = categoryString.split(',').map(s => s.trim());
                        const firstCategory = categoryList[0];

                        return (
                          <Link
                            href={`/${locale}/arena?category=${encodeURIComponent(firstCategory)}`}
                            className={`
                              text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300
                              ${selectedIndex === index
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300'}
                            `}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {firstCategory}
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Case Details / Demo */}
          <div className="lg:col-span-3 lg:pl-8 mt-8 lg:mt-0">
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              {selectedArena ? (
                videoError ? (
                  // Video error fallback
                  <div className="w-full aspect-video bg-black flex items-center justify-center text-white p-8">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg mb-2">{isZh ? '视频加载失败' : 'Video Failed to Load'}</p>
                      <p className="text-sm text-gray-400">{isZh ? '演示视频正在准备中' : 'Demo video coming soon'}</p>
                    </div>
                  </div>
                ) : (
                  <video
                    key={selectedArena.id}
                    className="w-full aspect-video object-contain bg-black"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => {
                      setVideoError(true);
                      setVideoLoading(false);
                    }}
                    onCanPlay={() => {
                      setVideoError(false);
                      setVideoLoading(false);
                    }}
                    onLoadedData={() => {
                      setVideoLoading(false);
                    }}
                  >
                    <source
                      src={withBasePath(`/videos/${selectedArena.videoFile || `${selectedArena.folderId}.mp4`}`)}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                // No arena selected fallback
                <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
                  <p>{isZh ? '加载中...' : 'Loading...'}</p>
                </div>
              )}

              {/* Loading overlay */}
              {videoLoading && !videoError && selectedArena && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm">{isZh ? '视频加载中...' : 'Loading video...'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Arena title and description */}
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white mb-3">
                {selectedArena ? (selectedArena.title[locale as keyof typeof selectedArena.title] || selectedArena.title.zh) : ''}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {selectedArena ? (isZh ? selectedArena.highlights : selectedArena.highlightsEn) : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Industry Buttons */}
        <div className="mt-8 pt-8 border-t border-white/10">
          {/* First Row - 5 Industry Buttons (excluding "General") */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            {Object.entries(industries)
              .filter(([key]) => key !== 'general')
              .map(([key, { zh, en }]) => (
              <Link
                key={key}
                href={`/${locale}/arena?industry=${key}`}
                className="group"
              >
                <div className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 text-center">
                  <span className="text-white text-sm font-medium whitespace-nowrap">{isZh ? zh : en}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Second Row - Browse All Link */}
          <div className="text-left">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 group"
            >
              <span className="text-blue-400 text-base font-medium underline underline-offset-4 group-hover:text-blue-300 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)] transition-all duration-300">
                {isZh ? '联系我们 →' : 'Contact Us →'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
