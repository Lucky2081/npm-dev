# RWAI Arena - Quality Checklist

> Comprehensive quality assurance checklist for all updates and changes
>
> **Purpose**: Ensure every update meets quality standards before deployment
> **Usage**: Run through this checklist after completing any significant changes

---

## Checklist Overview

This checklist covers all aspects we've encountered during development:
- ✅ **CRITICAL**: Source of Truth Verification (PRD/Content as single source)
- ✅ **CRITICAL**: Content-to-Component Mapping Verification
- ✅ Bilingual content integrity
- ✅ Visual design consistency
- ✅ Component implementation
- ✅ Responsive design
- ✅ Performance & accessibility
- ✅ Content management workflow
- ✅ Build & deployment

---

## 1. Bilingual Content Integrity

### 1.1 Content File Structure ✅

- [ ] **Raw file format verification**
  - [ ] All raw files (`.raw.md`) exist in `Content/` directories
  - [ ] Bilingual content uses proper section markers: `#### English` and `#### 中文`
  - [ ] No inline translation format like `## Title (标题)` in raw files
  - [ ] Each section has both English and Chinese content

- [ ] **Generated files verification**
  - [ ] Run `npm run sync-content` successfully
  - [ ] Check `.en.md` files contain ONLY English content
  - [ ] Check `.zh.md` files contain ONLY Chinese content
  - [ ] No mixed language headers (e.g., "Deployment Options 部署选项")

### 1.2 Content Parsing Logic ✅

- [ ] **Parser validation** (`scripts/sync-content.ts`)
  - [ ] `parseSimplePage` correctly handles "#### English"/"#### 中文" markers
  - [ ] Header extraction regex properly filters by language:
    ```typescript
    // English extraction: /^([a-zA-Z\s\(\)\-\,\.\'\"\:]+)/
    // Chinese extraction: /[\u4e00-\u9fa5]+/g
    ```
  - [ ] No bilingual headers in generated files
  - [ ] Section markers are removed from final output

- [ ] **Component parsing** (page.tsx, client-page.tsx)
  - [ ] `parseHeroContent` handles both English and Chinese section headers
  - [ ] `parseApproachContent` correctly extracts localized titles
  - [ ] All content parsing functions support bilingual input

### 1.3 Common Bilingual Bugs to Check ✅

- [ ] **English in Chinese version**
  - [ ] Check Chinese homepage for English text
  - [ ] Example to verify: "Real Scenarios • Fair Competition • Single Best" should NOT appear in Chinese
  - [ ] Approach section subtitle fully translated

- [ ] **Chinese in English version**
  - [ ] Check English pages for Chinese characters
  - [ ] No Chinese characters in English headers or body text

- [ ] **Mixed language headers**
  - [ ] All section headers are language-pure
  - [ ] No "Deployment Options 部署选项" style headers
  - [ ] Tab labels are properly localized

---

## 2. Visual Design Consistency

### 2.1 Component Library Compliance ✅

