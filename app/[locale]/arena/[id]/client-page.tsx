'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Arena } from '@/lib/types';
import {
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Mail,
  Star,
  Zap,
  DollarSign,
  Shield,
  Settings,
  Github,
  Trophy,
  Play,
  Sparkles,
  Rocket,
  CheckCircle2,
  Target,
  TrendingUp,
  Lightbulb,
  Users,
  FileText,
  Tag,
  Clock,
  Calendar,
  ExternalLink,
  Code,
} from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
import { motion } from 'framer-motion';

type TabType = 'overview' | 'implementation' | 'tech-configuration';

// Metric value to star rating
const metricToStars: Record<string, number> = {
  '很慢': 1,
  '较低': 1,
  '慢': 1,
  '差': 1,
  '中等': 2,
  '较快': 3,
  '较高': 3,
  '很较': 3,
  '很快': 3,
  '很高': 3,
  '较优': 3,
  '优': 3,
};

// Convert metric value to stars
function getStarRating(value: string): number {
  return metricToStars[value] || 2;
}

// Speed to time mapping
const speedToTimeMapping: Record<string, string> = {
  '很快': '1-2 days',
  '较快': '1 week',
  '中等': '2 weeks',
  '较慢': '1 month',
  // Direct mappings from data
  '一周': '1 week',
  '1~2天': '1-2 days',
  '1-2天': '1-2 days',
  '两周': '2 weeks',
  '一月': '1 month',
  '半天': 'Half day',
};

// Extract time from description
function extractTimeFromDescription(description: string): string {
  const timePatterns: [RegExp, string][] = [
    [/(\d+[-~]\d+[天小时分钟]+)/, '$1'],
    [/两天半/, '2-3天'],
    [/三天半/, '3-4天'],
    [/四天半/, '4-5天'],
    [/五天半/, '5-6天'],
    [/半天/, '半天'],
    [/(一周|七天)/, '一周'],
    [/(两周|十四天)/, '两周'],
    [/(十天)/, '10天'],
    [/(九天)/, '9天'],
    [/(八天)/, '8天'],
    [/(七天的)/, '7天'],
    [/(六天)/, '6天'],
    [/(五天)/, '5天'],
    [/(四天)/, '4天'],
    [/(三天)/, '3天'],
    [/(两天)(?!半)/, '2天'],
    [/(一天)/, '1天'],
    [/(半小时|30分钟)/, '半小时'],
    [/(一小时|60分钟)/, '1小时'],
    [/(两小时|2小时)/, '2小时'],
    [/(三小时|3小时)/, '3小时'],
    [/(四小时|4小时)/, '4小时'],
    [/(五小时|5小时)/, '5小时'],
    [/(六小时|6小时)/, '6小时'],
  ];

  for (const [pattern, replacement] of timePatterns) {
    const match = description.match(pattern);
    if (match) {
      return replacement;
    }
  }

  return '';
}

interface ArenaDetailClientProps {
  arena: Arena;
  locale: string;
  arenaId: string;
  initialContent: { [key: string]: string };
  hasContent: boolean;
}

