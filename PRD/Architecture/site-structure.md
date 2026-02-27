# RWAI Arena - 网站架构文档

> 定义网站的整体页面结构、路由层级和技术架构

---

## 1. 网站信息架构

### 1.1 路由结构

```
/ (根路径，重定向到 /en)
├── /en (英文首页)
├── /zh (中文首页)
│
├── /en/arena (英文Arena页面)
├── /zh/arena (中文Arena页面)
│
├── /en/arena/[id] (英文Arena详情页)
├── /zh/arena/[id] (中文Arena详情页)
│
├── /en/framework (技术框架 - 英文)
├── /zh/framework (技术框架 - 中文)
│
├── /en/faq (FAQ - 英文)
├── /zh/faq (FAQ - 中文)
│
└── /en/about (关于我们 - 英文)
   /zh/about (关于我们 - 中文)
```

### 1.2 页面层级树

```
Root (/)
├── Homepage (/en, /zh)
│   ├── Hero Section
│   ├── Featured Arenas
│   ├── Industries Grid (each industry card links to /arena?industry={id})
│   ├── Approach (3 Steps)
│   ├── Practice Includes
│   ├── Case Studies
│   ├── Trust Section
│   └── Final CTA
│
├── Arena (/arena)
│   ├── Page Header
│   ├── Filters (Category × Industry)
│   │   └── URL query parameters supported: ?industry={id}&category={id}
│   ├── Sort Options
│   └── Arena Cards Grid
│
├── Arena Detail (/arena/[id])
│   ├── Breadcrumb Navigation
│   ├── Blueprint Overview
│   │   ├── Case Number & Status
│   │   ├── Overview Section
│   │   ├── Key Metrics Table
│   │   ├── Deployment Options
│   │   ├── Business Value
│   │   ├── Technical Architecture
│   │   ├── Quick Start
│   │   ├── Demo Video
│   │   └── Full Documentation Links
│   └── Subpages (Tabbed Navigation)
│       ├── Implementation Guide
│       ├── Requirements
│       ├── Validation Report
│       └── Project Report
│
├── Framework (/framework)
│   ├── Page Header
│   ├── What is RWAI-S
│   ├── Theoretical Foundation
│   ├── Core Philosophy
│   └── Four-Dimensional Evaluation
│
├── FAQ (/faq)
│   ├── Page Header
│   ├── FAQ Accordion
│   └── Contact Section
│
└── About (/about)
    ├── Page Header
    ├── Introduction
    ├── Team Members
    ├── Partners
    ├── Contact Information
    └── Social Links
```

### 1.3 数据流向

```
Content Files → Data Processing → Component Rendering
     ↓                ↓                ↓
Markdown Files →   lib/data.ts  →   React Components
     ↓                ↓                ↓
.en/.zh files →   TypeScript  →   User Interface
```

### 1.4 技术架构

```
┌─────────────────────────────────────────┐
│              User Browser                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Next.js 16+ (App Router)        │
├─────────────────────────────────────────┤
│  • Routing (Dynamic Routes)               │
│  • Rendering (Server/Client Components)     │
│  • Optimizations (Image, Font, Script)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Tailwind CSS (Styling)              │
├───────────────────────────────────────── 
│  • Design Tokens                     │
│  • Responsive Utilities                │
│  • Component Classes                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     next-intl (Internationalization)     │
├───────────────────────────────────────── 
│  • Message Files (en.json, zh.json)      │
│  • Locale Detection                   │
│  • Currency/Number Formatting           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Framer Motion (Animation)           │
│  • Page Transitions                    │
│  • Micro-interactions                 │
│  • Scroll Animations                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Recharts (Data Visualization)     │
│  • Radar Charts                       │
│  • Performance Metrics                 │
│  • Statistical Graphs                   │
└─────────────────────────────────────────┘
```

---

## 2. 文件组织结构

### 2.1 项目目录树