- [ ] **Buttons**
  - [ ] Primary buttons: `bg-primary` (#155EEF), white text, 6-8px rounded
  - [ ] Secondary buttons: border `#E2E8F0`, transparent background
  - [ ] Hover effects: `hover:-translate-y-1`, shadow increase
  - [ ] Consistent padding: 12-24px, height: 44-48px

- [ ] **Badges**
  - [ ] Verified: green `bg-amber-50` or `bg-green-100` with checkmark
  - [ ] Status badges: pill shape, 12-16px rounded
  - [ ] Industry/Category tags: `bg-blue-50` or `bg-slate-100`

- [ ] **Cards**
  - [ ] Arena cards: white background, border `#E2E8F0`, 12-16px rounded
  - [ ] Hover: `hover:shadow-lg hover:-translate-y-1`
  - [ ] Consistent padding: 24px
  - [ ] Minimum height: 280-320px

- [ ] **Icons**
  - [ ] Lucide React icons used throughout (no emoji for professional elements)
  - [ ] Icon containers with gradient: `bg-gradient-to-br from-primary-50 to-primary-100`
  - [ ] Consistent sizing: `w-6 h-6` for standard, `h-5 w-5` for small
  - [ ] Industry icons use Building2, ShoppingCart, GraduationCap, HeartPulse, Zap, Factory

### 2.2 Color System ✅

- [ ] **Primary colors**
  - [ ] Primary: `#155EEF` (text-primary, bg-primary)
  - [ ] Text primary: `#0F172A` (text-gray-900)
  - [ ] Text secondary: `#64748B` (text-gray-600)
  - [ ] Borders: `#E2E8F0` (border-gray-200)

- [ ] **Semantic colors**
  - [ ] Success: `#10B981` (green)
  - [ ] Warning: `#F59E0B` (amber)
  - [ ] Error: `#EF4444` (red)
  - [ ] Info: `#3B82F6` (blue)

### 2.3 Typography ✅

- [ ] **Font sizes**
  - [ ] Hero titles: 48-64px (desktop), 32-40px (mobile)
  - [ ] Section titles: 36-48px (desktop), 28-36px (mobile)
  - [ ] Card titles: 18-20px
  - [ ] Body text: 16px
  - [ ] Secondary text: 14px

- [ ] **Font weights**
  - [ ] Bold (700): page titles, important emphasis
  - [ ] SemiBold (600): section titles, card titles, buttons
  - [ ] Medium (500): navigation, labels, tags
  - [ ] Regular (400): body text, descriptions

- [ ] **Line heights**
  - [ ] Hero titles: 1.1-1.2
  - [ ] Body text: 1.6-1.7 (leading-relaxed)
  - [ ] Tight text: 1.3-1.4

### 2.4 Spacing System ✅

- [ ] **Section spacing**
  - [ ] Between sections: 80-120px (py-20 to py-32)
  - [ ] Card grids: 24-32px gap (gap-6 to gap-8)
  - [ ] Element spacing: 16-24px
  - [ ] Small elements: 8-12px

- [ ] **Padding**
  - [ ] Page content: 32px (desktop), 16px (mobile)
  - [ ] Cards: 24px (desktop), 16px (mobile)
  - [ ] Buttons: 12-24px horizontal

---

## 3. Component Implementation

### 3.1 Homepage Components ✅

- [ ] **Hero Section**
  - [ ] Badges displayed: "Open Source • Verified • Replicable" / "开源 • 已验证 • 可复制"
  - [ ] Title, subtitle, description properly localized
  - [ ] CTA buttons: Primary + Secondary
  - [ ] Center alignment, max-width 900px for title

- [ ] **Featured Arenas**
  - [ ] Grid layout: 4 columns (lg), 2 columns (md), 1-2 columns (sm)
  - [ ] Cards show: verified badge, title, tags, description, metrics, GitHub stats
  - [ ] Hover effects working
  - [ ] Links to `/arena/[id]`

- [ ] **Industries Section**
  - [ ] **Icons**: Lucide icons, NOT emoji (🏢)
  - [ ] Icon containers with gradient background
  - [ ] Grid: 6 columns (lg), 3 columns (md), 2 columns (sm)
  - [ ] Links to `/arena?industry={key}` working
  - [ ] Hover effects: shadow, translate-y, icon scale

- [ ] **Approach Section**
  - [ ] Title properly localized (no mixed languages)
  - [ ] Three-step cards with numbers/icons
  - [ ] Grid: 3 columns (desktop), 1 column (mobile)

### 3.2 Arena Detail Page Components ✅

- [ ] **Hero Section**
  - [ ] Breadcrumb: "← Back to Arena List" with link
  - [ ] Status badge: Verified (gold/amber)
  - [ ] Title: 36-48px, bold, gray-900
  - [ ] Description: max-width 900px, gray-600
  - [ ] Background: gradient with grid pattern (`bg-grid-pattern`)

- [ ] **4-Pillar Metrics**
  - [ ] Four metrics: Quality, Efficiency, Cost, Trust
  - [ ] Icons: Star, Zap, DollarSign, Shield
  - [ ] Animated progress bars (Framer Motion)
  - [ ] Grid: 2 columns (sm), 4 columns (md+)
  - [ ] Values: `arena.metrics?.quality` (not `arena.quality`)

- [ ] **Sticky Tab Navigation**
  - [ ] Sticky: `sticky top-16 z-40`
  - [ ] Color-coded tabs:
    - Overview (gray)
    - Implementation (purple)
    - Requirements (green)
    - Validation (amber)
    - Project (red)
  - [ ] Active state: bottom border + gradient background
  - [ ] Icons for each tab
  - [ ] Localized labels

- [ ] **Content Sections**
  - [ ] Markdown rendering with ReactMarkdown
  - [ ] Custom markdown styles:
    - H1: `text-4xl font-extrabold text-gray-900 mb-4 mt-12 first:mt-0`
    - H2: `text-3xl font-extrabold text-gray-900 mb-3 mt-12`
    - H3: `text-2xl font-bold text-gray-900 mb-2 mt-8`
    - Tables: styled with gray headers, borders
    - Code blocks: gray-900 background
    - Blockquotes: blue border left
  - [ ] All sections present: Overview, Implementation, Requirements, Validation, Project

- [ ] **Sidebar Cards**
  - [ ] Gap Analysis card with feature comparison
  - [ ] Technical Details card with tech stack
  - [ ] Visible on desktop (lg:col-span-1)
  - [ ] Hidden or stacked on mobile

### 3.3 Navigation Components ✅

- [ ] **Header/Navbar**
  - [ ] Logo: RWAI Arena, primary color
  - [ ] Links: Arena, Framework, FAQ, About
  - [ ] Language switcher: EN | ZH
  - [ ] GitHub link
  - [ ] Sticky or fixed positioning
  - [ ] Mobile hamburger menu (< 1024px)

- [ ] **Breadcrumbs**
  - [ ] Arena detail page: "Arena > [Arena Title]"
  - [ ] Separator: "/" or "→"
  - [ ] Links work correctly
  - [ ] Localized text

- [ ] **Footer**
  - [ ] Links to main pages
  - [ ] GitHub link
  - [ ] Copyright notice
  - [ ] Consistent styling

---

## 4. Responsive Design

### 4.1 Breakpoints ✅

- [ ] **Mobile (< 640px)**
  - [ ] Single column layouts
  - [ ] Reduced padding: 16px
  - [ ] Smaller font sizes (H1: 32-40px)
  - [ ] Hamburger menu
  - [ ] Touch-friendly buttons (min 44px height)
  - [ ] Horizontal scrolling for tabs if needed

- [ ] **Tablet (640-1024px)**
  - [ ] 2-3 column grids
  - [ ] Medium padding: 24-32px
  - [ ] Adjusted font sizes
  - [ ] Sidebar stacked below main content

- [ ] **Desktop (> 1024px)**
  - [ ] Full multi-column layouts
  - [ ] Maximum padding: 32px
  - [ ] Full font sizes
  - [ ] Sidebar visible on right

### 4.2 Responsive Components ✅

- [ ] **Grids**
  - [ ] Featured Arenas: 4 → 3 → 2 → 1 columns
  - [ ] Industries: 6 → 3 → 2 columns
  - [ ] Arena detail: 2:1 ratio on desktop, 1 column on mobile

- [ ] **Navigation**
  - [ ] Desktop: horizontal links
  - [ ] Mobile: hamburger menu with full-screen panel

- [ ] **Images/Icons**
  - [ ] Responsive sizing (w-6 h-6 → w-5 h-5 on mobile)
  - [ ] Alt text for accessibility
  - [ ] No overflow on small screens

### 4.3 Touch Interactions ✅

- [ ] Minimum tap target size: 44x44px
- [ ] No hover-only interactions (ensure tap works)
- [ ] Smooth scrolling on mobile
- [ ] No horizontal scroll issues (except intentional)

---

## 5. Performance & Accessibility

### 5.1 Performance ✅

- [ ] **Build verification**
  - [ ] `npm run build` completes without errors
  - [ ] No TypeScript errors
  - [ ] No ESLint warnings (or only acceptable ones)
  - [ ] Bundle size reasonable

- [ ] **Loading**
  - [ ] Skeleton screens for dynamic content
  - [ ] Lazy loading for images (if any)
  - [ ] Code splitting for route-based chunks
  - [ ] Framer Motion animations don't block content

- [ ] **Optimization**
  - [ ] Images optimized (WebP format, proper sizes)
  - [ ] Font loading optimized
  - [ ] CSS purged (Tailwind)
  - [ ] No unnecessary dependencies

### 5.2 Accessibility (a11y) ✅

- [ ] **Semantic HTML**
  - [ ] Proper heading hierarchy (h1 → h2 → h3)
  - [ ] Use `<nav>`, `<main>`, `<section>`, `<article>` where appropriate
  - [ ] Links have meaningful text (not "click here")

- [ ] **ARIA attributes**
  - [ ] Buttons have proper aria-labels if icon-only
  - [ ] Modals/dropdowns have proper roles
  - [ ] Live regions for dynamic content
  - [ ] Tabs have proper ARIA attributes

- [ ] **Keyboard Navigation**
  - [ ] Tab order logical
  - [ ] Focus indicators visible
  - [ ] Enter/Space activate interactive elements
  - [ ] Escape closes modals/menus

- [ ] **Color Contrast**
  - [ ] Text meets WCAG AA standards (4.5:1 for normal text)
  - [ ] Icons have sufficient contrast
  - [ ] Focus indicators visible
  - [ ] Not color-only for information conveyance

- [ ] **Screen Reader Support**
  - [ ] Alt text for images
  - [ ] ARIA labels for icons
  - [ ] Semantic HTML for structure
  - [ ] Skip to main content link (if applicable)

---

## 6. Content Management Workflow

### 6.0 Source of Truth Verification ✅ **CRITICAL**

> **Principle**: Team-managed documentation (PRD/ and Content/) is ALWAYS the source of truth. No hardcoded content, text, or magic values in code.

- [ ] **No Hardcoded Content in Components**
  - [ ] Search component files for hardcoded strings: `app/**/*.tsx`, `components/**/*.tsx`
  - [ ] Verify NO Chinese or English text directly in JSX/TSX (except for ARIA labels with proper t() function)
  - [ ] Check for hardcoded labels, buttons, headings, descriptions in components
  - [ ] All user-facing content MUST come from `Content/*.md` files
  - [ ] Example to check: `<h1>Which AI Actually Works?</h1>` → Should be from content file

- [ ] **No Hardcoded Design Values**
  - [ ] Search for magic numbers: colors (`#155EEF`), sizes (`width: 375px`), spacing (`p-24` without Tailwind)
  - [ ] Verify design tokens match PRD/Design/ specifications
  - [ ] Colors use semantic names from `PRD/Design/color-system.md`
  - [ ] Typography uses values from `PRD/Design/typography.md`
  - [ ] Component specs match `PRD/Design/component-library.md`

- [ ] **Content File as Single Source**
  - [ ] For each component displaying content, verify it reads from `Content/` files
  - [ ] No duplicate content in code AND Content files
  - [ ] `lib/data.ts` entries must have corresponding `Content/Arena/[id]/` directories
  - [ ] Missing Content directory should cause build error, not silent fallback

- [ ] **PRD Design Documentation Sync**
  - [ ] Implementation matches `PRD/Design/layout-specs.md`
  - [ ] Component props and styles match `PRD/Design/component-library.md`
  - [ ] If code differs from PRD, either update PRD first OR document why exception exists
  - [ ] All visual changes MUST have corresponding PRD update

- [ ] **Automated Verification Commands**
  ```bash
  # Run these checks to verify no hardcoded content:
  # 1. Find hardcoded Chinese in components
  grep -r "[\u4e00-\u9fa5]" app/ components/ --include="*.tsx" --include="*.ts"
  # Should return minimal results (only comments, console.log for debugging)

  # 2. Find hardcoded English strings in components
  grep -r '">[A-Z][a-zA-Z\s]{10,}<"' app/ components/ --include="*.tsx"
  # Should return minimal results (aria-labels, data-testid only)

  # 3. Verify all arenas in lib/data.ts have content directories
  # (Claude should provide verification script)
  ```

- [ ] **Pre-Deployment Source of Truth Check**
  - [ ] All new content added to `Content/*.raw.md` files
  - [ ] All design changes documented in `PRD/Design/*.md` files
  - [ ] `npm run sync-content` run successfully
  - [ ] No TODO comments with content placeholder text
  - [ ] No `// FIXME: hardcoded content` comments remaining

### 6.1 Content Updates ✅

- [ ] **Adding new content**
  - [ ] Create `.raw.md` file in appropriate `Content/` directory
  - [ ] Use proper bilingual format with section markers
  - [ ] Run `npm run sync-content` to generate `.en.md` and `.zh.md`
  - [ ] Verify generated files are clean (single language)
  - [ ] Test both language versions

- [ ] **Updating existing content**
  - [ ] Edit `.raw.md` file
  - [ ] Re-run `npm run sync-content`
  - [ ] Verify changes appear in both language versions
  - [ ] Check for mixed languages in output

### 6.2 Data Structure Updates ✅

- [ ] **Adding new Arena**
  - [ ] Add entry to `lib/data.ts` arenas array
  - [ ] Include all required fields: id, title (en/zh), description (en/zh), category, industry, status, metrics, github
  - [ ] Create content directory: `Content/Arena/{id}/`
  - [ ] Add all content files: overview.raw.md, requirements.raw.md, etc.
  - [ ] Run sync-content script
  - [ ] Test arena detail page

- [ ] **Adding new Industry/Category**
  - [ ] Update `lib/data.ts` industries or categories object
  - [ ] Add Lucide icon import
  - [ ] Include en/zh translations
  - [ ] Update icon component if needed
  - [ ] Test filtering/display

### 6.3 Component Updates ✅

- [ ] **Updating component**
  - [ ] Check both English and Chinese versions
  - [ ] Verify responsive behavior
  - [ ] Test hover states and interactions
  - [ ] Check accessibility
  - [ ] Update PRD documentation first (for visual changes)

- [ ] **Design updates**
  - [ ] Update PRD/Design/ files FIRST
  - [ ] Document changes in layout-specs.md or component-library.md
  - [ ] Then implement in code
  - [ ] Verify against documented specs

### 6.4 Internationalization (i18n) Code Review ✅ **CRITICAL**

> **Purpose**: Prevent hardcoded Chinese/English text from appearing in the wrong language version.
>
> **Common Issue**: Text like "业务亮点" appearing on English pages, or "Business Highlights" on Chinese pages.

- [ ] **No Hardcoded User-Facing Text**
  - [ ] Search for hardcoded Chinese in components:
    ```bash
    grep -n ">.*[一-龟].*<" app/\**/\*.tsx components/\**/\*.tsx
    ```
  - [ ] Search for hardcoded English that's user-facing:
    ```bash
    grep -n '>[A-Z][A-Za-z\s]{10,}<' app/\**/\*.tsx
    ```
  - [ ] All user-facing text MUST use conditional rendering:
    ```typescript
    // ✅ CORRECT
    {locale === 'zh' ? '中文文本' : 'English Text'}
    {isChina ? '中文文本' : 'English Text'}

    // ❌ WRONG - Hardcoded language
    <div>业务亮点</div>
    <div>Business Highlights</div>
    ```
  - [ ] **Object properties MUST also use conditional**:
    ```typescript
    // ✅ CORRECT
    const highlights = [
      {
        title: isChina ? '中文标题' : 'English Title',
        description: isChina ? '中文描述' : 'English Description',
      }
    ];

    // ❌ WRONG - Hardcoded in object
    const highlights = [
      {
        title: '中文标题',  // Missing conditional!
        description: '中文描述',
      }
    ];
    ```

- [ ] **Check Common Hardcoded Locations**
  - [ ] **Card/Section titles**: "业务亮点", "核心价值", "最佳实践", etc.
  - [ ] **Button text**: "立即开始", "了解更多", "Contact Us", etc.
  - [ ] **Labels**: "擂主", "攻擂中", "Champion", "Challenger", etc.
  - [ ] **Status badges**: "已验证", "验证中", "Verified", "Testing", etc.
  - [ ] **Descriptions**: Any text visible to users
  - [ ] **Object property values**: Check `title:`, `description:`, `text:`, `label:`, `name:` properties
    ```bash
    # Find Chinese in object properties
    grep -rn "title:\s*['\`"].*[一-龟]" app/ components/ --include="*.tsx"
    grep -rn "description:\s*['\`"].*[一-龟]" app/ components/ --include="*.tsx"
    ```

- [ ] **Data Source Fields**
  - [ ] Arena data in `lib/data.ts` must have both en/zh fields
  - [ ] Check `title`, `highlights`, `champion`, `challenger` fields
  - [ ] All data access must use locale selector:
    ```typescript
    // ✅ CORRECT
    {arena.title[locale as keyof typeof arena.title] || arena.title.zh}
    {isChina ? arena.champion : arena.championEn}

    // ❌ WRONG
    {arena.title.zh}
    {arena.champion}
    ```

- [ ] **Automated i18n Validation Script**
  - [ ] Run this command to find potential issues:
    ```bash
    # Find JSX with hardcoded Chinese (excludes comments/attributes)
    grep -rn '">[^<]*[一-龟][^<]*<" app/ components/ --include="*.tsx" | \
      grep -v "//" | \
      grep -v "locale === 'zh'" | \
      grep -v "isChina ?"
    ```
  - [ ] Review each result - must be either:
    - Inside a conditional: `locale === 'zh' ? '...' : '...'`
    - A variable name or technical term
    - Inside a comment (should be removed from production)

- [ ] **Pre-Commit i18n Checklist**
  - [ ] All new text added uses locale conditional
  - [ ] Both English and Chinese translations provided
  - [ ] No language mixed in UI elements
  - [ ] Test both `/en/` and `/zh/` routes
  - [ ] No hardcoded Chinese on English pages
  - [ ] No hardcoded English on Chinese pages (except technical terms)

- [ ] **Common i18n Bugs to Watch For**
  - [ ] "业务亮点" appearing on English pages
  - [ ] "擂主"/"攻擂中" not translated to "Champion"/"Challenger"
  - [ ] "寻找攻擂者" appearing instead of being filtered out
  - [ ] Numbers or dates not localized (e.g., "1周" vs "1 week")
  - [ ] Technical terms mixed with user-facing text without translation

---

## 7. Build & Deployment

### 7.1 Pre-Build Checks ✅

- [ ] **Code quality**
  - [ ] No console.log statements (except for intentional debugging)
  - [ ] No commented-out code
  - [ ] No TODO comments without GitHub issues
  - [ ] Proper error handling (try/catch for async operations)

- [ ] **TypeScript**
  - [ ] All types properly defined
  - [ ] No `any` types without justification
  - [ ] Proper null/undefined checks
  - [ ] Use optional chaining (`?.`) for nested properties

- [ ] **Imports**
  - [ ] No unused imports
  - [ ] Proper import ordering
  - [ ] Absolute imports (`@/`) used for project files
  - [ ] All dependencies in package.json

### 7.2 Build Process ✅

- [ ] **Local build**
  - [ ] `npm run build` completes successfully
  - [ ] Check build output for warnings
  - [ ] Verify all routes are generated
  - [ ] Check bundle sizes in output

- [ ] **Development server**
  - [ ] `npm run dev` starts without errors
  - [ ] Hot reload working
  - [ ] No console errors in browser
  - [ ] Network tab shows successful asset loading

### 7.3 Testing Checklist ✅

- [ ] **Manual testing**
  - [ ] Test all pages in both languages
  - [ ] Test all links (no 404s)
  - [ ] Test all interactive elements (buttons, tabs, forms)
  - [ ] Test responsive design (devtools device emulation)
  - [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)

- [ ] **Content testing**
  - [ ] Verify all content displays correctly
  - [ ] Check for broken images
  - [ ] Verify markdown renders properly
  - [ ] Check for typos in both languages
  - [ ] Verify all icons render

- [ ] **User flows**
  - [ ] Homepage → Arena List → Arena Detail
  - [ ] Language switching on all pages
  - [ ] Industry/category filtering
  - [ ] Tab navigation on arena detail
  - [ ] Breadcrumb navigation
  - [ ] External links (GitHub, etc.)

---

## 8. Common Bugs & Fixes (Quick Reference)

### 8.1 Bilingual Content Issues ✅

**Bug**: English text in Chinese version
- [ ] **Check**: Approach section title, validation report headers
- [ ] **Fix**: Use section markers in raw files, update parser
- [ ] **Verify**: Run sync-content, check .zh.md file

**Bug**: Mixed language headers like "Deployment Options 部署选项"
- [ ] **Check**: All generated .en.md and .zh.md files
- [ ] **Fix**: Update parser to extract only target language from headers
- [ ] **Verify**: Headers are pure English or pure Chinese

**Bug**: Empty content after sync
- [ ] **Check**: Parser logic for section markers
- [ ] **Fix**: Ensure "#### English" and "#### 中文" format used
- [ ] **Verify**: Both sections have content in raw file

### 8.2 Import/Type Errors ✅

**Bug**: "Export 'GitHub' doesn't exist... Did you mean 'Github'?"
- [ ] **Check**: Lucide icon imports (case-sensitive)
- [ ] **Fix**: Change `GitHub` to `Github` (lowercase 'h')
- [ ] **Verify**: Build succeeds

**Bug**: "Property 'quality' does not exist on type 'Arena'"
- [ ] **Check**: Nested object structure in types
- [ ] **Fix**: Use `arena.metrics?.quality` instead of `arena.quality`
- [ ] **Verify**: Type checking passes

**Bug**: "Cannot find name 'Building2'"
- [ ] **Check**: Lucide icon imports in data.ts
- [ ] **Fix**: Add missing imports: `import { Building2, ... } from 'lucide-react'`
- [ ] **Verify**: Icons render correctly

### 8.3 Visual Issues ✅

**Bug**: Small ugly emoji instead of professional icons
- [ ] **Check**: Industries section using 🏢 emoji
- [ ] **Fix**: Replace with Lucide icons in gradient containers
- [ ] **Verify**: Professional appearance with hover effects

**Bug**: Arena detail page looks terrible
- [ ] **Check**: Missing hero section, metrics, tabs
- [ ] **Fix**: Implement blueprint-style design with all components
- [ ] **Verify**: Professional, polished appearance

### 8.4 Browser Issues ✅

**Bug**: Changes not visible after update
- [ ] **Check**: Browser cache
- [ ] **Fix**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] **Verify**: Changes appear