export function ArenaDetailClient({ arena, locale, arenaId, initialContent, hasContent }: ArenaDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const content = initialContent;
  const isChina = locale === 'zh';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const withBasePath = (path: string) => `${basePath}${path}`;
  const hasArenaSnapshot =
    Boolean(arena.highlights || arena.highlightsEn || arena.champion || arena.championEn || arena.industry || arena.industryEn);

  // Handle URL hash for direct tab linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as TabType;
      if (['overview', 'implementation', 'tech-configuration'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs: { key: TabType; label: string; icon: any; color?: string }[] = [
    { key: 'overview', label: locale === 'zh' ? '概览' : 'Overview', icon: BarChart3 },
    { key: 'implementation', label: locale === 'zh' ? '实施指南' : 'Implementation', icon: Settings, color: 'purple' },
    { key: 'tech-configuration', label: locale === 'zh' ? '技术配置' : 'Technical Configuration', icon: Zap, color: 'blue' },
  ];

  // Extract metrics from arena
  const metrics = {
    quality: arena.metrics?.quality || '较高',
    speed: arena.metrics?.speed || '较快',
    cost: arena.metrics?.cost || '较优',
    security: arena.metrics?.security || '较高',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-violet-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href={'/' + locale + '/arena'}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === 'zh' ? '返回Arena列表' : 'Back to Arena List'}
            </Link>
          </nav>

          {/* Compact Hero Section - Two-column layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column (40%): Title, Status, Champion, Description, Metrics */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                {/* Title with inline status badges */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                      {arena.title[locale as keyof typeof arena.title] || arena.title.zh}
                    </h1>
                    {/* Status and Contact Badges - Inline with title */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <Trophy className="h-3.5 w-3.5 mr-1" />
                        {locale === 'zh' ? '已验证' : 'Verified'}
                      </span>
                      <Link
                        href={'/' + locale + '/about'}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-all"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {locale === 'zh' ? '联系我们' : 'Contact'}
                      </Link>
                    </div>
                  </div>

                  {/* Champion/擂主 Info */}
                  {(locale === 'zh' ? arena.champion : arena.championEn) && (
                    <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <Trophy className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="font-semibold text-purple-900 text-sm">
                        {locale === 'zh' ? '擂主' : 'Champion'}:
                      </span>
                      <span className="text-gray-700 text-sm">{locale === 'zh' ? arena.champion : arena.championEn}</span>
                    </div>
                  )}

                  {/* Challenger/攻擂中 Info */}
                  {(() => {
                    const challenger = locale === 'zh' ? arena.challenger : arena.challengerEn;
                    return challenger && challenger !== '寻找攻擂者' && challenger.trim() !== '' ? (
                      <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border border-purple-100/60">
                        <Trophy className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <span className="font-semibold text-purple-700 text-sm">
                          {locale === 'zh' ? '攻擂中' : 'Challenger'}:
                        </span>
                        <span className="text-gray-600 text-sm">{challenger}</span>
                      </div>
                    ) : null;
                  })()}

                  {/* Description */}
                  <p className="text-base text-gray-600 leading-relaxed mb-4">
                    {locale === 'zh' ? arena.highlights : arena.highlightsEn}
                  </p>
                </div>

                {/* Compact Metrics */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Speed - Violet for Efficiency */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 mb-1">
                      <Zap className="h-4 w-4 text-violet-600" strokeWidth={2} />
                    </div>
                    <div className="text-xs font-semibold text-violet-700 leading-tight mb-0.5">
                      {extractTimeFromDescription(locale === 'zh' ? arena.highlights : arena.highlightsEn) || (locale === 'zh' ? metrics.speed : speedToTimeMapping[metrics.speed] || metrics.speed)}
                    </div>
                    <div className="text-[10px] text-gray-500">{locale === 'zh' ? '速度' : 'Speed'}</div>
                  </div>
                  {/* Quality - Yellow for Ranking/Accuracy */}
                  {[
                    { label: locale === 'zh' ? '质量' : 'Quality', stars: getStarRating(metrics.quality), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                    { label: locale === 'zh' ? '安全' : 'Security', stars: getStarRating(metrics.security), icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: locale === 'zh' ? '成本' : 'Cost', stars: getStarRating(metrics.cost), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="text-center">
                        <div className={'inline-flex items-center justify-center w-8 h-8 rounded-lg ' + metric.bg + ' mb-1'}>
                          <Icon className={'h-4 w-4 ' + metric.color} strokeWidth={2} />
                        </div>
                        <div className="flex justify-center gap-0.5 mb-0.5">
                          {[1, 2, 3].map((star) => {
                            const starColor = star <= metric.stars ? metric.color + ' fill-current' : 'text-gray-200 fill-current';
                            return (
                            <svg
                              key={star}
                              className={'h-3 w-3 ' + starColor}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-gray-500">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (60%): Demo Video */}
              <div className="lg:col-span-3">
                <div className="relative h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl border border-slate-700/50">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={withBasePath('/videos/' + (arena.videoFile || arena.folderId + '.mp4'))} type="video/mp4" />
                    {locale === 'zh' ? '您的浏览器不支持视频播放' : 'Your browser does not support the video tag.'}
                  </video>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-0" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const colorClasses = tab.color ? {
                purple: 'text-purple-600',
                green: 'text-green-600',
                amber: 'text-amber-600',
                red: 'text-red-600',
              }[tab.color] : '';

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.location.hash = tab.key;
                  }}
                  role="tab"
                  className={
                    "group relative flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap " +
                    (activeTab === tab.key
                      ? "border-blue-600 text-gray-900 bg-gradient-to-r from-blue-50 to-indigo-50"
                      : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:border-gray-300")
                  }
                >
                  <Icon className={"h-4 w-4 " + (activeTab === tab.key ? colorClasses : "group-hover:text-blue-600") + " transition-colors"} />
                  <span>{tab.label}</span>
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {!hasContent ? (
          hasArenaSnapshot ? (
            <div className="max-w-5xl mx-auto py-6">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 p-6 sm:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isChina ? '数据库已加载基础信息' : 'Base Data Loaded from Database'}
                </h2>
                <p className="text-gray-600">
                  {isChina
                    ? '该擂台暂未录入完整章节内容，当前先展示数据库中的基础信息。'
                    : 'Full tab content is not available yet. Showing base fields currently loaded from SQLite.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">{isChina ? '基本信息' : 'Basic Info'}</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">{isChina ? '行业' : 'Industry'}:</span> {isChina ? arena.industry : arena.industryEn}</p>
                    <p><span className="font-medium text-gray-900">{isChina ? '类别' : 'Category'}:</span> {isChina ? arena.category : arena.categoryEn}</p>
                    <p><span className="font-medium text-gray-900">{isChina ? '状态' : 'Status'}:</span> {arena.verificationStatus}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">{isChina ? '阵容信息' : 'Lineup'}</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">{isChina ? '擂主' : 'Champion'}:</span> {isChina ? arena.champion : arena.championEn}</p>
                    {((isChina ? arena.challenger : arena.challengerEn) || '').trim() && (
                      <p><span className="font-medium text-gray-900">{isChina ? '攻擂中' : 'Challenger'}:</span> {isChina ? arena.challenger : arena.challengerEn}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">{isChina ? '亮点' : 'Highlights'}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {isChina ? arena.highlights : arena.highlightsEn}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">{isChina ? '四维指标' : 'Metrics'}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div><span className="font-medium text-gray-900">{isChina ? '速度' : 'Speed'}:</span> {arena.metrics.speed}</div>
                    <div><span className="font-medium text-gray-900">{isChina ? '质量' : 'Quality'}:</span> {arena.metrics.quality}</div>
                    <div><span className="font-medium text-gray-900">{isChina ? '安全' : 'Security'}:</span> {arena.metrics.security}</div>
                    <div><span className="font-medium text-gray-900">{isChina ? '成本' : 'Cost'}:</span> {arena.metrics.cost}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Fallback only when DB also has no usable base fields
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
                <Settings className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === 'zh' ? '内容上传中' : 'Content Uploading'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {locale === 'zh'
                  ? '我们正在为这个AI实践案例准备详细的内容文档，包括实施指南、需求文档、验证报告等。敬请期待！'
                  : 'We are preparing detailed content documentation for this AI practice case, including implementation guides and more. Stay tuned!'
                }
              </p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Main Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="prose prose-lg max-w-none">
                {activeTab === 'overview' && content.overview && (
                  <OverviewSection content={content.overview} locale={locale} activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as TabType)} />
                )}

                {activeTab === 'implementation' && content.implementation && (
                  <ImplementationSection content={content.implementation} locale={locale} />
                )}

                {activeTab === 'tech-configuration' && content['tech-configuration'] && (
                  <TechConfigurationSection content={content['tech-configuration']} locale={locale} />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom markdown components to match reference styling
const markdownComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 mt-12 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3 mt-12" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-8" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-xl font-bold text-gray-900 mb-2 mt-6" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 text-gray-700 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-700 underline font-medium"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="space-y-2 mb-6 list-disc list-inside text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="space-y-2 mb-6 list-decimal list-inside text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  table: ({ children, ...props }: any) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap" {...props}>
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-600 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono border border-gray-300" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props}>
      {children}
    </pre>
  ),
  hr: ({ ...props }: any) => <hr className="my-8 border-t border-gray-300" {...props} />,
  div: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  span: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
};

// Overview Section Component - Original Card-based design
function OverviewSection({ content, locale, activeTab, setActiveTab }: {
  content: string;
  locale: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const isChina = locale === 'zh';

  // Icon mapping for sections
  const getSectionIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('key metrics') || lowerTitle.includes('核心指标')) return '📊';
    if (lowerTitle.includes('business highlights') || lowerTitle.includes('业务亮点')) return '🎯';
    if (lowerTitle.includes('solution overview') || lowerTitle.includes('解决方案概览')) return '💡';
    if (lowerTitle.includes('pain points') || lowerTitle.includes('痛点')) return '⚠️';
    if (lowerTitle.includes('performance metrics') || lowerTitle.includes('性能指标')) return '📈';
    if (lowerTitle.includes('best practice') || lowerTitle.includes('最佳实践')) return '🏅';
    if (lowerTitle.includes('demo') || lowerTitle.includes('演示')) return '🎬';
    if (lowerTitle.includes('basic information') || lowerTitle.includes('基本信息')) return '📋';
    return '📄';
  };

  // Parse overview content into structured sections
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const sections: {
      title: string;
      icon: string;
      subsections: Array<{
        title?: string;
        icon?: string;
        content: string[];
      }>;
    }[] = [];

    let currentSection: typeof sections[0] | null = null;
    let currentSubsection: typeof sections[0]['subsections'][0] | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines and separators
      if (!line || line === '---') continue;

      // Detect main section headers (##)
      const sectionMatch = line.match(/^##\s+(.+)/);
      if (sectionMatch) {
        if (currentSection) {
          if (currentSubsection) {
            currentSection.subsections.push(currentSubsection);
          }
          sections.push(currentSection);
        }
        const title = sectionMatch[1].trim();
        currentSection = {
          title,
          icon: getSectionIcon(title),
          subsections: []
        };
        currentSubsection = null;
        continue;
      }

      // Detect subsection headers (###)
      const subsectionMatch = line.match(/^###\s+(.+)/);
      if (subsectionMatch && currentSection) {
        if (currentSubsection) {
          currentSection.subsections.push(currentSubsection);
        }
        const title = subsectionMatch[1].trim();
        currentSubsection = {
          title,
          content: []
        };
        continue;
      }

      // Skip language headers
      if (line.startsWith('####')) {
        continue;
      }

      // Add content to current subsection or section
      if (currentSection && line) {
        if (currentSubsection) {
          currentSubsection.content.push(line);
        } else {
          // Create subsection if none exists
          currentSubsection = {
            content: [line]
          };
        }
      }
    }

    // Push last section and subsection
    if (currentSection) {
      if (currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseContent(content);

  // Render Business Highlights with EXTRA emphasis
  const renderBusinessHighlightsCard = (section: typeof sections[0]) => {
    if (!section.title.toLowerCase().includes('business highlights') && !section.title.includes('业务亮点')) {
      return null;
    }

    const rawItems = section.subsections
      .flatMap((sub) => sub.content)
      .map((line) => line.replace(/^-\s*/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean);

    const styleSlots = [
      { icon: TrendingUp, semanticColor: 'yellow' as const },
      { icon: Zap, semanticColor: 'violet' as const },
      { icon: Target, semanticColor: 'violet' as const },
      { icon: DollarSign, semanticColor: 'blue' as const },
    ];

    const fourHighlights = rawItems.slice(0, 4).map((item, idx) => {
      const [rawTitle, ...rest] = item.split(/[:：]/);
      const title = rawTitle?.trim() || item;
      const description = rest.join('：').trim() || item;
      return {
        title,
        description,
        icon: styleSlots[idx].icon,
        semanticColor: styleSlots[idx].semanticColor,
      };
    });

    // Semantic color mapping - matching Framework page exactly
    const semanticColorMap = {
      violet: { bg: 'from-violet-50 to-violet-100', border: 'border-violet-300', iconBg: 'bg-violet-600', title: 'text-violet-900', check: 'text-violet-700' },
      yellow: { bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-300', iconBg: 'bg-yellow-600', title: 'text-yellow-900', check: 'text-yellow-700' },
      blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-300', iconBg: 'bg-blue-600', title: 'text-blue-900', check: 'text-blue-700' },
      emerald: { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-300', iconBg: 'bg-emerald-600', title: 'text-emerald-900', check: 'text-emerald-700' },
    };

    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-violet-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Section Header - Standardized */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold mb-2 shadow-md">
                {isChina ? '核心价值' : 'CORE VALUE'}
              </span>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
                {isChina ? '业务亮点' : 'Business Highlights'}
              </h2>
            </div>
          </div>

          {/* Highlights Grid - 4 separate blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourHighlights.map((highlight, idx) => {
              const color = semanticColorMap[highlight.semanticColor as keyof typeof semanticColorMap];
              const Icon = highlight.icon;
              const cardClassName = 'group relative bg-gradient-to-br ' + color.bg + ' rounded-2xl p-6 border-2 ' + color.border + ' cursor-pointer';
              const bgClassName = 'absolute inset-0 bg-gradient-to-br ' + color.bg + ' rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300';
              const iconContainerClassName = 'flex h-12 w-12 items-center justify-center rounded-xl ' + color.iconBg + ' text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300';
              const titleClassName = 'text-xl font-black ' + color.title + ' mb-3 leading-tight';
              const checkClassName = 'h-4 w-4 ' + color.check + ' flex-shrink-0 mt-0.5';
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={cardClassName}
                >
                  <div className={bgClassName}></div>

                  <div className="relative z-10">
                    <div className={iconContainerClassName}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className={titleClassName}>
                      {highlight.title}
                    </h3>

                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={checkClassName} />
                      <span className="text-gray-800 font-medium leading-relaxed">
                        {highlight.description}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Rocket className="h-8 w-8 text-white" />
                <div>
                  <p className="text-white font-bold text-lg">
                    {isChina ? '立即可用，快速部署' : 'Ready to Use, Quick Deploy'}
                  </p>
                  <p className="text-blue-100 font-medium text-sm">
                    {isChina ? '完整的开源方案，企业级质量保证' : 'Complete open-source solution, enterprise-grade quality'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('implementation');
                  window.location.hash = 'implementation';
                }}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              >
                {isChina ? '立即开始' : 'Get Started'} →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Key Metrics section
  const renderKeyMetricsCard = (section: typeof sections[0]) => {
    if (!section.title.toLowerCase().includes('key metrics') && !section.title.includes('核心指标')) {
      return null;
    }

    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{section.icon}</span>
          <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {section.subsections.map((subsection, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:scale-[1.02] transition-all duration-300"
            >
              {subsection.title && (
                <h3 className="text-xl font-bold text-gray-900 mb-3">{subsection.title}</h3>
              )}
              <div className="space-y-2">
                {subsection.content.filter((c) => c.startsWith('-')).map((item, i) => (
                  <div key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>{item.replace(/^-\s+\*\*/, '').replace(/\*\*/g, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Business Pain Points section
  const renderPainPointsCard = (section: typeof sections[0]) => {
    if (!section.title.toLowerCase().includes('pain points') && !section.title.includes('痛点')) {
      return null;
    }

    // Pain points are about risk/safety - use emerald semantic color
    const riskColor = {
      bg: 'from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
      text: 'text-emerald-700'
    };

    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100/80 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{section.icon}</span>
          <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {section.subsections.map((subsection, idx) => {
            const cardClassName = 'bg-gradient-to-br ' + riskColor.bg + ' rounded-xl p-6 border ' + riskColor.border + ' hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300';
            const titleClassName = 'text-xl font-bold ' + riskColor.text + ' mb-3';
            return (
            <div
              key={idx}
              className={cardClassName}
            >
              {subsection.title && (
                <h3 className={titleClassName}>{subsection.title}</h3>
              )}
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                {subsection.content.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </div>
          );
          })}
        </div>
      </div>
    );
  };

  // Render Best Practice section - Clean three-section design
  const renderBestPracticeCard = (section: typeof sections[0]) => {
    if (!section.title.toLowerCase().includes('best practice') && !section.title.includes('最佳实践')) {
      return null;
    }

    const normalizeLine = (line: string) => line.replace(/^-\s*/, '').replace(/\*\*/g, '').trim();
    const findSubsection = (keywordZh: string, keywordEn: string) =>
      section.subsections.find((sub) => (sub.title || '').includes(keywordZh) || (sub.title || '').toLowerCase().includes(keywordEn));

    // Extract deployment version from first subsection title if available
    const deploymentVersion = (section.subsections[0]?.title || '')
      .replace(/^[0-9.]+\s*/, '')
      .trim() || (isChina ? '私部署（服务器版）' : 'Private Deployment (Server)');

    // Extract content by keywords from subsection content
    const extractContentByKeywords = (subsection: typeof section.subsections[0] | undefined, keywords: string[]) => {
      if (!subsection) return [];
      const keywordIndex = subsection.content.findIndex(c =>
        keywords.some(keyword => c.includes(keyword))
      );
      if (keywordIndex === -1) return [];

      const result: string[] = [];
      for (let i = keywordIndex + 1; i < subsection.content.length; i++) {
        const line = subsection.content[i].trim();
        if (line.startsWith('####') || line.startsWith('###')) break;
        if (line) result.push(subsection.content[i]);
      }
      return result;
    };

    const reasonSubsection = findSubsection('入选最佳实践理由', 'best practice') || findSubsection('理由', 'reason');
    const infoSubsection = findSubsection('版本信息', 'version') || findSubsection('版本基本信息', 'metadata');
    const detailsSubsection = findSubsection('实施详情', 'detail');

    const reasonContent = (reasonSubsection?.content || []).map(normalizeLine).filter(Boolean);
    const infoContent = (infoSubsection?.content || []).map(normalizeLine).filter(Boolean);
    const detailsContent = (detailsSubsection?.content || []).map(normalizeLine).filter(Boolean);
    const allSectionLines = section.subsections.flatMap((sub) => sub.content).map(normalizeLine).filter(Boolean);

    const isOutcomeLine = (line: string) => {
      if (!line || line.length < 3) return false;
      if (line.includes('http://') || line.includes('https://')) return false;
      const noiseKeywords = [
        '实践者信息', '原作者信息', '版本状态', '关联引用', '版本基本信息',
        '实施详情', '指标提升', '成本优化', '补充信息', '其他优势',
        'practitioner', 'version status', 'related references', 'implementation details'
      ];
      return !noiseKeywords.some((k) => line.toLowerCase().includes(k.toLowerCase()));
    };

    const fallbackReasonContent = section.subsections
      .filter((sub) => {
        const t = (sub.title || '').toLowerCase();
        return !t.includes('版本信息') && !t.includes('version') && !t.includes('实施详情') && !t.includes('detail');
      })
      .flatMap((sub) => sub.content)
      .map(normalizeLine)
      .filter(isOutcomeLine);

    const resolvedReasonContent = (reasonContent.filter(isOutcomeLine).length > 0
      ? reasonContent.filter(isOutcomeLine)
      : fallbackReasonContent);

    const outcomeSlots = ['yellow', 'violet', 'blue', 'emerald'] as const;
    const outcomes = resolvedReasonContent.slice(0, 4).map((item, idx) => {
      const [rawTitle, ...rest] = item.split(/[:：]/);
      return {
        title: (rawTitle || item).trim(),
        desc: (rest.join('：') || item).trim(),
        semanticColor: outcomeSlots[idx],
      };
    });

    // Semantic color mapping for outcomes - matching Framework page exactly
    const outcomeColorMap = {
      violet: { bg: 'from-violet-50 to-violet-100', border: 'border-violet-200', icon: 'bg-violet-500', text: 'text-violet-700' },
      yellow: { bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', icon: 'bg-yellow-500', text: 'text-yellow-700' },
      blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-blue-700' },
      emerald: { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', icon: 'bg-emerald-500', text: 'text-emerald-700' },
    };

    // Parse metadata
    const parseMetadata = (content: string[]) => {
      const metadata: { [key: string]: string } = {};
      content.forEach(c => {
        const match = c.match(/^([^:：]+)[:：]\s*(.+)$/);
        if (match) {
          const key = match[1].trim().toLowerCase();
          const value = match[2].trim();
          if (key.includes('称呼') || key.includes('实践者') || key.includes('practitioner')) metadata['practitioner'] = value;
          else if (key.includes('首发') || key.includes('first release')) metadata['firstReleased'] = value;
          else if (key.includes('最近更新') || key.includes('last update')) metadata['lastUpdated'] = value;
        }
      });
      return metadata;
    };

    const fallbackInfoContent = allSectionLines.filter((line) => {
      const lower = line.toLowerCase();
      return (
        lower.includes('称呼') ||
        lower.includes('实践者') ||
        lower.includes('practitioner') ||
        lower.includes('首发') ||
        lower.includes('first release') ||
        lower.includes('最近更新') ||
        lower.includes('last update') ||
        lower.includes('版本状态') ||
        lower.includes('version status') ||
        lower.includes('关联引用') ||
        lower.includes('related references') ||
        lower.includes('http://') ||
        lower.includes('https://')
      );
    });
    const resolvedInfoContent = infoContent.length > 0 ? infoContent : fallbackInfoContent;

    const metadata = parseMetadata(resolvedInfoContent);
    const practitioner = metadata['practitioner'] || 'Real-World AI';
    const firstReleased = metadata['firstReleased'] || '-';
    const lastUpdated = metadata['lastUpdated'] || '-';

    const dependencies = resolvedInfoContent
      .filter((line) => line.includes('http://') || line.includes('https://'))
      .map((line) => line.split(/[:：]/)[0].trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(' · ') || 'N/A';

    // Extract implementation link
    const implementationLink = (detailsContent.length > 0 ? detailsContent : allSectionLines).find(c => c.includes('http'));
    const linkMatch = implementationLink?.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const fallbackUrlMatch = implementationLink?.match(/https?:\/\/\S+/);
    const detailLink = linkMatch ? linkMatch[2] : (fallbackUrlMatch ? fallbackUrlMatch[0] : null);

    return (
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
        {/* Header - Standardized */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isChina ? '最佳实践版本' : 'Best Practice Version'}
            </h2>
          </div>
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <span className="text-sm font-semibold text-blue-900">{deploymentVersion}</span>
          </div>
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            {isChina
              ? '当前最成熟、性能最优的企业级方案。由 RWAI 团队自研并在多家企业真实场景中验证，兼顾效果、速度与成本。'
              : 'The most mature and high-performance enterprise solution. Developed and validated by RWAI team across real-world scenarios.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Why it's better (2 columns wide) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <h3 className="text-lg font-bold text-gray-900 px-4 whitespace-nowrap">
                {isChina ? '为什么它是目前最好的版本' : 'Why It\'s the Best Version'}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {outcomes.map((outcome, idx) => {
                const color = outcomeColorMap[outcome.semanticColor];
                const icons = ['⭐', '⚡', '💰', '✓'];

                return (
                  <div
                    key={idx}
                    className={'group bg-gradient-to-br ' + color.bg + ' rounded-xl p-5 border-2 ' + color.border + ' hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-default'}
                  >
                    <div className="flex items-start gap-3">
                      <div className={'flex h-8 w-8 items-center justify-center rounded-lg ' + color.icon + ' text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform'}>
                        <span className="text-base">{icons[idx]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={'text-base font-bold ' + color.text + ' mb-2'}>{outcome.title}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{outcome.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Practitioner & Version Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-5">
                {isChina ? '实践者 & 版本信息' : 'Practitioner & Version'}
              </h3>

              <div className="space-y-5">
                {/* Practitioner - Neutral gray */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">{isChina ? '实践者' : 'Practitioner'}</div>
                    <div className="text-sm font-bold text-gray-900">{practitioner}</div>
                  </div>
                </div>

                {/* Version Status - Purple for Time */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shadow-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">{isChina ? '版本状态' : 'Version'}</div>
                    <div className="text-sm text-gray-900">
                      {isChina ? '首发：' : 'First: '}{firstReleased}
                    </div>
                    <div className="text-sm text-gray-900">
                      {isChina ? '更新：' : 'Updated: '}{lastUpdated}
                    </div>
                  </div>
                </div>

                {/* Key Dependencies - Neutral gray */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 shadow-sm">
                    <Code className="h-5 w-5" />
                  </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-0.5">{isChina ? '关键依赖' : 'Dependencies'}</div>
                    <div className="text-sm text-gray-900">{dependencies}</div>
                  </div>
                </div>
              </div>

              {/* External Link */}
              {detailLink && (
                <a
                  href={detailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {isChina ? '外部文档' : 'External Docs'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA - View Implementation Details */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setActiveTab('implementation');
              // Scroll to top of page
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02]"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isChina ? '查看完整实践细节' : 'View Full Implementation Details'}
            </span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  // Render standard section card - Remove numbering from titles
  const renderStandardCard = (section: typeof sections[0]) => {
    // Remove numbering from title (e.g., "1. 业务亮点" -> "业务亮点", "2. 基本信息" -> "基本信息")
    const cleanTitle = section.title.replace(/^\d+\.\s*/, '');

    // Remove numbering from subsection titles (e.g., "2.1 概况" -> "概况")
    const cleanSubtitle = (title: string) => title.replace(/^\d+\.\d*\.\s*/, '');

    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{section.icon}</span>
          <h2 className="text-3xl font-bold text-gray-900">{cleanTitle}</h2>
        </div>

        <div className="space-y-5">
          {section.subsections.map((subsection, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              {subsection.title && (
                <h3 className="text-xl font-bold text-gray-900 mb-3">{cleanSubtitle(subsection.title)}</h3>
              )}
              <div className="space-y-2">
                {subsection.content.filter((c) => c && !c.startsWith('####')).map((item, i) => {
                  if (item.startsWith('-')) {
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 flex-shrink-0 mt-0.5">•</span>
                        <span>{item.replace(/^-\s+/, '').replace(/\*\*/g, '')}</span>
                      </div>
                    );
                  }
                  if (item.startsWith('**') && item.endsWith('**')) {
                    return (
                      <p key={i} className="text-base font-semibold text-gray-900">
                        {item.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Basic Information section - 4 compact visual blocks
  const renderBasicInfoCard = (section: typeof sections[0]) => {
    if (!section.title.toLowerCase().includes('basic information') && !section.title.includes('基本信息')) {
      return null;
    }

    // Extract subsections
    const getSubsection = (keyword: string) => {
      return section.subsections.find(sub => sub.title?.includes(keyword));
    };

    const overview = getSubsection('概况');
    const tags = getSubsection('分类标签');
    const impl = getSubsection('实施周期');
    const team = getSubsection('团队构成');
    const painPoints = getSubsection('业务痛点');
    const coreFunctions = getSubsection('核心功能');

    // Parse content items
    const parseBulletPoints = (content: string[]) => {
      return content.filter(c => c.startsWith('-')).map(c => c.replace(/^-\s+/, '').replace(/\*\*/g, ''));
    };

    // Extract overview text
    const extractOverviewText = (content: string[]) => {
      const businessBg = content.find(c => c.includes('业务背景'));
      const solution = content.find(c => c.includes('解决方案'));
      return { businessBg: businessBg?.replace(/\*\*业务背景\*\*:?\s*/, '') || '', solution: solution?.replace(/\*\*解决方案\*\*:?\s*/, '') || '' };
    };

    const overviewText = overview ? extractOverviewText(overview.content) : { businessBg: '', solution: '' };

    // Parse tags
    const parseTags = (content: string[]) => {
      const tags: { label: string; items: string[] }[] = [];
      content.forEach(c => {
        const match = c.match(/\*\*([^*]+)\*\*:\s*(.+)/);
        if (match) {
          tags.push({ label: match[1], items: match[2].split(/[，,]/).map(t => t.trim()).filter(t => t) });
        }
      });
      return tags;
    };

    const tagList = tags ? parseTags(tags.content) : [];

    // Parse implementation timeline
    const implItems = impl ? parseBulletPoints(impl.content) : [];

    // Parse team
    const teamItems = team ? parseBulletPoints(team.content) : [];

    // Parse pain points and solutions, then merge by solution
    const painPointItems = painPoints ? parseBulletPoints(painPoints.content) : [];
    const solutionItems = coreFunctions ? parseBulletPoints(coreFunctions.content) : [];

    // Create problem-solution pairs, merging problems with the same solution
    const problemSolutionPairs: { pains: string[]; solution: string }[] = [];

    // Map each pain point to its solution (simple round-robin for now)
    painPointItems.forEach((pain, idx) => {
      const solutionIndex = Math.min(idx, solutionItems.length - 1);
      const solution = solutionItems[solutionIndex];

      // Check if we already have this solution
      const existingPair = problemSolutionPairs.find(p => p.solution === solution);

      if (existingPair) {
        existingPair.pains.push(pain);
      } else {
        problemSolutionPairs.push({ pains: [pain], solution });
      }
    });

    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{section.title.replace(/^\d+\.\s*/, '')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Block 1: Overview - Neutral gray */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <Lightbulb className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{isChina ? '概述' : 'Overview'}</h3>
            </div>
            {overviewText.businessBg && (
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{overviewText.businessBg}</p>
            )}
            {overviewText.solution && (
              <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                <Sparkles className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{overviewText.solution}</p>
              </div>
            )}
          </div>

          {/* Block 2: Classification Tags - Neutral gray */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <Tag className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{isChina ? '分类标签' : 'Classification'}</h3>
            </div>
            <div className="space-y-3">
              {tagList.map((tag, idx) => (
                <div key={idx} className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-500 bg-slate-100 px-2 py-1 rounded">{tag.label}</span>
                  {tag.items.map((item, i) => (
                    <span key={i} className="text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: Implementation - Violet for Speed/Efficiency */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                <Clock className="h-4 w-4 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{isChina ? '实施' : 'Implementation'}</h3>
            </div>
            <div className="space-y-3">
              {implItems.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">{isChina ? '周期' : 'Timeline'}</div>
                  {implItems.map((item, idx) => (
                    <div key={idx} className="text-sm text-violet-900 font-medium">{item}</div>
                  ))}
                </div>
              )}
              {teamItems.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1.5">{isChina ? '团队' : 'Team'}</div>
                  {teamItems.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-800 font-medium">{item}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Block 4: Pain → Solution - Emerald for Safety/Risk */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{isChina ? '问题 → 解决方案' : 'Problem → Solution'}</h3>
            </div>
            <div className="space-y-3">
              {problemSolutionPairs.map((pair, pairIdx) => {
                return (
                  <div key={pairIdx} className="flex items-start gap-2">
                    <div className="flex flex-col items-center">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold mt-0.5">
                        {pairIdx + 1}
                      </div>
                      {pairIdx < problemSolutionPairs.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Render one or more pain points */}
                      {pair.pains.map((pain, painIdx) => {
                        const painMatch = pain.match(/^(.+?)[:：]/);
                        const painTitle = painMatch ? painMatch[1] : pain;
                        const painDesc = painMatch ? pain.replace(/^.+?[:：]\s*/, '') : '';

                        return (
                          <div key={painIdx} className={painIdx > 0 ? 'mt-2' : ''}>
                            <div className="text-xs font-semibold text-emerald-700 mb-0.5">{painTitle}</div>
                            <div className="text-xs text-gray-600 mb-1.5 leading-snug">{painDesc}</div>
                          </div>
                        );
                      })}
                      {/* Solution (rendered once for all merged pains) */}
                      {pair.solution && (
                        <div className="flex items-start gap-1.5 p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded border border-emerald-200 mt-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-emerald-800 leading-snug">{pair.solution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const titleLower = section.title.toLowerCase();

        // Business Highlights - keep original UI style but bind current arena data
        if (titleLower.includes('business highlights') || section.title.includes('业务亮点')) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {renderBusinessHighlightsCard(section)}
            </motion.div>
          );
        }

        // Basic Information - New compact 4-block rendering
        if (titleLower.includes('basic information') || section.title.includes('基本信息')) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {renderBasicInfoCard(section)}
            </motion.div>
          );
        }

        // Best Practice - keep original UI style but bind current arena data
        if (titleLower.includes('best practice') || section.title.includes('最佳实践')) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {renderBestPracticeCard(section)}
            </motion.div>
          );
        }

        // Demo - Skip demo section (already shown in Hero)
        if (titleLower.includes('demo') || section.title.includes('演示')) {
          return null;
        }

        // Key Metrics - Skip (moved to Basic Info)
        if (titleLower.includes('key metrics') || section.title.includes('核心指标')) {
          return null;
        }

        // Pain Points - Skip (merged into Basic Info)
        if (titleLower.includes('pain points') || section.title.includes('痛点')) {
          return null;
        }

        // Standard rendering for other sections
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {renderStandardCard(section)}
          </motion.div>
        );
      })}
    </div>
  );
}

// Implementation Section Component - Phase-based card design
function ImplementationSection({ content, locale }: { content: string; locale: string }) {
  const isChina = locale === 'zh';

  // Icon mapping for phases
  const getPhaseIcon = (phaseNum: number): string => {
    const icons = ['🎯', '📋', '⚙️', '🚀'];
    return icons[phaseNum - 1] || '📌';
  };

  // Get subsection icon
  const getSubsectionIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('team') || lowerTitle.includes('团队')) return '👥';
    if (lowerTitle.includes('content') || lowerTitle.includes('内容')) return '📝';
    if (lowerTitle.includes('resource') || lowerTitle.includes('资源')) return '🔗';
    if (lowerTitle.includes('deliverable') || lowerTitle.includes('产出') || lowerTitle.includes('结果')) return '📦';
    if (lowerTitle.includes('cycle') || lowerTitle.includes('周期')) return '⏱️';
    if (lowerTitle.includes('step') || lowerTitle.includes('步骤')) return '🔄';
    return '📄';
  };

  // Parse implementation content into phases
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const phases: {
      number: number;
      title: string;
      icon: string;
      subsections: Array<{
        title: string;
        icon: string;
        content: string[];
      }>;
    }[] = [];

    let currentPhase: typeof phases[0] | null = null;
    let currentSubsection: typeof phases[0]['subsections'][0] | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines and separators
      if (!line || line === '---') continue;

      // Detect phase headers (__PHASE X__)
      const phaseMatch = line.match(/^__PHASE\s+(\d+)\s+(.+)__$/);
      if (phaseMatch) {
        if (currentPhase) {
          if (currentSubsection) {
            currentPhase.subsections.push(currentSubsection);
          }
          phases.push(currentPhase);
        }
        const phaseNum = parseInt(phaseMatch[1]);
        currentPhase = {
          number: phaseNum,
          title: phaseMatch[2].trim(),
          icon: getPhaseIcon(phaseNum),
          subsections: []
        };
        currentSubsection = null;
        continue;
      }

      // Detect subsection headers (__Title__)
      const subsectionMatch = line.match(/^__(.+)__$/);
      if (subsectionMatch && currentPhase) {
        if (currentSubsection) {
          currentPhase.subsections.push(currentSubsection);
        }
        const title = subsectionMatch[1].trim();
        currentSubsection = {
          title,
          icon: getSubsectionIcon(title),
          content: []
        };
        continue;
      }

      // Add content to current subsection
      if (currentPhase && currentSubsection && line) {
        currentSubsection.content.push(line);
      }
    }

    // Push last phase and subsection
    if (currentPhase) {
      if (currentSubsection) {
        currentPhase.subsections.push(currentSubsection);
      }
      phases.push(currentPhase);
    }

    return phases;
  };

  const phases = parseContent(content);

  // Render phase card
  const renderPhaseCard = (phase: typeof phases[0], idx: number) => {
    const isEven = idx % 2 === 0;

    return (
      <div
        key={idx}
        className="bg-white rounded-2xl p-8 border border-gray-100/80 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
      >
        {/* Phase Header - Standardized */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white text-xl font-bold shadow-lg">
            {phase.number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{phase.icon}</span>
              <h2 className="text-3xl font-bold text-gray-900">{phase.title}</h2>
            </div>
          </div>
        </div>

        {/* Phase Subsections */}
        <div className="space-y-6">
          {phase.subsections.map((subsection, subIdx) => {
            // Use consistent violet for implementation (speed/efficiency)
            const bgColor = 'from-violet-50 to-violet-100';

            return (
              <div
                key={subIdx}
                className={'bg-gradient-to-br ' + bgColor + ' rounded-xl p-6 border border-violet-200 hover:shadow-md hover:shadow-violet-500/10 transition-all'}
              >
                {/* Subsection Header - Standardized */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{subsection.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{subsection.title}</h3>
                </div>

                {/* Subsection Content */}
                <div className="space-y-3">
                  {subsection.content.map((item, itemIdx) => {
                    // List items
                    if (item.match(/^\d+\./) || item.startsWith('-')) {
                      return (
                        <div key={itemIdx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-violet-600 flex-shrink-0 mt-1">
                            {item.match(/^\d+\./) ? '➢' : '•'}
                          </span>
                          <span className="leading-relaxed">{item.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').replace(/\*\*/g, '')}</span>
                        </div>
                      );
                    }

                    // Links
                    if (item.includes('[') && item.includes(']')) {
                      const linkMatch = item.match(/\[([^\]]+)\]\(([^)]+)\)/);
                      if (linkMatch) {
                        return (
                          <a
                            key={itemIdx}
                            href={linkMatch[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <span>🔗</span>
                            {linkMatch[1]}
                          </a>
                        );
                      }
                    }

                    // Regular text
                    if (item && !item.startsWith('__')) {
                      return (
                        <p key={itemIdx} className="text-gray-700 leading-relaxed">
                          {item.replace(/\*\*/g, '')}
                        </p>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {phases.map((phase, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          {renderPhaseCard(phase, idx)}
        </motion.div>
      ))}
    </div>
  );
}

// TechConfigurationSection Component - Step-based card design for technical configuration
function TechConfigurationSection({ content, locale }: { content: string; locale: string }) {
  const isChina = locale === 'zh';

  // Icon mapping for steps
  const getStepIcon = (stepNum: number): string => {
    const icons = ['🔧', '⚙️', '🔌', '🌐', '📡', '🤖'];
    return icons[stepNum - 1] || '📋';
  };

  // Get subsection icon
  const getSubsectionIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('step name') || lowerTitle.includes('步骤名称')) return '📌';
    if (lowerTitle.includes('step definition') || lowerTitle.includes('步骤定义')) return '📝';
    if (lowerTitle.includes('participants') || lowerTitle.includes('参与人员')) return '👥';
    if (lowerTitle.includes('step input') || lowerTitle.includes('本步输入')) return '📥';
    if (lowerTitle.includes('step output') || lowerTitle.includes('本步产出')) return '📤';
    if (lowerTitle.includes('estimated time') || lowerTitle.includes('预估时间')) return '⏱️';
    return '📄';
  };

  // Parse technical configuration content into steps
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const steps: {
      number: number;
      title: string;
      icon: string;
      subsections: Array<{
        title: string;
        icon: string;
        content: string[];
      }>;
    }[] = [];

    let currentStep: typeof steps[0] | null = null;
    let currentSubsection: typeof steps[0]['subsections'][0] | null = null;
    let inContentSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip language markers and main title
      if (line.startsWith('####') || line.startsWith('# ')) {
        inContentSection = true;
        continue;
      }

      // Skip content before first step marker
      if (!inContentSection) continue;

      // Detect step headers (both English and Chinese)
      const isStepNumber = line === '__Step Number__' || line === '__步骤序号__';
      const isStepName = line === '__Step Name__' || line === '__步骤名称__';

      if (isStepNumber) {
        // Save previous step
        if (currentStep) {
          if (currentSubsection) {
            currentStep.subsections.push(currentSubsection);
          }
          steps.push(currentStep);
        }

        // Find the step number (skip blank lines)
        let stepNum = 1;
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('__')) {
            stepNum = parseInt(nextLine) || 1;
            break;
          }
        }

        // Find the step name (skip to __Step Name__)
        let stepName = '';
        for (let j = i + 1; j < lines.length; j++) {
          const checkLine = lines[j].trim();
          if (checkLine === '__Step Name__' || checkLine === '__步骤名称__') {
            // Get the next non-empty line as the name
            for (let k = j + 1; k < lines.length; k++) {
              const nameLine = lines[k].trim();
              if (nameLine && !nameLine.startsWith('__')) {
                stepName = nameLine;
                break;
              }
            }
            break;
          }
        }

        currentStep = {
          number: stepNum,
          title: stepName || 'Step ' + stepNum,
          icon: getStepIcon(stepNum),
          subsections: []
        };
        currentSubsection = null;
        continue;
      }

      // Detect subsection headers (__Title__)
      const subsectionMatch = line.match(/^__(.+)__$/);
      if (subsectionMatch && currentStep) {
        const title = subsectionMatch[1].trim();

        // Skip Step Number and Step Name headers (both languages)
        if (title === 'Step Number' || title === '步骤序号' ||
            title === 'Step Name' || title === '步骤名称') {
          continue;
        }

        // Save previous subsection
        if (currentSubsection) {
          currentStep.subsections.push(currentSubsection);
        }

        currentSubsection = {
          title,
          icon: getSubsectionIcon(title),
          content: []
        };
        continue;
      }

      // Add content to current subsection
      if (currentStep && currentSubsection && line && !line.startsWith('__')) {
        currentSubsection.content.push(lines[i]); // Use original line, not trimmed
      }
    }

    // Push last step and subsection
    if (currentStep) {
      if (currentSubsection) {
        currentStep.subsections.push(currentSubsection);
      }
      steps.push(currentStep);
    }

    return steps;
  };

  const steps = parseContent(content);

  // Render step card
  const renderStepCard = (step: typeof steps[0], idx: number) => {
    return (
      <div
        key={idx}
        className="bg-white rounded-2xl p-8 border border-gray-100/80 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
      >
        {/* Step Header - Standardized */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-100 to-cyan-100">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white text-xl font-bold shadow-lg">
            {step.number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{step.icon}</span>
              <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
            </div>
          </div>
        </div>

        {/* Step Subsections */}
        <div className="space-y-6">
          {step.subsections.map((subsection, subIdx) => {
            // Use consistent slate-gray for tech configuration (neutral/technical)
            const bgColor = 'from-slate-50 to-gray-100';

            return (
              <div
                key={subIdx}
                className={'bg-gradient-to-br ' + bgColor + ' rounded-xl p-6 border border-gray-200 hover:shadow-md hover:shadow-gray-500/10 transition-all'}
              >
                {/* Subsection Header - Standardized */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{subsection.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{subsection.title}</h3>
                </div>

                {/* Subsection Content */}
                <div className="space-y-4 text-gray-700">
                  {(() => {
                    // Group content into blocks (code blocks, lists, paragraphs)
                    const blocks: Array<{type: 'code' | 'list' | 'link' | 'text', content: string[]}> = [];
                    let currentBlock: typeof blocks[0] | null = null;
                    let inCodeBlock = false;
                    let codeLang = '';

                    for (let i = 0; i < subsection.content.length; i++) {
                      const line = subsection.content[i];
                      const trimmed = line.trim();

                      // Handle code blocks
                      if (trimmed.startsWith('```')) {
                        if (inCodeBlock) {
                          // End code block
                          if (currentBlock) {
                            blocks.push(currentBlock);
                          }
                          currentBlock = null;
                          inCodeBlock = false;
                        } else {
                          // Start code block
                          if (currentBlock) {
                            blocks.push(currentBlock);
                          }
                          codeLang = trimmed.replace(/```\s*/, '');
                          currentBlock = { type: 'code', content: [] };
                          inCodeBlock = true;
                        }
                        continue;
                      }

                      if (inCodeBlock && currentBlock) {
                        currentBlock.content.push(line);
                        continue;
                      }

                      // Handle empty lines
                      if (!trimmed) {
                        if (currentBlock && currentBlock.type !== 'code') {
                          blocks.push(currentBlock);
                          currentBlock = null;
                        }
                        continue;
                      }

                      // Determine content type
                      const isListItem = trimmed.match(/^\d+\./) || trimmed.startsWith('-');
                      const isLink = trimmed.includes('[') && trimmed.includes('](');

                      if (isListItem) {
                        if (currentBlock && currentBlock.type !== 'list') {
                          blocks.push(currentBlock);
                          currentBlock = null;
                        }
                        if (!currentBlock) {
                          currentBlock = { type: 'list', content: [] };
                        }
                        currentBlock.content.push(trimmed);
                      } else if (isLink) {
                        if (currentBlock) {
                          blocks.push(currentBlock);
                        }
                        currentBlock = { type: 'link', content: [trimmed] };
                        blocks.push(currentBlock);
                        currentBlock = null;
                      } else {
                        if (currentBlock && currentBlock.type === 'list') {
                          blocks.push(currentBlock);
                          currentBlock = null;
                        }
                        if (!currentBlock) {
                          currentBlock = { type: 'text', content: [] };
                        }
                        currentBlock.content.push(trimmed);
                      }
                    }

                    // Push last block
                    if (currentBlock) {
                      blocks.push(currentBlock);
                    }

                    // Render blocks
                    return blocks.map((block, blockIdx) => {
                      if (block.type === 'code') {
                        return (
                          <div key={blockIdx} className="my-4">
                            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap">
                                {block.content.join('\n')}
                              </pre>
                            </div>
                          </div>
                        );
                      }

                      if (block.type === 'list') {
                        return (
                          <div key={blockIdx} className="space-y-2">
                            {block.content.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-start gap-3">
                                <span className="text-gray-600 flex-shrink-0 mt-1">
                                  {item.match(/^\d+\./) ? '➢' : '•'}
                                </span>
                                <span className="leading-relaxed flex-1">
                                  {item.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '')}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (block.type === 'link') {
                        const linkMatch = block.content[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
                        if (linkMatch) {
                          return (
                            <a
                              key={blockIdx}
                              href={linkMatch[2]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <span>🔗</span>
                              {linkMatch[1]}
                            </a>
                          );
                        }
                        return null;
                      }

                      if (block.type === 'text') {
                        return (
                          <p key={blockIdx} className="leading-relaxed">
                            {block.content.join(' ')}
                          </p>
                        );
                      }

                      return null;
                    });
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {steps.length > 0 ? (
        steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {renderStepCard(step, idx)}
          </motion.div>
        ))
      ) : (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-500">
          {isChina ? '暂无技术配置内容' : 'No technical configuration content yet'}
        </div>
      )}
    </div>
  );
}