```
rwai-arena-v2.1/
├── app/                          # Next.js App Router
│   ├── [locale]/                  # 动态路由（语言）
│   │   ├── layout.tsx            # 语言布局组件
│   │   ├── page.tsx              # 首页组件
│   │   ├── arena/              # Arena页面
│   │   │   └── page.tsx          # Arena列表页
│   │   └── [id]/              # Arena详情页
│   │       └── page.tsx          # 详情页组件
│   ├── globals.css               # 全局样式
│   └── layout.tsx               # 根布局
│
├── components/                   # React组件
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx            # 顶部导航栏
│   │   ├── Footer.tsx            # 底部信息栏
│   │   └── index.ts
│   ├── ui/                       # 基础UI组件
│   │   ├── Button.tsx            # 按钮组件
│   │   ├── Badge.tsx             # 徽章组件
│   │   ├── RadarChart.tsx       # 雷达图组件
│   │   ├── Card.tsx              # 卡片容器
│   │   ├── Accordion.tsx         # 手风琴组件
│   │   └── index.ts
│   └── arena/                    # Arena相关组件
│       ├── ArenaCard.tsx        # Arena卡片
│       ├── FilterBar.tsx         # 筛选栏
│       ├── SortDropdown.tsx      # 排序下拉
│       └── index.ts
│
├── lib/                         # 工具库
│   ├── data.ts                  # 核心数据定义
│   ├── types.ts                 # TypeScript类型
│   ├── utils.ts                 # 工具函数
│   └── formats.ts              # 格式化函数
│
├── locales/                     # 国际化翻译
│   ├── en.json                 # 英文翻译
│   └── zh.json                 # 中文翻译
│
├── i18n/                        # 国际化配置
│   └── request.ts              # next-intl配置
│
├── Content/                     # 内容文件
│   ├── Homepage/               # 首页内容
│   │   ├── hero.raw.md          # Hero区原始版本
│   │   ├── hero.zh.md           # Hero区中文版
│   │   └── hero.en.md           # Hero区英文版
│   │
│   ├── Arena/                 # Arena页面内容
│   │   ├── page.raw.md         # Arena页原始版本
│   │   ├── page.zh.md          # Arena页中文版
│   │   └── page.en.md          # Arena页英文版
│   │
│   ├── Framework/             # 技术框架内容
│   │   ├── page.raw.md         # 框架页原始版本
│   │   ├── page.zh.md          # 框架页中文版
│   │   └── page.en.md          # 框架页英文版
│   │
│   ├── FAQ/                   # FAQ内容
│   │   ├── page.raw.md         # FAQ原始版本
│   │   ├── page.zh.md          # FAQ中文版
│   │   └── page.en.md          # FAQ英文版
│   │
│   └── About/                 # 关于我们内容
│       ├── page.raw.md        # About页原始版本
│       ├── page.zh.md       # About页中文版
│       └── page.en.md       # About页英文版
│
├── PRD/                         # 设计和架构文档
│   ├── Architecture/            # 网站架构文档
│   │   └── site-structure.md  # 本文档
│   │
│   ├── Design/                # 设计文档
│   │   ├── visual-design.md    # 视觉设计规范
│   │   ├── layout-specs.md      # 布局规范
│   │   ├── color-system.md      # 颜色系统
│   │   ├── typography.md       # 排版系统
│   │   ├── component-library.md  # 组件库规范
│   │   └── responsive.md       # 响应式设计
│   │
│   └── WEBSITE_DESIGN_PROMPT.txt  # 原始设计文档
│
├── public/                      # 静态资源
│   ├── images/                 # 图片资源
│   ├── icons/                  # 图标资源
│   └── content/                # Markdown内容
│       └── practices/           # 实践详情Markdown
│
├── next.config.js               # Next.js配置
├── tailwind.config.ts            # Tailwind配置
├── tsconfig.json                # TypeScript配置
└── package.json                 # 项目依赖

```

---

## 3. 页面定义清单

### 3.1 公共页面组件

| 页面路径 | 页面名称 | 模板文件 | 数据源 |
|---------|---------|----------|--------|
| `/en`, `/zh` | 首页 | `app/[locale]/page.tsx` | `Content/Homepage/` |
| `/en/arena`, `/zh/arena` | Arena列表页 | `app/[locale]/arena/page.tsx` | `Content/Arena/` + `lib/data.ts` |
| `/en/arena/[id]`, `/zh/arena/[id]` | Arena详情页 | `app/[locale]/arena/[id]/page.tsx` | `Content/Arena/[id]/` |
| `/en/framework`, `/zh/framework` | 技术框架 | `app/[locale]/framework/page.tsx` | `Content/Framework/` |
| `/en/faq`, `/zh/faq` | FAQ | `app/[locale]/faq/page.tsx` | `Content/FAQ/` |
| `/en/about`, `/zh/about` | 关于我们 | `app/[locale]/about/page.tsx` | `Content/About/` |