**Bug**: 404 on arena detail pages
- [ ] **Check**: Arena ID in data.ts matches content directory
- [ ] **Fix**: Ensure ID consistency
- [ ] **Verify**: Page loads correctly

---

## 9. Pre-Deployment Checklist

### Final Checks Before Deploy ✅

**CRITICAL GATES:**
- [ ] **Section 6.0 (Source of Truth)**: ALL items checked - No hardcoded content in code
- [ ] **Section 12 (Content-to-Component Mapping)**: ALL items checked - No console errors
- [ ] All content originates from `Content/*.raw.md` files
- [ ] All design specs documented in `PRD/Design/` files
- [ ] No magic values or hardcoded strings in components
- [ ] `lib/data.ts` entries match `Content/Arena/` directories
- [ ] No "Section not found" errors in browser console

**Standard Checks:**
- [ ] All other checklist items above completed
- [ ] Build successful (`npm run build`)
- [ ] No console errors in browser (check all pages)
- [ ] All user flows tested
- [ ] Both languages tested
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Content synced (sync-content run)
- [ ] PRD documentation updated (if design changes)
- [ ] Git commit with descriptive message
- [ ] Push to remote repository
- [ ] Test on staging/production environment

---

## 10. Post-Deployment Verification

### After Deploy ✅

