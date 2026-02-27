import { Button, Badge } from '@/components/ui';
import { industries, categories } from '@/lib/data';
import { Arena } from '@/lib/types';
import { CheckCircle2, Trophy, Star, ArrowRight, Building2, ShoppingCart, GraduationCap, HeartPulse, Zap, Factory, Building, Target, Users, Code2, Layers, FlaskRound, Copy, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHomepageSectionContent, parseHomepageSectionContent } from '@/lib/content';
import { Suspense, Fragment } from 'react';
import Image from 'next/image';
import { ParticlesBackground } from '@/components/effects/particles-background';
import { ParticleNebulaBackground } from '@/components/effects/particle-nebula-background';
import { FeaturedArenasShowcase, FeaturedArenasShowcaseSkeleton } from '@/components/featured-arenas-showcase';
import { getAllArenasFromStaticData } from '@/lib/static-data';

// Helper function to get localized labels (fallback to content files for consistency)
function getLabel(locale: string, key: string): string {
  const labels: Record<string, Record<string, string>> = {
    'arena.status.verified': { en: 'Verified', zh: '已验证' },
    'arena.status.inArena': { en: 'In Arena', zh: '竞技中' },
    'arena.quality': { en: 'Quality', zh: '质量' },
    'arena.efficiency': { en: 'Efficiency', zh: '效率' },
  };
  return labels[key]?.[locale] || labels[key]?.['en'] || key;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supportedLocales = ['en', 'zh'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return (
    <div className="w-full">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection locale={locale} />
      </Suspense>
      <Suspense fallback={<ValuePropSectionSkeleton />}>
        <ValuePropSection locale={locale} />
      </Suspense>
      <Suspense fallback={<PartnersSectionSkeleton />}>
        <PartnersCarouselSection locale={locale} />
      </Suspense>
      <Suspense fallback={<FeaturedArenasShowcaseSkeleton />}>
        <FeaturedArenasSection locale={locale} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <RealWorldTestingSection locale={locale} />
      </Suspense>
      {/* PracticeIncludesSection and CaseStudiesSection removed - sections not in content files */}
      <Suspense fallback={<SectionSkeleton />}>
        <FinalCtaSection locale={locale} />
      </Suspense>
    </div>
  );
}

// Skeleton components
function HeroSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#0A0E17] py-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-4 bg-white/10 rounded w-48 mx-auto mb-8"></div>
          <div className="h-16 bg-white/10 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-8 bg-white/10 rounded w-1/2 mx-auto mb-6"></div>
          <div className="h-6 bg-white/10 rounded w-2/3 mx-auto mb-12"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-32 bg-white/10 rounded"></div>
            <div className="h-12 w-32 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-section bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </section>
  );
}