### 3.2 布局组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| Header | `components/layout/Header.tsx` | 顶部导航栏，包含Logo、导航菜单、语言切换、GitHub链接 |
| Footer | `components/layout/Footer.tsx` | 底部信息栏，包含链接、版权、社交链接 |

### 3.3 UI组件库

| 组件 | 文件路径 | 用途 |
|------|---------|------|
| Button | `components/ui/Button.tsx` | 按钮组件（4种变体：primary, secondary, ghost, text）|
| Badge | `components/ui/Badge.tsx` | 徽章组件（5种变体：verified, in-arena, beta, industry, category）|
| RadarChart | `components/ui/RadarChart.tsx` | 雷达图组件，显示四维指标 |
| Card | `components/ui/Card.tsx` | 卡片容器组件 |
| Accordion | `components/ui/Accordion.tsx` | 手风琴折叠组件 |
| FilterBar | `components/arena/FilterBar.tsx` | Arena筛选栏 |
| SortDropdown | `components/arena/SortDropdown.tsx` | 排序下拉菜单 |

---

## 4. 路由配置

### 4.1 动态路由

```typescript
// app/[locale]/layout.tsx
export async function generateStaticParams() {
  return { locale: ['en', 'zh'] }
}

// 中间件配置：middleware.ts
export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always'
})
```

### 4.2 静态路由

```typescript
// 静态生成的页面
const staticPages = [
  '/',                     // 重定向到 /en
  '/en', '/zh',            // 首页
  '/en/arena', '/zh/arena', // Arena列表
  '/en/framework', '/zh/framework',
  '/en/faq', '/zh/faq',
  '/en/about', '/zh/about'
]
```

### 4.3 动态路由参数

```typescript
// Arena详情页
interface ArenaParams {
  locale: 'en' | 'zh'
  id: string  // Arena ID
}
```

### 4.4 Arena页面URL查询参数

Arena页面支持通过URL查询参数进行预筛选：

```typescript
// URL查询参数
interface ArenaQueryParams {
  industry?: Industry  // 按行业筛选: ?industry=finance
  category?: Category  // 按类别筛选: ?category=service
}
```

**使用场景**:
- 首页"Explore by Industry"行业的每个行业卡片点击后跳转到 `/arena?industry={id}`
- 其他页面可以通过链接直接跳转到已筛选状态的Arena页面

**实现细节**:
- Arena页面为客户端组件（'use client'），使用 `useSearchParams` 读取URL参数
- 参数值必须在 `Category` 或 `Industry` 类型范围内
- 无效参数值会被忽略，显示所有Arena

---

## 5. 组件层次结构

```
Layout Layer (app/[locale]/layout.tsx)
├── Header (components/layout/Header.tsx)
└── Footer (components/layout/Footer.tsx)

Page Layer (app/[locale]/page.tsx)
└── Section Components
    ├── HeroSection
    ├── FeaturedArenasSection
    ├── IndustriesSection
    ├── ApproachSection
    ├── PracticeIncludesSection
    ├── CaseStudiesSection
    ├── TrustSection
    └── FinalCtaSection

Arena Page (app/[locale]/arena/page.tsx)
├── FilterBar (components/arena/FilterBar.tsx)
├── SortDropdown (components/arena/SortDropdown.tsx)
└── ArenaCard (components/arena/ArenaCard.tsx)
```

---

## 6. 数据架构

### 6.1 数据模型

```typescript
// 核心数据类型定义
interface Arena {
  id: string
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  category: Category
  industry: Industry
  status: 'verified' | 'in-arena'
  metrics: {
    quality: number    // 0-100
    efficiency: number // 0-100
    cost: number       // 0-100
    trust: number      // 0-100
  }
  github: {
    stars: number
    forks: number
    url: string
  }
  highlights: string[]
  createdAt: Date
  updatedAt: Date
}

type Category =
  | 'service'
  | 'management'
  | 'marketing'
  | 'risk-control'
  | 'operations'
  | 'general'

type Industry =
  | 'finance'
  | 'retail'
  | 'education'
  | 'healthcare'
  | 'energy'
  | 'manufacturing'
```

### 6.2 数据存储位置