- [ ] Clear browser cache and test
- [ ] Test both language versions
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Check analytics (if applicable)
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Create follow-up tasks for any issues found

---

## 10. Dirty Input Handling & Content Validation

### 10.1 Input Content Quality Checks ✅

Before processing any `.raw.md` file, validate input quality:

- [ ] **Completeness check**
  - [ ] Both English AND Chinese sections present
  - [ ] All required sections exist (Overview, Requirements, etc.)
  - [ ] No empty sections
  - [ ] No placeholder text like "TODO", "TBD", "Coming soon"

- [ ] **Language parity check**
  - [ ] Each English section has corresponding Chinese section
  - [ ] Section counts match between languages
  - [ ] No orphaned content (content in one language only)

- [ ] **Formatting consistency**
  - [ ] Section markers use exact format: `#### English` and `#### 中文`
  - [ ] No inline translation format like `## Title (标题)`
  - [ ] Header levels consistent (H1 → H2 → H3)
  - [ ] List formatting consistent (bullet points or numbered)
  - [ ] Code blocks properly fenced with ```language

### 10.2 Common Dirty Input Scenarios ✅

**Scenario A: Only Chinese Provided / 仅提供中文内容**

- [ ] **Detection 检测**: `#### English` section missing or empty / `#### English` 部分缺失或为空
- [ ] **Action Required 需要的操作**:
  - [ ] DO NOT run sync-content script yet / 暂时不要运行 sync-content 脚本
  - [ ] Ask Claude to translate Chinese content to English / 请 Claude 将中文内容翻译成英文
  - [ ] Add translated `#### English` section to raw file / 将翻译好的 `#### English` 部分添加到 raw 文件
  - [ ] Review translation for accuracy and tone / 审查翻译的准确性和语调
  - [ ] Run sync-content script after translation added / 添加翻译后运行 sync-content 脚本