function ValuePropSectionSkeleton() {
  return (
    <section className="relative w-full max-w-7xl mx-auto mb-0">
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-x border-white/10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-8 md:p-10 min-h-[300px] border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-white/10 rounded-lg mb-8"></div>
            <div className="h-8 w-3/4 bg-white/10 rounded mb-4"></div>
            <div className="h-5 w-1/2 bg-white/10 rounded mb-4"></div>
            <div className="h-20 w-full bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnersSectionSkeleton() {
  return (
    <section className="py-16 border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-16 justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-40 h-20 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Parse hero content from markdown file
 */
function parseHeroContent(markdown: string) {
  const parsed = parseHomepageSectionContent(markdown);

  // Parse badges - support both English "Badges" and Chinese "徽章"
  // Updated regex to match badges section more robustly
  const badgesSection = markdown.match(/### (Badges|徽章)\s*\n+([\s\S]*?)(?=\n### |$)/);
  let badges = '';
  if (badgesSection) {
    const badgeItems = badgesSection[2].split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/-\s*\*\*[^\*]+\*\*\s*[:：]\s*/, '').trim()); // Remove "**Badge**: " prefix (support both : and ：)
    badges = badgeItems.filter(item => item.length > 0).join(' • ');
  }

  return {
    badges,
    title: parsed['Title'] || parsed['标题'],
    subtitle: parsed['Subtitle'] || parsed['副标题'],
    description: parsed['Description'] || parsed['描述'],
    primaryCta: parsed['Primary'] || parsed['主要按钮'],
    secondaryCta: parsed['Secondary'] || parsed['次要按钮'],
  };
}

async function HeroSection({ locale }: { locale: string }) {
  const contentFile = await getHomepageSectionContent('Hero Section', locale);
  if (!contentFile) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0f0f2a] py-section">
        <ParticlesBackground />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Error: Hero Section content not found for locale "{locale}". Please run sync-content or check Content/Homepage/homepage.{locale}.md</p>
        </div>
      </section>
    );
  }
  const content = parseHeroContent(contentFile.content);

  // Parse title to highlight certain words in blue and add word-by-word hover effect
  // Highlight "Ship" in blue, keep "Enterprise AI" in white
  // Each word becomes bold on hover
  const renderTitle = (title: string, isZh: boolean) => {
    // Split into words, keeping "Ship" highlighted
    const words = title.split(' ');
    return (
      <>
        {words.map((word, i) => {
          const hasPeriod = word.includes('.');
          const isShip = word.includes('Ship');
          const isReal = word.includes('Real');

          // Add line break before "Real"
          if (isReal) {
            return (
              <Fragment key={i}>
                <br />
                {' '}
                {hasPeriod ? (
                  // Handle period for "Real."
                  (() => {
                    const parts = word.split(/(\.)/);
                    return (
                      <>
                        {parts.map((part, j) => {
                          if (part === '.' || part === '') {
                            return <span key={j} className="hero-word-hover">{part}</span>;
                          }
                          return (
                            <span key={j} className="hero-word-hover">
                              {part}
                            </span>
                          );
                        })}
                      </>
                    );
                  })()
                ) : (
                  <span className="hero-word-hover">{word}</span>
                )}
              </Fragment>
            );
          }

          // Handle period separately
          if (hasPeriod) {
            const parts = word.split(/(\.)/);
            return (
              <Fragment key={i}>
                {i > 0 && ' '}
                {parts.map((part, j) => {
                  if (part === '.' || part === '') {
                    return <span key={j} className="hero-word-hover">{part}</span>;
                  }
                  const partIsShip = part === 'Ship';
                  return (
                    <span key={j} className={`hero-word-hover ${partIsShip ? 'text-[#3B82F6]' : ''}`}>
                      {part}
                    </span>
                  );
                })}
              </Fragment>
            );
          }

          return (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className={`hero-word-hover ${isShip ? 'text-[#3B82F6]' : ''}`}>
                {word}
              </span>
            </Fragment>
          );
        })}
      </>
    );
  };

  // Parse description to bold the last part
  // Chinese: "让你不再从零试错"
  // English: "so you never have to start from scratch."
  const renderDescription = (desc: string, isZh: boolean) => {
    if (isZh) {
      // Split at "让你不再从零试错"
      const parts = desc.split(/(让你不再从零试错)/);
      return (
        <>
          {parts.map((part, i) =>
            part === '让你不再从零试错' ? (
              <span key={i} className="font-bold text-white">{part}</span>
            ) : (
              part
            )
          )}
        </>
      );
    } else {
      // Split at "so you never have to start from scratch."
      const parts = desc.split(/(so you never have to start from scratch\.)/);
      return (
        <>
          {parts.map((part, i) =>
            part === 'so you never have to start from scratch.' ? (
              <span key={i} className="font-bold text-white">{part}</span>
            ) : (
              part
            )
          )}
        </>
      );
    }
  };

  const isZh = locale === 'zh';

  return (
    <section className="relative overflow-hidden bg-[#0A0E17] py-section" data-hero-section>
      {/* Dot matrix background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Blue glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3B82F6] rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <ParticlesBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Large Title with blue highlight */}
          <h1 className="text-[67px] sm:text-[84px] md:text-[101px] lg:text-[101px] font-bold text-white mb-8 max-w-5xl mx-auto leading-[1.1] hero-animate hero-animate-delay-200 tracking-tight hero-glow">
            {renderTitle(content.title, isZh)}
          </h1>

          {/* Subtitle - emphasized */}
          <p className="text-xl sm:text-2xl text-gray-200 mb-6 font-semibold hero-animate hero-animate-delay-300 tracking-tight max-w-3xl mx-auto">
            {content.subtitle}
          </p>

          {/* Description with bold emphasis */}
          <p className="text-base text-gray-400 max-w-3xl mx-auto mb-12 hero-animate hero-animate-delay-400 leading-relaxed">
            {renderDescription(content.description, isZh)}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center hero-animate hero-animate-delay-500">
            <Link href={`/${locale}/arena`}>
              <Button size="large" className="!bg-[#3B82F6] hover:!bg-blue-600 !text-white rounded-lg font-medium shadow-[0_0_40px_-15px_#3B82F6] hover:shadow-[0_0_60px_-20px_#3B82F6] hover:-translate-y-1 transition-all duration-300 border-0">
                {content.primaryCta}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href={`/${locale}/about`}>
              <Button size="large" variant="secondary" className="!border-white/30 !text-white hover:!bg-white/5 hover:!border-white/50 rounded-lg font-medium backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 !bg-transparent">
                {content.secondaryCta}
                <Code2 size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                       0 0 40px rgba(59, 130, 246, 0.3),
                       0 0 60px rgba(168, 85, 247, 0.2);
        }

        .hero-word-hover {
          display: inline-block;
          transition: font-weight 0.2s ease;
          cursor: default;
        }

        .hero-word-hover:hover {
          font-weight: 900;
        }

        .hero-animate {
          opacity: 0;
          animation: fadeUp 0.8s ease-out forwards;
        }

        .hero-animate-delay-100 { animation-delay: 0.1s; }
        .hero-animate-delay-200 { animation-delay: 0.2s; }
        .hero-animate-delay-300 { animation-delay: 0.3s; }
        .hero-animate-delay-400 { animation-delay: 0.4s; }
        .hero-animate-delay-500 { animation-delay: 0.5s; }

        .delay-100 { animation-delay: 0.1s; }
      `}</style>
    </section>
  );
}

/**
 * Parse value props section content
 */
function parseValuePropsContent(markdown: string) {
  const result: Array<{ title: string; description: string }> = [];

  // Support both English "Value Prop N" and Chinese "价值主张 N"
  const propSections = markdown.match(/### (Value Prop \d+|价值主张 \d+)\n([\s\S]*?)(?=### |$)/g);
  if (propSections) {
    propSections.forEach((section) => {
      const parsed = parseHomepageSectionContent(section);
      result.push({
        title: parsed['Title'] || parsed['标题'] || '',
        description: parsed['Description'] || parsed['描述'] || '',
      });
    });
  }

  return result;
}

/**
 * Value Proposition Section
 */
async function ValuePropSection({ locale }: { locale: string }) {
  const contentFile = await getHomepageSectionContent('Value Props Section', locale);
  if (!contentFile) {
    return null; // Skip section if content not found
  }
  const valueProps = parseValuePropsContent(contentFile.content);

  const icons = [<Zap size={40} />, <CheckCircle2 size={40} />, <Code2 size={40} />, <Layers size={40} />];

  return (
    <section className="relative w-full max-w-7xl mx-auto mb-0">
      {/* Decorative Horizontal Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-x border-white/10">
        {valueProps.map((prop, idx) => (
          <div key={idx} className="relative group p-8 md:p-10 flex flex-col items-center justify-center text-center transition-all hover:bg-white/[0.02] overflow-hidden">

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

            {/* Watermark Number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] leading-none font-bold text-white/[0.03] select-none font-mono tracking-tighter group-hover:text-blue-500/[0.08] transition-colors duration-500 pointer-events-none">
              0{idx + 1}
            </div>

            {/* Icon - Larger with enhanced hover effects */}
            <div className="relative z-10 mb-8">
              <div className="w-16 h-16 flex items-center justify-center text-blue-500 bg-blue-500/10 rounded-lg ring-1 ring-blue-500/20 group-hover:scale-125 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_50px_-15px_#3B82F6] transition-all duration-500">
                {icons[idx] || <Zap size={40} />}
              </div>
            </div>

            {/* Content - Larger and centered */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1a3a5c] mb-4 tracking-tight group-hover:scale-110 group-hover:text-blue-400 transition-all duration-300 block">
                {prop.title}
              </h3>
              <p className="text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {prop.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Partners Logo Carousel Section
 */
async function PartnersCarouselSection({ locale }: { locale: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;
  const partners = [
    { id: '1', name: 'Partner 1', logo: withBasePath('/partners/logo1.png') },
    { id: '2', name: 'Partner 2', logo: withBasePath('/partners/logo2.png') },
    { id: '3', name: 'Partner 3', logo: withBasePath('/partners/logo3.png') },
    { id: '4', name: 'Partner 4', logo: withBasePath('/partners/logo4.png') },
    { id: '5', name: 'Partner 5', logo: withBasePath('/partners/logo5.png') },
    { id: '6', name: 'Partner 6', logo: withBasePath('/partners/logo6.png') },
    { id: '7', name: 'Partner 7', logo: withBasePath('/partners/logo7.jpg') },
    { id: '8', name: 'Partner 8', logo: withBasePath('/partners/logo8.jpg') },
  ];

  return (
    <>
      <section className="py-16 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Masks - now transparent */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-transparent to-transparent z-10"></div>

            {/* Scrolling Track */}
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-32 h-16 sm:w-40 sm:h-20 mx-8 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="object-contain max-w-full max-h-full"
                    unoptimized
                  />
                </div>
              ))}

              {/* Duplicate set for seamless infinite scroll */}
              {partners.map((partner) => (
                <div
                  key={`${partner.id}-duplicate`}
                  className="flex-shrink-0 w-32 h-16 sm:w-40 sm:h-20 mx-8 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="object-contain max-w-full max-h-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Styles for Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 30s;
          }
        }
      `}</style>
    </>
  );
}

