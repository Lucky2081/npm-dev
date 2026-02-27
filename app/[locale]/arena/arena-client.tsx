'use client';

import React, { use } from 'react';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { categories, industries } from '@/lib/data';
import type { Arena } from '@/lib/types';
import { Shield, Trophy, Filter, ArrowUpDown, ArrowUp, ArrowDown, Code2, Search, Check, Zap, Star, DollarSign } from 'lucide-react';

type SortField = 'name' | 'status' | 'category' | 'industry' | 'speed' | 'quality' | 'security' | 'cost';
type SortOrder = 'asc' | 'desc';

// Metric value translations (Chinese to English)
const metricValueTranslations: Record<string, string> = {
  '很快': 'Very Fast',
  '较快': 'Relatively Fast',
  '中等': 'Medium',
  '较慢': 'Relatively Slow',
  '很高': 'Very High',
  '较高': 'Relatively High',
  '较低': 'Relatively Low',
  '较优': 'Optimal',
};

// Speed to time mapping (English only - Chinese uses original data values)
const speedToTimeMappingEn: Record<string, string> = {
  '很快': '1-2 days',
  '较快': '1 week',
  '中等': '2 weeks',
  '较慢': '1 month',
  // Direct mappings from data
  '一周': '1 week',
  '1~2天': '1-2 days',
  '1-2天': '1-2 days',
  '2~3天': '2-3 days',
  '两周': '2 weeks',
  '一月': '1 month',
  '半天': 'Half day',
};

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

// Translate metric value to English
function translateMetricValue(value: string, isChina: boolean): string {
  if (isChina) return value;
  return metricValueTranslations[value] || value;
}

// Translate speed to time display
function translateSpeedToTime(value: string, isChina: boolean): string {
  if (isChina) return value; // Chinese uses original data values
  return speedToTimeMappingEn[value] || value;
}