- [ ] **Validation 验证**:
  - [ ] English content added to raw file / 英文内容已添加到 raw 文件
  - [ ] Translation quality approved by team / 翻译质量获得团队批准
  - [ ] Generated .en.md file is clean and accurate / 生成的 .en.md 文件干净准确

**Scenario B: Only English Provided / 仅提供英文内容**

- [ ] **Detection 检测**: `#### 中文` section missing or empty / `#### 中文` 部分缺失或为空
- [ ] **Action Required 需要的操作**:
  - [ ] DO NOT run sync-content script yet / 暂时不要运行 sync-content 脚本
  - [ ] Ask Claude to translate English content to Chinese / 请 Claude 将英文内容翻译成中文
  - [ ] Add translated `#### 中文` section to raw file / 将翻译好的 `#### 中文` 部分添加到 raw 文件
  - [ ] Review translation for accuracy and tone / 审查翻译的准确性和语调
  - [ ] Run sync-content script after translation added / 添加翻译后运行 sync-content 脚本
- [ ] **Validation 验证**:
  - [ ] Chinese content added to raw file / 中文内容已添加到 raw 文件
  - [ ] Translation quality approved by team / 翻译质量获得团队批准
  - [ ] Generated .zh.md file is clean and accurate / 生成的 .zh.md 文件干净准确

**Scenario C: Mixed Language Headers**

- [ ] **Detection**: Headers like `## Deployment Options 部署选项`
- [ ] **Action Required**:
  - [ ] Separate into two lines in raw file:
    ```markdown
    ## Deployment Options
    ## 部署选项
    ```
  - [ ] Ensure parser will extract correct language
  - [ ] Test with sync-content script
- [ ] **Validation**: Generated files have pure language headers

**Scenario D: Typos and Grammar Issues**

- [ ] **Detection**:
  - [ ] Spell check both languages
  - [ ] Grammar check tools (Grammarly for EN, appropriate tools for ZH)
  - [ ] Manual review for technical terminology consistency
- [ ] **Action Required**:
  - [ ] For minor typos: Fix directly if confident, flag for review if uncertain
  - [ ] For grammar issues: Flag to content team, do not auto-fix
  - [ ] For terminology inconsistency: Document for team decision
- [ ] **Validation**: All changes approved by content team

**Scenario E: Inconsistent Structure**

- [ ] **Detection**:
  - [ ] Section order differs between languages
  - [ ] Different subsection counts
  - [ ] Mismatched formatting (bullets vs numbered)
- [ ] **Action Required**:
  - [ ] Align structure between languages
  - [ ] Use same section order
  - [ ] Match formatting style
  - [ ] Flag to content team if substantive differences are intentional
- [ ] **Validation**: Structure parity achieved

**Scenario F: Code Blocks and Technical Content**

- [ ] **Detection**:
  - [ ] Unfenced code blocks
  - [ ] Missing language specifiers
  - [ ] Malformed markdown tables
  - [ ] Broken internal links