async function FeaturedArenasSection({ locale }: { locale: string }) {
  const contentFile = await getHomepageSectionContent('Featured Arenas Section', locale);
  if (!contentFile) {
    return null; // Skip section if content not found
  }
  const parsed = parseHomepageSectionContent(contentFile.content);

  // Read configuration from markdown
  const arenaIdsStr = parsed['Arena IDs'] || '';

  const arenas = await getAllArenasFromStaticData();

  // Parse arena IDs
  const arenaIds = arenaIdsStr.split(',').map((id: string) => id.trim()).filter((id: string) => id);

  // Filter arenas by IDs (check both id and folderId for backwards compatibility)
  const featuredArenas = arenaIds.length > 0
    ? arenas.filter(arena => arenaIds.includes(arena.id) || arenaIds.includes(arena.folderId))
    : arenas.slice(0, 3);

  const title = parsed['Title'];
  const subtitle = parsed['Subtitle'];

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <FeaturedArenasShowcase
        arenas={featuredArenas}
        locale={locale}
        title={title}
        subtitle={subtitle}
      />
    </Suspense>
  );
}

function ArenaCard({
  arena,
  locale,
  displayFields = ['status', 'quality-badge', 'title', 'industry', 'category', 'highlights', 'quality-metric', 'speed-metric']
}: {
  arena: Arena;
  locale: string;
  displayFields?: string[];
}) {
  const isChina = locale === 'zh';
  const statusLabel = arena.verificationStatus === '已验证'
    ? (isChina ? '已验证' : 'Verified')
    : (isChina ? '验证中' : 'In Verification');
  const qualityLabel = isChina ? '质量' : 'Quality';
  const speedLabel = isChina ? '速度' : 'Speed';

  // Helper to check if field should be displayed
  const shouldShow = (field: string) => displayFields.includes(field);

  return (
    <Link href={`/${locale}/arena/${arena.folderId}`} className="group block">
      <div className="bg-bg-primary border border-gray-200 rounded-card p-card hover:shadow-card-hover transition-all duration-default hover:-translate-y-1 h-full flex flex-col">
        {/* Status Badge and Quality Badge */}
        {shouldShow('status') || shouldShow('quality-badge') ? (
          <div className="flex justify-between items-start mb-4">
            {shouldShow('status') && (
              <Badge variant={arena.verificationStatus === '已验证' ? 'verified' : 'in-arena'}>
                {statusLabel}
              </Badge>
            )}
            {shouldShow('quality-badge') && (
              <div className="text-xs text-text-secondary">
                {arena.metrics.quality}
              </div>
            )}
          </div>
        ) : null}

        {/* Title */}
        {shouldShow('title') && (
          <h3 className="text-h3 text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {arena.title[locale as keyof typeof arena.title] || arena.title.zh}
          </h3>
        )}

        {/* Industry and Category Badges */}
        {shouldShow('industry') || shouldShow('category') ? (
          <div className="flex gap-2 mb-3">
            {shouldShow('industry') && (
              <Badge variant="industry">{isChina ? arena.industry : arena.industryEn}</Badge>
            )}
            {shouldShow('category') && (
              <Badge variant="category">{isChina ? arena.category : arena.categoryEn}</Badge>
            )}
          </div>
        ) : null}

        {/* Highlights */}
        {shouldShow('highlights') && (
          <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">
            {isChina ? arena.highlights : arena.highlightsEn}
          </p>
        )}

        {/* Metrics */}
        {(shouldShow('quality-metric') || shouldShow('speed-metric')) && (
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            {shouldShow('quality-metric') && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                <span>{qualityLabel}: {arena.metrics.quality}</span>
              </div>
            )}
            {shouldShow('speed-metric') && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                <span>{speedLabel}: {arena.metrics.speed}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * Parse approach content
 */
function parseApproachContent(markdown: string) {
  // First, extract the Header subsection for title and description
  // Support both English "Header" and Chinese "标题区"
  const headerMatch = markdown.match(/### (Header|标题区)\n([\s\S]*?)(?=### |$)/);
  const headerParsed = headerMatch
    ? parseHomepageSectionContent(headerMatch[0])
    : {};

  const result: Record<string, { title: string; description: string }> = {};

  // Parse steps - support both English "Step N" and Chinese "步骤 N"
  const stepSections = markdown.match(/### (Step \d+|步骤 \d+)\n([\s\S]*?)(?=### |$)/g);
  if (stepSections) {
    stepSections.forEach((section, index) => {
      const sectionParsed = parseHomepageSectionContent(section);
      result[`step${index + 1}`] = {
        title: sectionParsed['Title'] || sectionParsed['标题'] || '',
        description: sectionParsed['Description'] || sectionParsed['描述'] || '',
      };
    });
  }

  return {
    title: headerParsed['Title'] || headerParsed['标题'],
    description: headerParsed['Description'] || headerParsed['描述'],
    steps: result,
  };
}

/**
 * Parse real-world testing section content
 */
function parseRealWorldTestingContent(markdown: string) {
  const result: Array<{ title: string; description: string }> = [];

  // Parse value points - support both English "Value Point N" and Chinese "价值点 N" (or Value Point)
  const pointSections = markdown.match(/### (Value Point \d+|价值点 \d+)\n([\s\S]*?)(?=### |$)/g);
  if (pointSections) {
    pointSections.forEach((section) => {
      const parsed = parseHomepageSectionContent(section);
      result.push({
        title: parsed['Title'] || parsed['标题'] || '',
        description: parsed['Description'] || parsed['描述'] || '',
      });
    });
  }

  // Extract Content subsection for title and description
  const contentMatch = markdown.match(/### (Content|内容)\n([\s\S]*?)(?=### |$)/);
  const contentParsed = contentMatch
    ? parseHomepageSectionContent(contentMatch[0])
    : {};

  return {
    title: contentParsed['Title'] || contentParsed['标题'],
    description: contentParsed['Description'] || contentParsed['描述'],
    valuePoints: result,
  };
}

async function RealWorldTestingSection({ locale }: { locale: string }) {
  const contentFile = await getHomepageSectionContent('Real-World Testing Section', locale);
  if (!contentFile) {
    return null; // Skip section if content not found
  }
  const content = parseRealWorldTestingContent(contentFile.content);

  const icons = [<FlaskRound className="w-14 h-14" />, <Trophy className="w-14 h-14" />, <Copy className="w-14 h-14" />, <Shield className="w-14 h-14" />];

  return (
    <section className="py-section bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h1 text-text-primary mb-4">{content.title}</h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {content.valuePoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-primary">{icons[index]}</div>
              <h3 className="text-h3 text-text-primary mb-3 font-bold">{point.title}</h3>
              <p className="text-text-secondary">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Parse final CTA content
 */
function parseFinalCtaContent(markdown: string) {
  return parseHomepageSectionContent(markdown);
}

async function FinalCtaSection({ locale }: { locale: string }) {
  const contentFile = await getHomepageSectionContent('Final CTA Section', locale);
  if (!contentFile) {
    return null; // Skip section if content not found
  }
  const parsed = parseFinalCtaContent(contentFile.content);

  const title = parsed['Title'];
  const description = parsed['Description'];
  const primaryButton = parsed['Primary Button'];
  const secondaryButton = parsed['Secondary Button'];
  const betaNote = parsed['Beta Note'];

  return (
    <section className="py-section bg-gradient-to-br from-primary to-accent text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h1 mb-4">{title}</h2>
        <p className="text-body-lg mb-8 opacity-90">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="large" variant="primary" className="bg-white text-primary hover:bg-bg-secondary" asChild>
            <Link href={`/${locale}/arena`}>{primaryButton}</Link>
          </Button>
          <Button size="large" variant="secondary" className="border-white text-white hover:bg-white/10" asChild>
            <a href="https://github.com/THU-ZJAI/Real-World-AI" target="_blank" rel="noopener noreferrer">
              {secondaryButton}
            </a>
          </Button>
        </div>

        <p className="text-sm opacity-75">{betaNote}</p>
      </div>
    </section>
  );
}
