# RWAI Arena - 组件库规范

> 定义所有UI组件的设计规范和使用指南

---

## 1. 按钮组件（Button）

### 1.1 按钮变体

**Primary（主按钮）**
```css
background: #155EEF;
color: #FFFFFF;
border: none;
border-radius: 6-8px;
height: 44-48px;
padding: 12-24px;
font-weight: 600;
font-size: 14-16px;

/* Hover */
background: #0E4DB8;
transform: translateY(-1px);

/* Active */
background: #0A3A8F;
transform: translateY(0);

/* Focus */
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
```

**使用场景**
- 主要CTA（Call to Action）
- 提交表单
- 确认操作
- Hero区主按钮

---

**Secondary（次级按钮/Outline）**
```css
background: transparent;
color: #0F172A;
border: 2px solid #E2E8F0;
border-radius: 6-8px;
height: 44-48px;
padding: 12-24px;
font-weight: 500-600;
font-size: 14-16px;

/* Hover */
background: #F8FAFC;
border-color: #CBD5E1;

/* Active */
background: #F1F5F9;

/* Focus */
border-color: #155EEF;
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
```

**使用场景**
- 次要操作
- 取消操作
- 返回按钮
- Hero区次按钮

---

**Ghost（幽灵按钮）**
```css
background: transparent;
color: #155EEF;
border: none;
border-radius: 6-8px;
height: 44-48px;
padding: 12-24px;
font-weight: 500;
font-size: 14-16px;

/* Hover */
background: #EFF6FF;

/* Active */
background: #DBEAFE;

/* Focus */
background: #EFF6FF;
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
```

**使用场景**
- 低优先级操作
- 导航操作
- 筛选器
- 语言切换

---

**Text Button（文字按钮）**
```css
background: transparent;
color: #155EEF;
border: none;
border-radius: 4px;
height: auto;
padding: 8px 0;
font-weight: 500;
font-size: inherit;

/* Hover */
text-decoration: underline;
color: #0E4DB8;

/* Active */
color: #0A3A8F;

/* Focus */
outline: 2px solid #155EEF;
outline-offset: 2px;
```

**使用场景**
- 行内操作
- 链接式按钮
- 卡片内操作
- "查看详情"链接

---

### 1.2 按钮尺寸

**Large（大按钮）**
```css
height: 52-56px;
padding: 16-32px;
font-size: 16-18px;
border-radius: 8px;
```
**用途**: Hero区CTA、重要操作

---

**Default（标准按钮）**
```css
height: 44-48px;
padding: 12-24px;
font-size: 14-16px;
border-radius: 6-8px;
```
**用途**: 通用操作、表单提交

---

**Small（小按钮）**
```css
height: 32-36px;
padding: 8-16px;
font-size: 13-14px;
border-radius: 6px;
```
**用途**: 卡片内操作、表格操作

---

### 1.3 按钮状态

**Disabled状态**
```css
opacity: 0.5-0.6;
cursor: not-allowed;
pointer-events: none;
background: #E2E8F0; /* Primary按钮 */
color: #94A3B8;
```

---

**Loading状态**
```css
position: relative;
color: transparent; /* 隐藏文字 */
pointer-events: none;

/* Spinner */
&::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #FFFFFF;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

**Icon Button（图标按钮）**
```css
/* 仅图标 */
width: 40-44px;
height: 40-44px;
padding: 0;
display: flex;
align-items: center;
justify-content: center;

/* 图标 + 文字 */
gap: 8px;

/* 图标尺寸 */
icon-size: 18-20px;
```

---

## 2. 徽章组件（Badge）

### 2.1 状态徽章

**Verified（已验证）**
```css
background: #DCFCE7;
color: #166534;
padding: 4px 12px;
border-radius: 12-16px; /* pill形状 */
font-size: 12px;
font-weight: 500;
display: inline-flex;
align-items: center;
gap: 4px;