// Extract time from highlights/description
function extractTimeFromDescription(description: string): string {
  // Match patterns and normalize time display
  // IMPORTANT: More specific patterns must come before general ones
  const timePatterns: [RegExp, string][] = [
    [/(\d+[-~]\d+[天小时分钟]+)/, '$1'], // Keep ranges like "1-2天"
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
    [/(两天)(?!半)/, '2天'], // Negative lookahead to avoid matching "两天半"
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

  // If no time found in description, fall back to metrics
  return '';
}

// Convert metric value to stars
function getStarRating(value: string): number {
  return metricToStars[value] || 2;
}

// Clean up arena title - remove time prefixes and focus on deliverable outcome
function cleanArenaTitle(title: string): string {
  let cleanedTitle = title;

  // Remove time prefixes - more comprehensive
  const timePrefixes = [
    /^一周搭建/, /^两周搭建/, /^三天搭建/, /^四天搭建/, /^五天搭建/, /^六天搭建/, /^七天搭建/,
    /^一天搭建/, /^两天搭建/, /^三天搭建/, /^四天搭建/, /^五天搭建/, /^六天搭建/, /^七天搭建/, /^八天搭建/, /^九天搭建/, /^十天搭建/,
    /^一天构建/, /^两天构建/, /^三天构建/, /^四天构建/, /^五天构建/, /^六天构建/, /^七天构建/,
    /^两天半搭建/, /^三天半搭建/, /^四天半搭建/, /^五天半搭建/,
    /^半天搭建/,
    /^快速搭建/, /^高效搭建/,
    /^\d+天搭建/, /^\d+小时搭建/, /^\d+天构建/, /^\d+小时构建/,
    /^一周内/, /^两天内/, /^三天内/, /^四天内/, /^五天内/, /^六天内/, /^七天内/, /^一天内/, /^半天内/,
    /快速搭建/, /高效搭建/, /极速搭建/,
    /快速构建/, /高效构建/, /极速构建/,
    /快速/, /高效/, /极速/,
    // Remove patterns like "一天XXX一个", "两天XXX一个" etc.
    /一天.+?一个/g, /两天.+?一个/g, /三天.+?一个/g, /四天.+?一个/g, /五天.+?一个/g, /六天.+?一个/g, /七天.+?一个/g,
    /一周.+?一个/g, /两周.+?一个/g,
    /两天半.+?一个/g,
  ];

  for (const prefix of timePrefixes) {
    cleanedTitle = cleanedTitle.replace(prefix, '');
  }

  // Remove domain descriptions (keep core functionality)
  const domainPatterns = [
    /企业级/g,
    /智能/g,
    /AI/g,
    /人工智能/g,
    /大模型/g,
    /基于.*?的/g,
    /领域/g,
    /系统/g,
    /平台/g,
    /框架/g,
  ];

  for (const pattern of domainPatterns) {
    cleanedTitle = cleanedTitle.replace(pattern, '');
  }

  // Remove "demo" or "Demo" suffix
  cleanedTitle = cleanedTitle.replace(/demo$/i, '').trim();

  // Clean up extra spaces
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();

  return cleanedTitle;
}

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

interface ArenaClientProps {
  params: Promise<{ locale: string }>;
  pageTitle: string;
  pageSubtitle: string;
  arenas: Arena[];
}

export default function ArenaClient({ params, pageTitle, pageSubtitle, arenas }: ArenaClientProps) {
  const { locale } = use(params);
  const searchParams = useSearchParams();
  const t = useTranslations('arena');
  const isChina = locale === 'zh';

  // Initialize state from URL query parameters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('status'); // Default sort by verification status
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); // Ascending (in-verification first, verified last)
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search state

  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Read URL query parameters and update filters
  React.useEffect(() => {
    const industryParam = searchParams.get('industry');
    const categoryParam = searchParams.get('category');

    if (industryParam) {
      // Convert industry key to Chinese name for internal state
      const industryObj = industries[industryParam as keyof typeof industries];
      if (industryObj) {
        setSelectedIndustries([industryObj.zh]);
      }
    }
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  const filteredArenas = useMemo(() => {
    let filtered = arenas;

    // Search filter - fuzzy search by title, highlights, industry, or category
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      // Split query into individual terms for fuzzy matching
      const queryTerms = query.split(/[\s,，、]+/).filter(term => term.length > 0);

      filtered = filtered.filter(arena => {
        const title = (arena.title[locale as keyof typeof arena.title] || arena.title.zh).toLowerCase();
        const highlights = (isChina ? arena.highlights : arena.highlightsEn).toLowerCase();
        const industry = (isChina ? arena.industry : arena.industryEn).toLowerCase();
        const category = (isChina ? arena.category : arena.categoryEn).toLowerCase();

        // Check if ANY query term matches ANY field (fuzzy OR logic)
        return queryTerms.some(term =>
          title.includes(term) ||
          highlights.includes(term) ||
          industry.includes(term) ||
          category.includes(term)
        );
      });
    }

    // Filter by industry (multi-select - OR logic)
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(arena => {
        // Check if arena matches ANY of the selected industries
        return selectedIndustries.some(selectedIndustry => {
          const industryKey = Object.keys(industries).find(key =>
            industries[key as keyof typeof industries].zh === selectedIndustry ||
            industries[key as keyof typeof industries].en === selectedIndustry
          );
          if (industryKey) {
            const targetIndustry = industries[industryKey as keyof typeof industries].zh;
            const arenaIndustries = arena.industry.split(',').map(s => s.trim());
            return arenaIndustries.some(ai => ai.includes(targetIndustry) || targetIndustry.includes(ai)) || arena.industry.includes('通用');
          }
          return false;
        });
      });
    }

    // Filter by category (multi-select - OR logic)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(arena => {
        // Check if arena matches ANY of the selected categories
        return selectedCategories.some(selectedCategory => {
          const categoryKey = Object.keys(categories).find(key =>
            categories[key as keyof typeof categories].zh === selectedCategory ||
            categories[key as keyof typeof categories].en === selectedCategory
          );
          if (categoryKey) {
            const targetCategory = categories[categoryKey as keyof typeof categories].zh;
            const arenaCategories = arena.category.split(',').map(s => s.trim());
            // Check if targetCategory is contained in any of the arena's categories
            return arenaCategories.some(ac => ac.includes(targetCategory) || targetCategory.includes(ac)) || arena.category.includes('通用');
          }
          return false;
        });
      });
    }

    // Metric sort order (higher is better)
    const metricOrder: Record<string, number> = {
      '很慢': 0, '较低': 0,
      '中等': 1,
      '较快': 2, '较高': 2,
      '很快': 3, '很高': 3,
      '较优': 3,
    };

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          const titleA = a.title[locale as keyof typeof a.title] || a.title.zh;
          const titleB = b.title[locale as keyof typeof b.title] || b.title.zh;
          comparison = titleA.localeCompare(titleB);
          break;
        case 'status':
          comparison = (a.verificationStatus === '已验证' ? 1 : 0) - (b.verificationStatus === '已验证' ? 1 : 0);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'industry':
          comparison = a.industry.localeCompare(b.industry);
          break;
        case 'speed':
          comparison = (metricOrder[a.metrics.speed] || 1) - (metricOrder[b.metrics.speed] || 1);
          break;
        case 'quality':
          comparison = (metricOrder[a.metrics.quality] || 1) - (metricOrder[b.metrics.quality] || 1);
          break;
        case 'security':
          comparison = (metricOrder[a.metrics.security] || 1) - (metricOrder[b.metrics.security] || 1);
          break;
        case 'cost':
          comparison = (metricOrder[a.metrics.cost] || 1) - (metricOrder[b.metrics.cost] || 1);
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [searchQuery, selectedIndustries, selectedCategories, sortBy, sortOrder, locale, isChina]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  // Calculate stats
  const stats = {
    total: arenas.length,
    verified: arenas.filter(a => a.verificationStatus === '已验证').length,
    inVerification: arenas.filter(a => a.verificationStatus === '验证中').length,
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 border-b border-gray-200">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            {/* Left - Title and Subtitle */}
            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                {pageTitle}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400 font-normal max-w-2xl">
                {pageSubtitle}
              </p>
            </div>

            {/* Right - Search Box */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isChina ? '搜索您的业务场景...' : 'Search your business scenario...'}
                  className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {isChina ? '例如：财务报表、文档审核、客户服务...' : 'e.g. Financial reports, Document review, Customer service...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left Sidebar - Filters */}
            <aside className="lg:w-56 flex-shrink-0">
              <div className="sticky top-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {isChina ? '按行业筛选' : 'Filter by Industry'}
                </h3>
                <div className="space-y-1 mb-6">
                  <button
                    onClick={() => setSelectedIndustries([])}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedIndustries.length === 0
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                      selectedIndustries.length === 0 ? 'bg-white border-white' : 'border-gray-300'
                    }`}>
                      {selectedIndustries.length === 0 && <Check className="h-3 w-3 text-gray-900" />}
                    </div>
                    {isChina ? '全部行业' : 'All Industries'}
                  </button>
                  {Object.entries(industries).map(([key, industry]) => {
                    const Icon = industry.icon;
                    const isSelected = selectedIndustries.includes(industry.zh);
                    const count = arenas.filter(a => {
                      const arenaIndustries = a.industry.split(',').map(s => s.trim());
                      return arenaIndustries.some(ai => ai.includes(industry.zh) || industry.zh.includes(ai)) || a.industry.includes('通用');
                    }).length;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleIndustry(industry.zh)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1">{isChina ? industry.zh : industry.en}</span>
                        <span className={`text-xs ${isSelected ? 'text-blue-600' : 'opacity-50'}`}>({count})</span>
                      </button>
                    );
                  })}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {isChina ? '按类别筛选' : 'Filter by Category'}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategories([])}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedCategories.length === 0
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                      selectedCategories.length === 0 ? 'bg-white border-white' : 'border-gray-300'
                    }`}>
                      {selectedCategories.length === 0 && <Check className="h-3 w-3 text-gray-900" />}
                    </div>
                    {isChina ? '全部类别' : 'All Categories'}
                  </button>
                  {Object.entries(categories).map(([key, category]) => {
                    const isSelected = selectedCategories.includes(category.zh);
                    const count = arenas.filter(a => {
                      const arenaCategories = a.category.split(',').map(s => s.trim());
                      return arenaCategories.some(ac => ac.includes(category.zh) || category.zh.includes(ac)) || a.category.includes('通用');
                    }).length;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleCategory(category.zh)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="flex-1">{isChina ? category.zh : category.en}</span>
                        <span className={`text-xs ${isSelected ? 'text-blue-600' : 'opacity-50'}`}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Sort Controls */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">
                    {isChina ? '排序方式：' : 'Sort by:'}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { field: 'name' as SortField, label: isChina ? '名称' : 'Name', icon: null },
                      { field: 'status' as SortField, label: isChina ? '验证状态' : 'Status', icon: null },
                      { field: 'speed' as SortField, label: isChina ? '速度' : 'Speed', icon: Zap, color: 'text-violet-500' },
                      { field: 'quality' as SortField, label: isChina ? '质量' : 'Quality', icon: Star, color: 'text-yellow-500' },
                      { field: 'security' as SortField, label: isChina ? '安全' : 'Security', icon: Shield, color: 'text-emerald-500' },
                      { field: 'cost' as SortField, label: isChina ? '成本' : 'Cost', icon: DollarSign, color: 'text-blue-500' },
                    ].map((sortOption) => {
                      const Icon = sortOption.icon;
                      return (
                        <button
                          key={sortOption.field}
                          onClick={() => handleSort(sortOption.field)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            sortBy === sortOption.field
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {Icon && <Icon className={`h-3.5 w-3.5 ${sortOption.color}`} />}
                          <span>{sortOption.label}</span>
                          {getSortIcon(sortOption.field)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Arena Cards - IMPROVED VERSION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredArenas.length === 0 ? (
                  <div className="text-center py-16 col-span-full">
                    <Code2 className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
                      {isChina ? '暂无此组合的方案' : 'No Solutions Found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {isChina ? '该行业与类别的组合正在开发中' : 'This combination is coming soon'}
                    </p>
                    <Button
                      onClick={() => { setSelectedIndustries([]); setSelectedCategories([]); }}
                      variant="secondary"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {isChina ? '清除筛选' : 'Clear Filters'}
                    </Button>
                  </div>
                ) : (
                  filteredArenas.map((arena) => (
                    <Link
                      key={arena.id}
                      href={`/${locale}/arena/${arena.folderId}`}
                      className="group block"
                    >
                      {/* IMPROVED CARD DESIGN */}
                      <div className="relative h-[420px] bg-white rounded-2xl p-7 overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-100/80 hover:border-blue-200">
                        {/* Card Content */}
                        <div className="relative flex flex-col h-full">
                          {/* Top Section: Title + Status */}
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-2 flex-1">
                                {cleanArenaTitle(arena.title[locale as keyof typeof arena.title] || arena.title.zh)}
                              </h3>
                              <div className="flex-shrink-0">
                                {arena.verificationStatus === '已验证' ? (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200 shadow-sm whitespace-nowrap">
                                    <Trophy className="h-3.5 w-3.5" />
                                    <span>{isChina ? '已验证' : 'Verified'}</span>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border border-slate-200 shadow-sm whitespace-nowrap">
                                    <Shield className="h-3.5 w-3.5" />
                                    <span>{isChina ? '验证中' : 'Testing'}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Industry & Category Tags */}
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2.5 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/60 truncate max-w-[140px]">
                                {isChina ? arena.industry : arena.industryEn}
                              </span>
                              <span className="inline-block px-2.5 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200/60 truncate max-w-[140px]">
                                {isChina ? arena.category : arena.categoryEn}
                              </span>
                            </div>
                          </div>

                          {/* Metrics Section - Visual Design */}
                          <div className="mb-4">
                            <div className="grid grid-cols-4 gap-2.5 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-100/80">
                              {/* Speed - Show time instead of stars */}
                              <div className="text-center group/metric">
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 text-violet-500 mb-2 group-hover/metric:scale-110 transition-transform duration-200">
                                  <Zap className="h-4 w-4" strokeWidth={2.5} />
                                </div>
                                <div className="text-[11px] font-semibold text-violet-600 leading-tight">
                                  {extractTimeFromDescription(isChina ? arena.highlights : arena.highlightsEn) || translateSpeedToTime(arena.metrics.speed, isChina)}
                                </div>
                              </div>
                              {/* Quality, Security, Cost - Star ratings */}
                              {[
                                { label: isChina ? '质量' : 'Quality', value: arena.metrics.quality, stars: getStarRating(arena.metrics.quality), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                                { label: isChina ? '安全' : 'Security', value: arena.metrics.security, stars: getStarRating(arena.metrics.security), icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: isChina ? '成本' : 'Cost', value: arena.metrics.cost, stars: getStarRating(arena.metrics.cost), icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50' },
                              ].map((metric) => {
                                const Icon = metric.icon;
                                return (
                                  <div key={metric.label} className="text-center group/metric">
                                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${metric.bg} ${metric.color} mb-2 group-hover/metric:scale-110 transition-transform duration-200`}>
                                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex justify-center gap-0.5 mb-1">
                                      {[1, 2, 3].map((star) => (
                                        <svg
                                          key={star}
                                          className={`h-3.5 w-3.5 transition-all duration-200 ${
                                            star <= metric.stars
                                              ? `${metric.color} fill-current drop-shadow-sm`
                                              : 'text-gray-200 fill-current'
                                          }`}
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Description - Improved Readability */}
                          <div className="flex-1 flex flex-col justify-end pb-4">
                            {/* Champion/擂主 Info */}
                            {(isChina ? arena.champion : arena.championEn) ? (
                              <div className="mb-2 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                                  <Trophy className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
                                  <span className="font-semibold text-purple-900 text-xs">{isChina ? '擂主' : 'Champion'}:</span>
                                  <span className="text-gray-700 truncate text-xs">{isChina ? arena.champion : arena.championEn}</span>
                                </div>
                              </div>
                            ) : null}
                            {/* Challenger/攻擂中 Info */}
                            {(isChina ? arena.challenger : arena.challengerEn) &&
                            (isChina ? arena.challenger : arena.challengerEn) !== '寻找攻擂者' &&
                            (isChina ? arena.challenger : arena.challengerEn).trim() !== '' ? (
                              <div className="mb-2.5 p-2 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border border-purple-100/60">
                                <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                                  <Trophy className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                                  <span className="font-semibold text-purple-700 text-xs">{isChina ? '攻擂中' : 'Challenger'}:</span>
                                  <span className="text-gray-600 truncate text-xs">{isChina ? arena.challenger : arena.challengerEn}</span>
                                </div>
                              </div>
                            ) : null}
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                              {isChina ? arena.highlights : arena.highlightsEn}
                            </p>
                          </div>
                        </div>

                        {/* Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