| 数据类型 | 文件路径 | 说明 |
|---------|---------|------|
| Arena元数据 | `lib/data.ts` | 所有Arena的配置数据 |
| 翻译文本 | `locales/en.json`, `locales/zh.json` | UI界面翻译 |
| 页面内容 | `Content/{Homepage}/, Content/Arena/` 等 | 每个页面的具体内容 |
| Arena详情 | `Content/Arena/{arena-id}/` | 每个Arena的详细内容 |

---

## 7. 导航架构

### 7.1 主导航

```
┌────────────────────────────────────────────────┐
│ RWAI Arena                                    │
│                                                │
│ [Home] [Arena] [Framework] [FAQ] [About]     │
│                                                │
│                    [EN|ZH] [GitHub]            │
└────────────────────────────────────────────────┘
```

**导航项定义**：
- Home → `/` (重定向到语言首页)
- Arena → `/arena` (继承当前语言)
- Framework → `/framework`
- FAQ → `/faq`
- About → `/about`

### 7.2 面包屑导航

```
Home > Arena > NL2SQL Financial Reports
```

**使用场景**：
- Arena详情页：`Home > Arena > {Arena Name}`
- Framework深层页面：`Home > Framework > {Section Name}`

---

## 8. 状态管理

### 8.1 客户端状态

```typescript
// Arena页面状态
interface ArenaPageState {
  filters: {
    category: Category | 'all'
    industry: Industry | 'all'
  }
  sortBy: 'quality' | 'efficiency' | 'cost' | 'trust' | 'stars'
  filteredArenas: Arena[]
}
```

### 8.2 服务器状态

```typescript
// 从 lib/data.ts 导入
export const arenas: Arena[] = [...]
export const categories: Record<Category, CategoryConfig> = {...}
export const industries: Record<Industry, IndustryConfig> = {...}
```

---

## 9. 性能优化策略

### 9.1 图片优化

- 使用 `next/image` 组件自动优化
- 响应式图片（srcset）
- 懒加载（loading="lazy"）
- 图片压缩（WebP优先）

### 9.2 代码分割

- 页面级分割（App Router自动）
- 组件级分割（动态导入）
- 路由级代码分割

### 9.3 缓存策略

- 静态生成页面优先预渲染
- 动态路由使用增量静态再生成（ISR）
- API路由使用缓存

---

## 10. SEO优化

### 10.1 Meta标签

```typescript
// app/[locale]/layout.tsx
export const metadata: Metadata = {
  title: 'RWAI Arena - Real-World AI Best Practices',
  description: 'Find the best AI solutions for your real-world business scenarios.',
  keywords: ['AI', 'Best Practices', 'Arena', 'Verified', 'Open Source'],
  openGraph: {
    title: 'RWAI Arena',
    description: '...',
    url: 'https://rwai-arena.org',
    siteName: 'RWAI Arena',
    locale: 'en_US',
    type: 'website',
  },
  alternates: [
    { lang: 'en', url: 'https://rwai-arena.org/en' },
    { lang: 'zh', url: 'https://rwai-arena.org/zh' },
  ],
}
```

### 10.2 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RWAI Arena",
  "url": "https://rwai-arena.org",
  "sameAs": [
    "https://github.com/THU-ZJAI/Real-World-AI"
  ]
}
```

---

## 11. 安全考虑

### 11.1 XSS防护

- 使用 React JSX 自动转义
- 避免使用 `dangerouslySetInnerHTML`
- Markdown内容必须经过 sanitize

### 11.2 数据验证

- 所有用户输入必须验证
- Arena数据类型检查
- 文件上传限制（类型、大小）

---

## 12. 国际化实现

### 12.1 翻译文件结构

```
locales/
├── en.json                 # 英文界面翻译
├── zh.json                 # 中文界面翻译
└── [locale].json         # 可选其他语言
```

### 12.2 翻译键命名规范

```json
{
  "hero": {
    "title": "页面标题",
    "subtitle": "页面副标题",
    "cta": "行动号召按钮"
  },
  "arena": {
    "title": "Arena页面标题",
    "filter": "筛选选项"
  }
}
```

---

## 13. 错误处理

### 13.1 404页面

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
    </div>
  )
}
```

### 13.2 错误边界

```typescript
// app/error.tsx
'use client'
export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

**文档版本**: 1.0
**最后更新**: 2025-01-28
**维护者**: RWAI Team