/* 图标 */
&::before {
  content: '✓';
  font-weight: 700;
}
```

---

**In-Arena（竞技中）**
```css
background: transparent;
color: #64748B;
border: 1px solid #E2E8F0;
padding: 4px 12px;
border-radius: 12-16px;
font-size: 12px;
font-weight: 500;
```

---

**Beta（测试版）**
```css
background: #FEF3C7;
color: #92400E;
padding: 4px 12px;
border-radius: 12-16px;
font-size: 12px;
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.05em;
```

---

### 2.2 标签徽章

**行业标签（Finance, Retail等）**
```css
background: #EFF6FF;
color: #1E40AF;
padding: 4px 10px;
border-radius: 6-8px;
font-size: 12px;
font-weight: 500;
```

---

**类别标签（Service, Management等）**
```css
background: #F1F5F9;
color: #475569;
padding: 4px 10px;
border-radius: 6-8px;
font-size: 12px;
font-weight: 500;
```

---

**Dot Badge（点徽章）**
```css
/* 状态指示点 */
width: 8px;
height: 8px;
border-radius: 50%;
background: #10B981; /* 成功绿 */

/* 在线状态 */
&.online { background: #10B981; }
/* 离线状态 */
&.offline { background: #94A3B8; }
/* 忙碌状态 */
&.busy { background: #F59E0B; }
```

---

## 3. 卡片组件（Card）

### 3.1 Arena/Blueprint卡片

**基础样式**
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 12-16px;
padding: 24px;
min-height: 280-320px;
width: 100%;
display: flex;
flex-direction: column;
gap: 16px;

/* Hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
transform: translateY(-4px);
transition: all 0.2s ease-out;

/* Focus */
outline: 2px solid #155EEF;
outline-offset: 2px;
```

**卡片结构**
```
┌────────────────────────────────────────┐
│ [✓Verified]           [小雷达图]       │
│                                        │
│ NL2SQL Financial Report Generation     │
│ [Finance] [Service]                    │
│                                        │
│ Generate financial reports from...     │
│                                        │
│ ⭐ 95%  ⚡ 88%  💰 92%  🔒 90%        │
│                                        │
│ ⭐ 1,234  🍴 56                       │
│                                        │
│ [View Details →]                       │
└────────────────────────────────────────┘
```

**卡片元素**

1. **验证徽章**
```css
position: absolute;
top: 16px;
left: 16px;
/* 使用Verified徽章样式 */
```

2. **雷达图**
```css
position: absolute;
top: 16px;
right: 16px;
width: 80-100px;
height: 80-100px;
```

3. **标题**
```css
font-size: 18-20px;
font-weight: 600;
color: #0F172A;
line-height: 1.3;
max-lines: 2;
overflow: hidden;
text-overflow: ellipsis;
```

4. **标签组**
```css
display: flex;
gap: 8px;
flex-wrap: wrap;
```

5. **描述**
```css
font-size: 14px;
font-weight: 400;
color: #64748B;
line-height: 1.5;
max-lines: 2-3;
overflow: hidden;
```

6. **指标**
```css
display: flex;
gap: 12-16px;
font-size: 14px;
color: #64748B;

/* 单个指标 */
.metric {
  display: flex;
  align-items: center;
  gap: 4px;
}
```

7. **GitHub数据**
```css
display: flex;
gap: 16px;
font-size: 13px;
color: #64748B;

/* 单个数据 */
.github-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}
```

8. **链接按钮**
```css
color: #155EEF;
font-weight: 500;
text-decoration: none;
display: inline-flex;
align-items: center;
gap: 4px;

&:hover {
  text-decoration: underline;
}
```

---

### 3.2 行业/类别卡片

**基础样式**
```css
background: #F8FAFC;
border: 1px solid transparent;
border-radius: 12-16px;
padding: 24px;
height: 120-160px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 12px;
text-align: center;
transition: all 0.2s ease-out;

/* Hover */
background: #EFF6FF;
border-color: #155EEF;
transform: translateY(-2px);

/* 图标 */
.icon {
  width: 48-56px;
  height: 48-56px;
  color: #155EEF;
  transition: transform 0.2s ease;
}

&:hover .icon {
  transform: scale(1.1);
}
```

**卡片元素**
- **图标**: 48-56px，主色
- **标题**: 18-20px，字重600
- **描述**: 14px，次要文本色

---

### 3.3 内容卡片

**基础样式**
```css
background: #FFFFFF;
border-radius: 12-16px;
padding: 24-32px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* 可选边框 */
border: 1px solid #E2E8F0;
```

**使用场景**
- 案例研究卡片
- 特性卡片
- 信息卡片
- 步骤卡片

---

## 4. 输入组件（Input）

### 4.1 文本输入框

**默认状态**
```css
width: 100%;
height: 44px;
padding: 0 16px;
border: 1px solid #E2E8F0;
border-radius: 6-8px;
background: #FFFFFF;
font-size: 14-16px;
color: #0F172A;
transition: all 0.2s ease;

/* Placeholder */
&::placeholder {
  color: #94A3B8;
}
```

---

**Focus状态**
```css
border: 2px solid #155EEF;
outline: none;
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
padding: 0 15px; /* 补偿2px边框 */
```

---

**Error状态**
```css
border: 2px solid #EF4444;
padding: 0 15px;

/* 错误文字 */
.error-text {
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
}
```

---

**Disabled状态**
```css
background: #F1F5F9;
color: #94A3B8;
cursor: not-allowed;
border-color: #E2E8F0;
```

---

### 4.2 下拉选择

**基础样式**
```css
/* 与输入框相同 */
width: 100%;
height: 44px;
padding: 0 16px;
border: 1px solid #E2E8F0;
border-radius: 6-8px;
background: #FFFFFF;
font-size: 14-16px;
color: #0F172A;
appearance: none;
background-image: url('data:image/svg+xml;...');
background-repeat: no-repeat;
background-position: right 12px center;
padding-right: 40px;
```

**下拉选项**
```css
option {
  padding: 8px 16px;
}

/* Hover背景 */
option:hover {
  background: #F8FAFC;
}

/* 选中项 */
option:checked {
  background: #EFF6FF;
  color: #155EEF;
  font-weight: 500;
}
```

---

### 4.3 复选框/单选框

**未选中状态**
```css
width: 18px;
height: 18px;
border: 2px solid #E2E8F0;
border-radius: 4px; /* 复选框 */
/* 或 */
border-radius: 50%; /* 单选框 */
background: #FFFFFF;
cursor: pointer;
transition: all 0.2s ease;

/* Focus */
&:focus {
  border-color: #155EEF;
  box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
}
```

---

**选中状态**
```css
background: #155EEF;
border-color: #155EEF;
background-image: url('checkmark-icon.svg');
background-position: center;
background-repeat: no-repeat;
```

---

## 5. 导航组件

### 5.1 顶部导航栏

**布局结构**
```
┌────────────────────────────────────────────────────┐
│ [Logo]  [Arena]  [Framework]  [FAQ]  [About]      │
│                                    [EN|ZH] [GitHub]│
└────────────────────────────────────────────────────┘
```

**样式规范**
```css
/* 导航栏容器 */
.navbar {
  height: 64-72px;
  background: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;

  /* 固定顶部 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Logo */
.logo {
  font-size: 20-24px;
  font-weight: 700;
  color: #155EEF;
  text-decoration: none;
}

/* 导航链接 */
.nav-links {
  display: flex;
  gap: 24-32px;
}

.nav-link {
  font-size: 14-16px;
  font-weight: 500;
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0F172A;
  }

  &.active {
    color: #155EEF;
  }
}

/* 右侧按钮组 */
.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
```

---

### 5.2 面包屑导航

**样式**
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13-14px;
  padding: 16px 0;
}

.breadcrumb-item {
  color: #64748B;
  text-decoration: none;

  &:hover {
    color: #155EEF;
  }

  &.active {
    color: #0F172A;
    font-weight: 600;
  }
}

.breadcrumb-separator {
  color: #94A3B8;
}
```

**示例**
```
Home > Arena > NL2SQL Financial Reports
```

---

## 6. 反馈组件

### 6.1 Alert提示

**Success**
```css
background: #DCFCE7;
border: 1px solid #10B981;
border-radius: 8px;
padding: 12-16px;
display: flex;
gap: 12px;
align-items: flex-start;

.icon {
  color: #10B981;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.title {
  font-weight: 600;
  color: #166534;
  margin-bottom: 4px;
}

.message {
  color: #166534;
  font-size: 14px;
}
```

---

**Error**
```css
background: #FEE2E2;
border: 1px solid #EF4444;

.icon { color: #EF4444; }
.title, .message { color: #991B1B; }
```

---

**Warning**
```css
background: #FEF3C7;
border: 1px solid #F59E0B;

.icon { color: #F59E0B; }
.title, .message { color: #92400E; }
```

---

**Info**
```css
background: #DBEAFE;
border: 1px solid #3B82F6;

.icon { color: #3B82F6; }
.title, .message { color: #1E40AF; }
```

---

### 6.2 Toast通知

**样式**
```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  min-width: 320px;
  max-width: 480px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 7. 数据展示组件

### 7.1 雷达图（Radar Chart）

**尺寸规范**
```css
/* 卡片内 */
.radar-chart.small {
  width: 80-100px;
  height: 80-100px;
}

/* 详情页 */
.radar-chart.large {
  width: 200-300px;
  height: 200-300px;
}
```

**颜色规范**
```css
/* 数据区域填充 */
fill: rgba(21, 94, 239, 0.2);

/* 数据线条 */
stroke: #155EEF;
stroke-width: 2-3px;

/* 网格线 */
stroke: #E2E8F0;
stroke-width: 1px;

/* 标签文字 */
fill: #64748B;
font-size: 12px;
```

**交互**
```css
/* Hover tooltip */
.tooltip {
  background: #0F172A;
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
}
```

---

### 7.2 统计卡片

**样式**
```css
.stat-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8-12px;
  padding: 16-20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

.value {
  font-size: 32-48px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1;
}

.change {
  font-size: 12-14px;
  font-weight: 500;

  &.positive {
    color: #10B981;
  }

  &.negative {
    color: #EF4444;
  }
}
```

---

## 8. 加载状态组件

### 8.1 Skeleton骨架屏

**样式**
```css
.skeleton {
  background: #F1F5F9;
  border-radius: 4-8px;
  position: relative;
  overflow: hidden;

  /* Shimmer动画 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

---

### 8.2 Spinner加载图标

**样式**
```css
.spinner {
  width: 24-32px;
  height: 24-32px;
  border: 3px solid #E2E8F0;
  border-top-color: #155EEF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 9. 分页组件

**样式**
```css
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pagination-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E2E8F0;
  border-radius: 6-8px;
  background: #FFFFFF;
  color: #0F172A;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover:not(.active) {
    border-color: #CBD5E1;
    background: #F8FAFC;
  }

  &.active {
    background: #155EEF;
    border-color: #155EEF;
    color: #FFFFFF;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
```

---

## 10. Arena详情页专用组件

### 10.1 Hero Section组件

**ArenaHero（竞技场详情英雄区）**

```tsx
<ArenaHero
  title="Intelligent Research & Report Generation System"
  description="Achieves 51.86 score (#2 globally) with 95% labor reduction"
  status="verified"
  metrics={{
    quality: 95,
    efficiency: 88,
    cost: 92,
    trust: 90
  }}
  cta={[
    { label: "View on GitHub", href: "...", icon: GitHub },
    { label: "Contact Expert", href: "...", icon: Mail }
  ]}
/>
```

**样式规范**:
- 背景: `bg-gradient-to-br from-slate-50 via-white to-primary-50/30`
- 网格图案: 使用CSS background-image或SVG
- 内边距: `py-16 sm:py-24 px-4 sm:px-6 lg:px-8`
- 最大宽度容器: `mx-auto max-w-7xl`

**Breadcrumb**:
- 样式: `inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900`
- 图标: ArrowLeft (h-4 w-4)
- 文本: "← Back to Arena List"

**Status Badge**:
- Verified: `bg-amber-50 text-amber-700 ring-amber-600/20`
- In Arena: `bg-blue-50 text-blue-700 ring-blue-600/20`
- 样式: `inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset`

---

### 10.2 4-Pillar Metrics组件

**PillarMetrics（四维指标）**

```tsx
<PillarMetrics
  metrics={[
    { name: 'Quality', value: 95, icon: Star },
    { name: 'Efficiency', value: 88, icon: Zap },
    { name: 'Cost', value: 92, icon: DollarSign },
    { name: 'Trust', value: 90, icon: Shield }
  ]}
/>
```

**布局**:
- 容器: `grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6`
- 每个指标卡片: `flex flex-col items-center p-4 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-sm`

**指标显示**:
- 百分比数值: `text-3xl sm:text-4xl font-bold text-gray-900`
- 进度条容器: `w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3`
- 进度条填充: `bg-primary h-full rounded-full transition-all duration-500`
- 标签文本: `text-sm font-medium text-gray-600 mt-2`
- 图标: `h-5 w-5 text-primary mb-2`

**动画**:
- 初始加载: staggered fade-in (Framer Motion)
- 进度条: 从0%到实际值的动画

---

### 10.3 Sticky Tab Navigation组件

**ArenaTabs（竞技场标签导航）**

```tsx
<ArenaTabs
  tabs={[
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'implementation', label: 'Implementation', icon: Settings, color: 'purple' },
    { key: 'requirements', label: 'Requirements', icon: CheckCircle2, color: 'green' },
    { key: 'validation', label: 'Validation', icon: BarChart3, color: 'amber' },
    { key: 'project', label: 'Project', icon: Users, color: 'red' }
  ]}
  activeTab="overview"
  onTabChange={(tab) => setActiveTab(tab)}
/>
```

**样式规范**:
- 容器: `sticky top-16 z-40 bg-white border-b shadow-sm`
- 内边距: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Tabs容器: `flex items-center gap-1 overflow-x-auto py-0`

**Tab样式**:
- 基础: `group relative flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer`
- 活跃状态:
  - 边框: `border-primary`
  - 背景: `bg-gradient-to-r from-primary-50 to-transparent`
  - 文本: `text-gray-900`
- 非活跃状态:
  - 边框: `border-transparent`
  - 文本: `text-gray-600`
  - Hover: `hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900`

**颜色编码**:
- Implementation (紫色): `text-purple-600`, `border-purple-600`
- Requirements (绿色): `text-green-600`, `border-green-600`
- Validation (琥珀色): `text-amber-600`, `border-amber-600`
- Project (红色): `text-red-600`, `border-red-600`

**图标**:
- 尺寸: `h-4 w-4`
- 颜色: 继承文本颜色

---

### 10.4 Content Section组件

**ContentSection（内容区域）**

```tsx
<ContentSection
  title="Overview"
  content={markdownContent}
  locale="en"
/>
```

**样式规范**:
- 容器: `mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12`
- 标题: 由markdown渲染，自定义样式
- 内容: 使用ReactMarkdown + remark/rehype插件

**Markdown组件样式**:
- **H1**: `text-4xl font-extrabold text-gray-900 mb-4 mt-12 first:mt-0`
- **H2**: `text-3xl font-extrabold text-gray-900 mb-3 mt-12`
- **H3**: `text-2xl font-bold text-gray-900 mb-2 mt-8`
- **P**: `mb-4 text-gray-700 leading-relaxed`
- **Strong**: `font-bold text-gray-900`
- **A**: `text-blue-600 hover:text-blue-700 underline font-medium`
- **UL/OL**: `space-y-2 mb-6 list-inside`
- **LI**: `leading-relaxed`
- **Table容器**: `my-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm`
- **Table**: `min-w-full divide-y divide-gray-200`
- **Thead**: `bg-gray-50`
- **Th**: `px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider`
- **Td**: `px-6 py-4 text-sm text-gray-700 whitespace-nowrap`
- **Blockquote**: `border-l-4 border-blue-600 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r`
- **Code**: `bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono border border-gray-300`
- **Pre**: `bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6`

---

### 10.5 Sidebar Cards组件

**GapAnalysisCard（差距分析卡片）**

```tsx
<GapAnalysisCard
  title="Gap Analysis"
  features={[
    { name: 'Feature 1', hasStandard: true, hasExpert: true },
    { name: 'Feature 2', hasStandard: false, hasExpert: true },
    { name: 'Feature 3', hasStandard: true, hasExpert: true }
  ]}
  standardCoverage={65}
  ctaText="Contact for expert version"
  onCtaClick={() => {}}
/>
```

**样式规范**:
- 容器: `rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm`
- 标题区:
  - 图标容器: `inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3`
  - 标题: `text-lg font-semibold text-gray-900`
  - 描述: `text-sm text-gray-600 mb-4`

- 功能对比:
  - 容器: `space-y-3`
  - 每项: `flex items-center justify-between py-2`
  - 功能名: `text-sm font-medium text-gray-700`
  - 状态图标:
    - ✓ (有): `text-green-600 bg-green-100 rounded-full p-1`
    - ✗ (无): `text-gray-400 bg-gray-100 rounded-full p-1`

- 覆盖率进度条:
  - 标签: `text-xs font-medium text-gray-600 mb-1`
  - 容器: `w-full h-2 bg-gray-200 rounded-full overflow-hidden`
  - 填充: `bg-primary h-full rounded-full transition-all`

- CTA按钮:
  - 样式: `w-full mt-4 inline-flex items-center justify-center rounded-lg border-2 border-primary bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-50`

**TechnicalDetailsCard（技术细节卡片）**

```tsx
<TechnicalDetailsCard
  techStack={['Next.js', 'TypeScript', 'Tailwind', 'Claude API']}
  teamSize="3-5 developers"
  documentationLinks={[
    { title: 'API Docs', href: '...' },
    { title: 'Architecture', href: '...' }
  ]}
/>
```

**样式规范**:
- 容器: 同GapAnalysisCard
- 技术栈标签:
  - 容器: `flex flex-wrap gap-2`
  - 标签: `inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700`
- 团队信息:
  - 容器: `mt-4 pt-4 border-t border-gray-200`
  - 标签: `text-sm font-medium text-gray-900`
  - 值: `text-sm text-gray-600`
- 文档链接:
  - 列表: `mt-4 space-y-2`
  - 链接: `flex items-center gap-2 text-sm text-primary hover:text-primary-700`

---

### 10.6 Animation组件

**使用Framer Motion添加动画效果**

```tsx
import { motion } from 'framer-motion';

// Hero区动画
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// 4-Pillar指标动画
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }}
>

// 内容切换动画
<motion.div
  key={activeTab}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  transition={{ duration: 0.3 }}
>

// 进度条动画
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${value}%` }}
  transition={{ duration: 1, ease: 'easeOut' }}
>
```

---

### 10.7 Responsive Behavior

**断点适配**:

- **xs (< 640px)**:
  - Hero: 单列，减少内边距
  - 4-Pillar: 2列网格
  - Tabs: 水平滚动
  - Main grid: 单列
  - Sidebar: 隐藏或移到底部

- **sm (640-768px)**:
  - 4-Pillar: 4列或2列（根据空间）
  - Main grid: 单列
  - Sidebar: 底部堆叠

- **md (768-1024px)**:
  - 4-Pillar: 4列
  - Main grid: 单列
  - Sidebar: 右侧，全宽

- **lg (1024px+)**:
  - 完整布局
  - Main grid: 3列 (2:1比例)
  - Sidebar: 右侧

---

**文档版本**: 1.1
**最后更新**: 2025-01-29
**维护者**: RWAI Design Team