- [ ] **Action Required**:
  - [ ] Add proper fencing: ```language
  - [ ] Fix table formatting
  - [ ] Verify all links resolve
  - [ ] Test code syntax highlighting
- [ ] **Validation**: All technical content renders correctly

### 10.3 Generated File Validation ✅

After running `npm run sync-content`, validate outputs:

- [ ] **File existence check**
  - [ ] `.en.md` file created
  - [ ] `.zh.md` file created
  - [ ] No files skipped or missing
  - [ ] File timestamps updated

- [ ] **Content purity check (CRITICAL)**
  - [ ] Open `.en.md` - verify ONLY English content
    - [ ] No Chinese characters: `/[\u4e00-\u9fa5]/` should match 0 results
    - [ ] No mixed headers
    - [ ] No bilingual section markers
  - [ ] Open `.zh.md` - verify ONLY Chinese content
    - [ ] No English text in body content (technical terms allowed)
    - [ ] No mixed headers
    - [ ] No bilingual section markers

- [ ] **Header validation check**
  - [ ] All headers are single-language
  - [ ] Header levels correct (no skipping H1→H3)
  - [ ] No empty headers
  - [ ] Headers match source content structure

- [ ] **Section marker cleanup check**
  - [ ] No `#### English` markers in output
  - [ ] No `#### 中文` markers in output
  - [ ] Section markers properly stripped
  - [ ] Content flows naturally without artifacts

- [ ] **Markdown rendering test**
  - [ ] Open both files in markdown preview
  - [ ] Verify tables render correctly
  - [ ] Verify code blocks have syntax highlighting
  - [ ] Verify lists display properly
  - [ ] Verify links are clickable
  - [ ] No markdown syntax errors

- [ ] **Character encoding check**
  - [ ] UTF-8 encoding verified
  - [ ] No mojibake (garbled characters)
  - [ ] Chinese characters display correctly
  - [ ] Special characters preserved (em dashes, smart quotes)

### 10.4 Content Reconciliation Process ✅

When discrepancies found between source and generated:

- [ ] **Identify mismatch type**
  - [ ] Parser error (content dropped)
  - [ ] Encoding issue (characters corrupted)
  - [ ] Formatting issue (structure broken)
  - [ ] Translation missing (incomplete input)

- [ ] **Root cause analysis**
  - [ ] Check raw file format
  - [ ] Check parser logic for edge cases
  - [ ] Test with minimal example
  - [ ] Document pattern that caused issue

- [ ] **Fix and verify cycle**
  - [ ] Fix root cause (raw file or parser)
  - [ ] Re-run sync-content
  - [ ] Validate generated files
  - [ ] Repeat until clean

- [ ] **Regression prevention**
  - [ ] Add test case for discovered pattern
  - [ ] Update this checklist with new scenario
  - [ ] Update parser if needed for robustness
  - [ ] Document edge case handling

### 10.5 Pre-Integration Content Review ✅

Before marking content ready for integration:

- [ ] **Human review required for**:
  - [ ] All new arena content
  - [ ] Major content updates (>20% change)
  - [ ] User-facing text (CTAs, navigation labels)
  - [ ] Technical documentation
  - [ ] Claims/statistics (require verification)

- [ ] **Review checklist**:
  - [ ] Content accuracy verified
  - [ ] Translations quality acceptable
  - [ ] Tone and voice consistent
  - [ ] Technical terminology accurate
  - [ ] No sensitive or controversial content
  - [ ] Brand guidelines followed
  - [ ] Formatting follows style guide

- [ ] **Approval workflow**:
  - [ ] Technical review completed
  - [ ] Content review completed
  - [ ] Translation review completed (if applicable)
  - [ ] Stakeholder approval documented
  - [ ] Ready to merge flag set

---

## 11. Independent Proofreader Review

### 11.1 Content & Wording Review ✅

**Review as independent proofreader - identify issues for team confirmation**

- [ ] **Homepage review**
  - [ ] Hero title clarity: "Which AI Actually Works?" - is question format optimal?
  - [ ] Subtitle grammar: "We test them. Recommend only the Best Practice." - missing subject?
  - [ ] CTA button clarity: "Find AI Solutions" vs "Browse Blueprints" - consistency?
  - [ ] Badges accuracy: "Open Source • Verified • Replicable" - all claims verified?

- [ ] **Arena detail page review**
  - [ ] Breadcrumb text: "← Back to Arena List" - should be "Arenas" for consistency with nav?
  - [ ] Tab labels: "Implementation" vs "Implementing" - gerund consistency?
  - [ ] Section headers: Emoji usage (📋 Overview) - professional or too casual?
  - [ ] Gap Analysis CTA: "Contact for expert version" - should be "expert edition"?

- [ ] **Navigation & terminology review**
  - [ ] "Arena" vs "Blueprints" - terminology inconsistency across site
  - [ ] "Framework" page title - unclear what this page offers
  - [ ] "About" vs "About Us" - standard format?
  - [ ] Industry labels: "Manufacturing" vs "Manufacture" - correct form?

- [ ] **Grammar & style consistency**
  - [ ] Oxford comma usage consistent?
  - [ ] Title case vs sentence case in headers consistent?
  - [ ] Email/website capitalization consistent?
  - [ ] Numbers under 10 spelled out? (style guide variance)

- [ ] **Potential issues to flag**
  - [ ] Unclear antecedents in pronouns
  - [ ] Passive voice overuse
  - [ ] Jargon without explanation
  - [ ] Inconsistent terminology for same concept
  - [ ] Ambiguous CTAs

### 11.2 Visual Design Review ✅

**Visual consistency and professional appearance**

- [ ] **Hero sections**
  - [ ] Grid pattern opacity - visibility adequate?
  - [ ] Gradient backgrounds - too subtle or too strong?
  - [ ] Title font size - hierarchy clear on mobile?
  - [ ] White space - breathing room sufficient?

- [ ] **Card designs**
  - [ ] Border radius consistency - 12px vs 16px variance intentional?
  - [ ] Shadow subtlety - hover state too dramatic?
  - [ ] Icon sizing - consistent within and across components?
  - [ ] Card height uniformity - visual alignment issues?

