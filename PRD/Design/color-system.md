# RWAI Arena - 颜色系统

> 定义网站完整的颜色规范、使用场景和配色方案

---

## 1. 颜色系统概览

### 1.1 颜色层级

```
品牌色（Brand Colors）
├── 主色（Primary）: #155EEF
└── 辅助色（Accent）: #0F4761

语义色（Semantic Colors）
├── 成功（Success）: #10B981
├── 警告（Warning）: #F59E0B
├── 错误（Error）: #EF4444
└── 信息（Info）: #3B82F6

中性色（Neutral Colors）
├── 文本主色: #0F172A
├── 文本次色: #64748B
├── 文本禁用: #94A3B8
├── 背景主色: #FFFFFF
├── 背景次色: #F8FAFC
└── 背景三级: #F1F5F9
```

---

## 2. 品牌色

### 2.1 主色（Primary）

**基础颜色**
```
#155EEF - RGB(21, 94, 239)
```

**使用场景**
- 主按钮背景
- 链接文字
- 强调元素
- 图标（主要交互）
- 导航Active状态

**颜色变体**
```
主色（默认）:  #155EEF
主色（深色）:  #0E4DB8 (Hover状态，加深10-15%)
主色（浅色）:  #EFF6FF (背景色)
主色（超浅）: #DBEAFE (边框、分割线)
```

**Hover和Active状态**
```css
/* Hover */
background: #0E4DB8;
/* Active */
background: #0A3A8F;
/* Focus */
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
```

---

### 2.2 辅助色（Accent）

**基础颜色**
```
#0F4761 - RGB(15, 71, 97)
```

**使用场景**
- 标题
- 副标题
- 重要文本
- 辅助强调元素

**颜色变体**
```
辅助色（默认）:  #0F4761
辅助色（浅色）:  #F0F9FF (背景色)
辅助色（超浅）: #E0F2FE (边框)
```

---

## 3. 语义色

### 3.1 成功色（Success）

**基础颜色**
```
#10B981 - RGB(16, 185, 129)
```

**使用场景**
- 已验证标识
- 正向指标
- 成功状态提示
- 完成状态

**颜色变体**
```
成功色（默认）:    #10B981
成功色（深色）:    #059669
成功色（浅色背景）: #DCFCE7
成功色（超浅背景）: #D1FAE5
```

**应用示例**
```css
/* Verified Badge */
background: #DCFCE7;
color: #166534;
```

---

### 3.2 警告色（Warning）

**基础颜色**
```
#F59E0B - RGB(245, 158, 11)
```

**使用场景**
- 注意事项
- 待验证状态
- Beta标识
- 需要关注的信息

**颜色变体**
```
警告色（默认）:    #F59E0B
警告色（深色）:    #D97706
警告色（浅色背景）: #FEF3C7
警告色（超浅背景）: #FDE68A
```

**应用示例**
```css
/* Beta Badge */
background: #FEF3C7;
color: #92400E;
```

---

### 3.3 错误色（Error）

**基础颜色**
```
#EF4444 - RGB(239, 68, 68)
```

**使用场景**
- 错误提示
- 失败状态
- 删除操作
- 危险操作

**颜色变体**
```
错误色（默认）:    #EF4444
错误色（深色）:    #DC2626
错误色（浅色背景）: #FEE2E2
错误色（超浅背景）: #FECACA
```

**应用示例**
```css
/* Error Input */
border: 2px solid #EF4444;
/* Error Text */
color: #EF4444;
```

---

### 3.4 信息色（Info）

**基础颜色**
```
#3B82F6 - RGB(59, 130, 246)
```

**使用场景**
- 信息提示
- 帮助文本
- 通知消息
- 引导说明

**颜色变体**
```
信息色（默认）:    #3B82F6
信息色（深色）:    #2563EB
信息色（浅色背景）: #DBEAFE
信息色（超浅背景）: #BFDBFE
```

---

## 4. 中性色

### 4.1 文本颜色

**文本主色**
```
#0F172A - RGB(15, 23, 42)
```
- 标题
- 正文
- 重要文本
- 图标（功能性）

**文本次色**
```
#64748B - RGB(100, 116, 139)
```
- 描述文本
- 说明文字
- 次要信息
- 占位符

**文本禁用**
```
#94A3B8 - RGB(148, 163, 184)
```
- 禁用状态
- 不可用元素
- 弱化文本

---

### 4.2 背景颜色

**背景主色**
```
#FFFFFF - RGB(255, 255, 255)
```
- 卡片背景
- 主要内容区
- 输入框背景
- 弹出层背景

**背景次色**
```
#F8FAFC - RGB(248, 250, 252)
```
- Section背景
- 交替背景
- 页面背景（可选）
- 悬停背景

**背景三级**
```
#F1F5F9 - RGB(241, 245, 249)
```
- 页面背景
- 分隔区
- 禁用状态背景
- 骨架屏背景

---

### 4.3 边框和分割线

**边框颜色**
```
#E2E8F0 - RGB(226, 232, 240)
```
- 输入框边框
- 卡片边框
- 表格边框
- 分割线

**边框Hover**
```
#CBD5E1 - RGB(203, 213, 225)
```
- 输入框Focus边框
- 次级按钮Hover边框

---

## 5. 渐变色

### 5.1 主渐变

```css
/* 主渐变 */
background: linear-gradient(135deg, #155EEF 0%, #0F4761 100%);

/* 用途 */
- Hero背景（谨慎使用）
- 特殊按钮
- 强调横幅
- 品牌视觉元素
```

**使用原则**
- 谨慎使用，保持专业性
- 仅用于品牌相关的重点区域
- 避免过度使用影响可读性

---

### 5.2 淡渐变

```css
/* 淡渐变 */
background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);

/* 用途 */
- Section背景
- 创造层次感
- 页面分隔
- 微妙过渡
```

---

## 6. 颜色对比度

### 6.1 对比度标准

**WCAG 2.1 要求**
```
AA级:
- 正常文本（14px+）: 最小 4.5:1
- 大文本（18px+）: 最小 3:1

AAA级:
- 正常文本（14px+）: 推荐 7:1
- 大文本（18px+）: 推荐 4.5:1
```

---

### 6.2 实际对比度值

**文本对比度**
```
白色 (#FFFFFF) on 主色 (#155EEF):
对比度: 4.7:1 ✓ (AA级)

主文本色 (#0F172A) on 白色 (#FFFFFF):
对比度: 16.5:1 ✓✓ (AAA级)

次文本色 (#64748B) on 白色 (#FFFFFF):
对比度: 4.6:1 ✓ (AA级)

成功色 (#166534) on 浅绿 (#DCFCE7):
对比度: 4.8:1 ✓ (AA级)
```

---

### 6.3 对比度检查清单

**确保满足以下对比度要求**

- [ ] 主文本 on 白色背景: ≥ 7:1
- [ ] 次文本 on 白色背景: ≥ 4.5:1
- [ ] 白色文本 on 主色按钮: ≥ 4.5:1
- [ ] 链接文本 on 白色背景: ≥ 4.5:1
- [ ] 图标 on 浅色背景: ≥ 3:1

---

## 7. 颜色使用场景

### 7.1 按钮颜色

**Primary按钮**
```css
background: #155EEF;
color: #FFFFFF;
/* Hover */
background: #0E4DB8;
```

**Secondary按钮**
```css
background: transparent;
border: 2px solid #E2E8F0;
color: #0F172A;
/* Hover */
background: #F8FAFC;
border-color: #CBD5E1;
```

**Ghost按钮**
```css
background: transparent;
color: #155EEF;
/* Hover */
background: #EFF6FF;
```

---

### 7.2 徽章（Badge）颜色

**Verified Badge**
```css
background: #DCFCE7;
color: #166534;
```

**In-Arena Badge**
```css
background: transparent;
border: 1px solid #E2E8F0;
color: #64748B;
```

**Beta Badge**
```css
background: #FEF3C7;
color: #92400E;
```

**行业标签**
```css
background: #EFF6FF;
color: #1E40AF;
```

**类别标签**
```css
background: #F1F5F9;
color: #475569;
```

---

### 7.3 表单元素颜色

**输入框 - 默认**
```css
border: 1px solid #E2E8F0;
background: #FFFFFF;
```

**输入框 - Focus**
```css
border: 2px solid #155EEF;
box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.1);
```

**输入框 - Error**
```css
border: 2px solid #EF4444;
```

**输入框 - Disabled**
```css
background: #F1F5F9;
color: #94A3B8;
```

---

### 7.4 图表颜色

**雷达图**
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
color: #64748B;
font-size: 12px;
```

**柱状图/折线图**
```css
/* 主数据 */
color: #155EEF;

/* 次数据 */
color: #0F4761;

/* 网格 */
color: #E2E8F0;

/* 坐标轴 */
color: #94A3B8;
```

---

## 8. 暗色模式（预留）

**注意**: 当前版本不支持暗色模式，但颜色系统已为将来扩展预留。

**建议的暗色模式颜色**
```
背景主色: #0F172A
背景次色: #1E293B
文本主色: #F1F5F9
文本次色: #94A3B8
```

---

## 9. 颜色使用原则

### 9.1 使用原则

**主色控制**
- 主色不要超过整个页面的 20-30%
- 用于引导用户注意力
- 保持品牌一致性

**语义色明确**
- 成功、警告、错误有明确含义
- 不要混用
- 保持语义一致性

**中性色平衡**
- 大量使用中性色作为背景和文本
- 提供视觉休息
- 突出重点内容

---

### 9.2 避免使用

**颜色禁忌**
- 过于鲜艳的颜色（纯红、纯绿等）
- 过多渐变色（保持简洁）
- 低对比度配色（影响可读性）
- 随意混用色相（保持色系统一）

**特殊情况**
- 仅在明确需要时使用亮色强调
- 谨慎使用彩虹色（多用于庆祝）
- 避免使用霓虹色

---

## 10. Tailwind配置示例

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // 品牌色
        primary: {
          DEFAULT: '#155EEF',
          dark: '#0E4DB8',
          light: '#EFF6FF',
        },
        accent: {
          DEFAULT: '#0F4761',
          light: '#F0F9FF',
        },

        // 语义色
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#DBEAFE',
        },

        // 中性色
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          disabled: '#94A3B8',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1',
        },

        // 渐变
        gradient: {
          primary: 'linear-gradient(135deg, #155EEF 0%, #0F4761 100%)',
          subtle: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        },
      },
    },
  },
};
```

---

**文档版本**: 1.0
**最后更新**: 2025-01-28
**维护者**: RWAI Design Team