- [ ] **Color usage**
  - [ ] Primary blue (#155EEF) - sufficient contrast on white?
  - [ ] Gray text (#64748B) - readable enough?
  - [ ] Gradient usage - consistent or excessive?
  - [ ] Status badge colors - semantic meaning clear?

- [ ] **Typography**
  - [ ] Font weight hierarchy - clear distinction between levels?
  - [ ] Line height - comfortable reading or too tight/loose?
  - [ ] Letter spacing - any tracking issues?
  - [ ] Font loading - FOUT (Flash of Unstyled Text) issues?

- [ ] **Iconography**
  - [ ] Lucide icon style - consistent across site?
  - [ ] Icon-to-text ratio - balanced?
  - [ ] Icon meaning - universally understood or requires learning?
  - [ ] Stroke width consistency - 2px throughout?

### 11.3 Layout & Spacing Review ✅

**Visual flow and alignment**

- [ ] **Grid systems**
  - [ ] Column gaps - consistent 24px/32px?
  - [ ] Card alignment - proper baseline alignment?
  - [ ] Breakpoint behavior - awkward intermediate states?

- [ ] **Section spacing**
  - [ ] Vertical rhythm - consistent 80-120px sections?
  - [ ] Related elements grouped properly?
  - [ ] Isolated elements - deliberate or error?

- [ ] **Responsive behavior**
  - [ ] Mobile view - cramped or spacious?
  - [ ] Tablet breakpoint - optimal column counts?
  - [ ] Desktop max-width - content too wide at 1400px?

- [ ] **Alignment issues**
  - [ ] Text left-aligned vs centered - rationale consistent?
  - [ ] Button groups - properly aligned?
  - [ ] Form elements - alignment with labels?

### 11.4 Interaction & Animation Review ✅

**User experience refinement**

- [ ] **Hover states**
  - [ ] Transition duration - 200-300ms feels right?
  - [ ] Transform amount - -translate-y-1 too subtle/dramatic?
  - [ ] Shadow increase - appropriate or excessive?
  - [ ] Color shifts - smooth or jarring?

- [ ] **Animations**
  - [ ] Framer Motion timing - natural or rushed?
  - [ ] Stagger delays - noticeable or distracting?
  - [ ] Progress bar fill - 1s duration appropriate?
  - [ ] Page transitions - necessary or distracting?

- [ ] **Loading states**
  - [ ] Skeleton screens - accurate representation of content?
  - [ ] Spinners - size and positioning appropriate?
  - [ ] Perceived performance - adequate feedback?

- [ ] **Interactive elements**
  - [ ] Button press states - visual feedback adequate?
  - [ ] Tab switching - instant transition feels right?
  - [ ] Form feedback - immediate validation delay?

### 11.5 Accessibility Review ✅

**WCAG compliance and usability**

- [ ] **Color contrast**
  - [ ] All text meets 4.5:1 ratio?
  - [ ] Icon-only buttons have adequate contrast?
  - [ ] Focus indicators visible on all backgrounds?
  - [ ] Link color distinguished from text?

- [ ] **Keyboard navigation**
  - [ ] Tab order logical and complete?
  - [ ] Focus traps in modals?
  - [ ] Skip links available?
  - [ ] Enter/Space work for interactive elements?

- [ ] **Screen reader support**
  - [ ] Alt text for all images?
  - [ ] ARIA labels for icon-only buttons?
  - [ ] Semantic HTML maintained?
  - [ ] Live regions for dynamic content?

- [ ] **Cognitive accessibility**
  - [ ] Instructions clear and concise?
  - [ ] Error messages specific and actionable?
  - [ ] Timeouts avoidable or extendable?
  - [ ] Content complexity appropriate?

### 11.6 Cross-Browser & Device Review ✅

**Compatibility verification**

- [ ] **Browser testing**
  - [ ] Chrome - primary target, fully functional?
  - [ ] Firefox - layout/rendering issues?
  - [ ] Safari - iOS-specific issues?
  - [ ] Edge - feature support adequate?

- [ ] **Device testing**
  - [ ] Desktop (1920x1080) - layout optimal?
  - [ ] Laptop (1366x768) - content cramped?
  - [ ] Tablet (iPad) - touch targets adequate?
  - [ ] Mobile (iPhone SE) - minimal viable size?

- [ ] **Network conditions**
  - [ ] 3G - acceptable load time?
  - [ ] 4G - smooth experience?
  - [ ] Offline - any service worker issues?

### 11.7 Content Structure Review ✅

**Information architecture**

- [ ] **Navigation clarity**
  - [ ] Page hierarchy intuitive?
  - [ ] Current location obvious?
  - [ ] Back/forward behavior predictable?
  - [ ] Search functionality discoverable?

- [ ] **Content organization**
  - [ ] Information scannable?
  - [ ] Key messages prominent?
  - [ ] Progressive disclosure effective?
  - [ ] Content chunking appropriate?

- [ ] **User flow**
  - [ ] Call-to-action sequence logical?
  - [ ] Friction points identified?
  - [ ] Decision points clear?
  - [ ] Exit opportunities available?

### 11.8 Proofreader Feedback Format ✅

**Structured feedback for team**

When providing feedback, use this format:

```
## Proofreader Feedback Summary

### Critical Issues (Must Fix)
- [ ] **Issue**: Brief description
  - **Location**: Specific file/line
  - **Impact**: Why this matters
  - **Suggested Fix**: Specific recommendation
  - **Team Decision**: [ ] Approve [ ] Reject [ ] Discuss

### Style Recommendations (Should Consider)
- [ ] **Observation**: What was noticed
  - **Context**: Where and when
  - **Rationale**: Why it matters
  - **Suggestion**: Recommended approach
  - **Team Decision**: [ ] Accept [ ] Decline [ ] Modify

### Enhancement Opportunities (Nice to Have)
- [ ] **Idea**: Potential improvement
  - **Benefit**: Value proposition
  - **Effort**: Estimated work
  - **Team Decision**: [ ] Add to backlog [ ] Reject [ ] Future consideration

### Content Inconsistencies
- [ ] **Type**: Terminology/formatting/grammar
  - **Found**: [example]
  - **Expected**: [example]
  - **Locations**: [list]
  - **Team Decision**: [ ]

### Visual Polish Items
- [ ] **Element**: What needs attention
  - **Current State**: Description
  - **Suggested State**: Description
  - **Priority**: [ ] High [ ] Medium [ ] Low
  - **Team Decision**: [ ]
```

### 11.9 Feedback Delivery Protocol ✅

**How to submit findings**

- [ ] **Complete all technical quality checks first**
  - [ ] All bilingual content validated
  - [ ] All visual specifications met
  - [ ] All functionality working
  - [ ] Only then proceed to proofreader review

- [ ] **Categorize findings by severity**
  - [ ] **Critical**: Blocks release (must fix)
  - [ ] **Important**: Degrades experience (should fix)
  - [ ] **Minor**: Polish item (nice to fix)
  - [ ] **Observation**: Subjective preference

- [ ] **Provide evidence**
  - [ ] Screenshots for visual issues
  - [ ] File paths and line numbers
  - [ ] Browser/device context
  - [ ] Reproduction steps

- [ ] **No auto-fixing**
  - [ ] Document issues only
  - [ ] Wait for team decision
  - [ ] Implement only after approval
  - [ ] Maintain technical quality standards

### 11.10 Team Review Process ✅

**How team should process feedback**

- [ ] **Review batch**
  - [ ] Set dedicated review time
  - [ ] All stakeholders present
  - [ ] Reference PRD/Design docs
  - [ ] Consider user impact

- [ ] **Decision framework**
  - [ ] Critical: Fix immediately
  - [ ] Important: Schedule fix
  - [ ] Minor: Backlog discussion
  - [ ] Observation: Quick consensus

- [ ] **Documentation**
  - [ ] Document all decisions
  - [ ] Update style guides if pattern
  - [ ] Update checklist if new issue type
  - [ ] Close feedback loop with proofreader

---

## 12. Content-to-Component Mapping Verification ✅ **CRITICAL**

> **Purpose**: Ensure all components only reference content sections that exist in markdown files.
>
> **Common Issue**: Console errors like `[getHomepageSectionContent] Section not found: section="Practice Includes Section"`

### 12.1 Section Mapping Consistency ✅

- [ ] **Check component calls match content files**
  - [ ] Review all `getHomepageSectionContent()` calls in components
  - [ ] Verify each section key exists in `HOMEPAGE_SECTION_HEADERS` (lib/content.ts)
  - [ ] Verify each section header exists in corresponding .en.md and .zh.md files
  - [ ] No orphaned section calls (sections called but not defined in content files)

- [ ] **Check HOMEPAGE_SECTION_HEADERS completeness**
  - [ ] All entries in `HOMEPAGE_SECTION_HEADERS` must have:
    - English header matching `homepage.en.md` exactly
    - Chinese header matching `homepage.zh.md` exactly
  - [ ] Remove entries for sections that don't exist in content files
  - [ ] Add entries for any new sections added to content files

- [ ] **Verify section header exact matching**
  - [ ] English: `## Hero Section` must match `HOMEPAGE_SECTION_HEADERS['Hero Section'].en`
  - [ ] Chinese: `## 英雄区` must match `HOMEPAGE_SECTION_HEADERS['Hero Section'].zh`
  - [ ] No trailing spaces in headers
  - [ No case mismatches (e.g., "hero section" vs "Hero Section")

### 12.2 Console Error Detection ✅

- [ ] **Check for Section not found errors**
  - [ ] Open browser DevTools Console
  - [ ] Navigate to all pages (homepage, arena, about, faq, framework)
  - [ ] Look for `[getHomepageSectionContent] Section not found` errors
  - [ ] Look for `[getContentFile] Content file not found` errors

- [ ] **Check for getContent errors**
  - [ ] All `getContentFile()` calls must reference existing directories
  - [ ] Format: `getContentFile('ContentType', 'fileName', locale)`
  - [ ] Verify directory exists: `Content/ContentType/fileName.raw.md`

### 12.3 Unused Code Cleanup ✅

- [ ] **Remove unused component functions**
  - [ ] If a section is removed from content, remove its component function
  - [ ] If a section is removed from content, remove it from JSX
  - [ ] Remove Suspense wrappers for removed sections
  - [ ] Remove parser functions for removed sections

- [ ] **Remove unused imports**
  - [ ] After removing components, check for unused icon imports
  - [ ] Check for unused utility imports
  - [ ] Run `npx tsc --noEmit` to catch unused imports

### 12.4 Automated Verification Commands ✅

```bash
# Find all getHomepageSectionContent calls
grep -r "getHomepageSectionContent" app/ --include="*.tsx" | grep -o "'[^']*'"

# Find all HOMEPAGE_SECTION_HEADERS keys
grep -A 20 "HOMEPAGE_SECTION_HEADERS" lib/content.ts | grep "'" | grep -v "//"

# Find all ## headers in homepage content
grep "^## " Content/Homepage/homepage.en.md
grep "^## " Content/Homepage/homepage.zh.md

# Compare and identify mismatches (manual review required)
```

### 12.5 Common Mapping Errors ✅

**Error 1: Component calls section not in content file**
- [ ] **Detection**: Console shows `Section not found` error
- [ ] **Fix Options**:
  - [ ] Add missing section to content files (.raw.md, run sync-content)
  - [ ] Remove the component call from JSX if section not needed
  - [ ] Remove section from HOMEPAGE_SECTION_HEADERS if not used
- [ ] **Validation**: No console errors on page load

**Error 2: Section header mismatch**
- [ ] **Detection**: Section exists but content returns empty
- [ ] **Fix**:
  - [ ] Check header spelling in content file vs HOMEPAGE_SECTION_HEADERS
  - [ ] Ensure exact match (including spaces, case)
  - [ ] Check for hidden characters (zero-width spaces, etc.)
- [ ] **Validation**: Content displays correctly on page

**Error 3: Orphaned HOMEPAGE_SECTION_HEADERS entries**
- [ ] **Detection**: Entry in HOMEPAGE_SECTION_HEADERS but no component uses it
- [ ] **Fix**: Remove unused entry from HOMEPAGE_SECTION_HEADERS
- [ ] **Validation**: HOMEPAGE_SECTION_HEADERS only contains used sections

**Error 4: Component function exists but not called in JSX**
- [ ] **Detection**: Function defined but never used in return statement
- [ ] **Fix**:
  - [ ] Add component to JSX if needed
  - [ ] Remove function definition if not needed
- [ ] **Validation**: All defined functions are used

### 12.6 Pre-Deployment Mapping Checklist ✅

Before each deployment, verify:

- [ ] No console errors on any page (homepage, arena, about, faq, framework)
- [ ] All sections in HOMEPAGE_SECTION_HEADERS exist in content files
- [ ] All `getHomepageSectionContent()` calls use valid section keys
- [ ] No orphaned component functions or parser functions
- [ ] Build succeeds with `npm run build`
- [ ] Type checking passes with `npx tsc --noEmit`

---

## Appendix: Quick Commands

```bash
# Content sync
npm run sync-content

# Development
npm run dev

# Build
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Format check
npx prettier --check .
```

---

**Checklist Version**: 1.1
**Last Updated**: 2025-01-30
**Maintained By**: RWAI Development Team

---

## Usage Instructions

1. **Before starting work**: Review relevant sections of this checklist
2. **During development**: Reference checklist for patterns and conventions
3. **After completing changes**: Run through entire checklist systematically
4. **Before deployment**: Complete all Pre-Deployment Checklist items
5. **After deployment**: Verify with Post-Deployment Checklist

This checklist is a living document. Update it as new patterns emerge or new issues are discovered.
