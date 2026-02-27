# RWAI Arena - 排版系统

> 定义网站的字体规范、字号层级和文本样式

---

## 1. 字体家族

### 1.1 无衬线字体（Sans-serif）

**主要字体**
```css
/* 英文 */
font-family: 'Manrope', system-ui, -apple-system, sans-serif;

/* 中文 */
font-family: 'Noto Sans SC', system-ui, -apple-system, sans-serif;

/* 组合使用 */
font-family: 'Manrope', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
```

**使用场景**
- 页面标题
- 正文文本
- 导航菜单
- 按钮文字
- UI文本

**字体权重**
- 300 (Light) - 很少使用
- 400 (Regular) - 正文
- 500 (Medium) - 导航、小标题
- 600 (SemiBold) - 卡片标题、按钮
- 700 (Bold) - 页面标题、Section标题

---

### 1.2 等宽字体（Monospace）

**主要字体**
```css
font-family: 'IBM Plex Mono', 'Courier New', monospace;
```

**使用场景**
- 代码展示
- 数据显示
- 技术指标
- 命令行文本

**字体权重**
- 400 (Regular) - 主要使用
- 500 (Medium) - 代码高亮
- 600 (SemiBold) - 强调

---

### 1.3 代码字体（可选）

**字体选择**
```css
/* Fira Code（推荐） */
font-family: 'Fira Code', 'IBM Plex Mono', monospace;

/* JetBrains Mono（备选） */
font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
```

**使用场景**
- 代码块
- 技术文档
- API示例

**特性**
- 连字支持（ligatures）
- 清晰的字符区分
- 优化代码阅读

---

## 2. 字号层级

### 2.1 标题字号

**H1 - 页面主标题**
```css
font-size: 48-64px;  /* 桌面 */
font-size: 32-40px;  /* 移动 */
font-weight: 700;
line-height: 1.1-1.2;
letter-spacing: -0.02em;
```

**使用场景**
- 首页Hero标题
- 页面主标题
- 重要Section标题

---

**H2 - Section标题**
```css
font-size: 36-48px;  /* 桌面 */
font-size: 28-36px;  /* 移动 */
font-weight: 700;
line-height: 1.2-1.3;
letter-spacing: -0.01em;
```

**使用场景**
- Section标题
- 重要区块标题
- 大型卡片标题

---

**H3 - 卡片标题**
```css
font-size: 24-32px;  /* 桌面 */
font-size: 20-24px;  /* 移动 */
font-weight: 600;
line-height: 1.3;
letter-spacing: 0;
```

**使用场景**
- Arena卡片标题
- 子区块标题
- 中型卡片标题

---

**H4 - 小标题**
```css
font-size: 18-20px;  /* 桌面 */
font-size: 16-18px;  /* 移动 */
font-weight: 600;
line-height: 1.4;
letter-spacing: 0;
```

**使用场景**
- 小区块标题
- 特性标题
- 列表标题

---

### 2.2 正文字号

**Body Large - 重要正文**
```css
font-size: 18px;
font-weight: 400-500;
line-height: 1.6;
letter-spacing: 0;
```

**使用场景**
- 重要描述
- 引言文本
- 强调段落

---

**Body - 标准正文**
```css
font-size: 16px;
font-weight: 400;
line-height: 1.6;
letter-spacing: 0;
```

**使用场景**
- 正文内容
- 描述文本
- 标准段落

---

**Body Small - 次要文本**
```css
font-size: 14px;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0;
```

**使用场景**
- 次要描述
- 说明文字
- 卡片描述

---

**Caption - 说明文本**
```css
font-size: 12px;
font-weight: 400-500;
line-height: 1.4;
letter-spacing: 0;
```

**使用场景**
- 图注
- 标签
- 元数据
- 版权信息

---

## 3. 文本样式

### 3.1 段落间距

**标准间距**
```css
/* 段落之间 */
margin-bottom: 16-24px;

/* 标题与段落 */
margin-top: 12-16px;
margin-bottom: 16-24px;

/* 列表项间距 */
margin-bottom: 8-12px;
```

---

### 3.2 文本颜色

**主要文本**
```css
color: #0F172A;
```
- 标题
- 正文
- 重要文本

**次要文本**
```css
color: #64748B;
```
- 描述
- 说明
- 次要信息

**禁用文本**
```css
color: #94A3B8;
```
- 禁用状态
- 占位符

**链接文本**
```css
color: #155EEF;
text-decoration: none;

/* Hover */
color: #0E4DB8;
text-decoration: underline; /* 可选 */
```

---

### 3.3 文本对齐

**对齐规则**
```css
/* 正文 */
text-align: left;

/* 标题 */
text-align: left; /* 或 center，根据设计 */

/* Hero区 */
text-align: center;

/* 引用 */
text-align: left; /* 带左边框 */
```

---

### 3.4 文本装饰

**重点文本**
```css
/* 加粗 */
font-weight: 600;

/* 或使用主色 */
color: #155EEF;
font-weight: 500;
```

**链接样式**
```css
/* 下划线 */
text-decoration: underline;

/* 或仅颜色 */
text-decoration: none;
color: #155EEF;
```

**引用样式**
```css
border-left: 4px solid #155EEF;
padding-left: 16px;
background: #F8FAFC;
color: #64748B;
font-style: italic;
```

---

## 4. 特殊文本样式

### 4.1 代码文本

**行内代码**
```css
font-family: 'IBM Plex Mono', monospace;
font-size: 0.9em; /* 相对于父元素 */
background: #F1F5F9;
padding: 2px 6px;
border-radius: 4px;
color: #0F4761;
```

**代码块**
```css
font-family: 'Fira Code', 'IBM Plex Mono', monospace;
font-size: 14px;
line-height: 1.6;
background: #1E293B;
color: #F1F5F9;
padding: 16-24px;
border-radius: 8px;
overflow-x: auto;
```

---

### 4.2 链接样式

**内部链接**
```css
color: #155EEF;
text-decoration: none;
font-weight: 500;

&:hover {
  color: #0E4DB8;
  text-decoration: underline;
}
```

**外部链接**
```css
color: #155EEF;
text-decoration: none;
font-weight: 500;

&:hover {
  color: #0E4DB8;
  text-decoration: underline;
}

/* 可选：添加外部链接图标 */
&::after {
  content: '→';
  margin-left: 4px;
}
```

---

### 4.3 列表样式

**无序列表**
```css
ul {
  padding-left: 24px;
  margin-bottom: 16px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 列表标记 */
li::marker {
  color: #155EEF;
  font-size: 1.2em;
}
```

**有序列表**
```css
ol {
  padding-left: 24px;
  margin-bottom: 16px;
  counter-reset: item;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 数字样式 */
li::marker {
  color: #0F4761;
  font-weight: 600;
}
```

---

### 4.4 引用样式

**块引用**
```css
blockquote {
  border-left: 4px solid #155EEF;
  padding: 16px 24px;
  margin: 24px 0;
  background: #F8FAFC;
  color: #64748B;
  font-style: italic;
  font-size: 18px;
  line-height: 1.6;
  border-radius: 0 8px 8px 0;
}

/* 引用来源 */
blockquote cite {
  display: block;
  margin-top: 12px;
  font-size: 14px;
  color: #94A3B8;
  font-style: normal;
}
```

---

## 5. 响应式排版

### 5.1 移动端适配

**字号缩放**
```css
/* H1: 48px → 32px */
font-size: clamp(32px, 5vw, 48px);

/* H2: 36px → 28px */
font-size: clamp(28px, 4vw, 36px);

/* H3: 24px → 20px */
font-size: clamp(20px, 3vw, 24px);
```

**行高调整**
```css
/* 移动端增加行高 */
@media (max-width: 768px) {
  line-height: 1.4; /* 标题 */
  line-height: 1.7; /* 正文 */
}
```

---

### 5.2 字间距调整

**字间距规则**
```css
/* 大标题：负字间距 */
letter-spacing: -0.02em; /* H1 */

/* 中等标题：零或负字间距 */
letter-spacing: -0.01em; /* H2 */

/* 小标题：零字间距 */
letter-spacing: 0; /* H3-H4 */

/* 正文：零字间距 */
letter-spacing: 0; /* Body */

/* 大写文本：正字间距 */
letter-spacing: 0.05em; /* Uppercase labels */
```

---

## 6. 文本长度限制

### 6.1 最大宽度

**文本容器**
```css
/* 标准文本 */
max-width: 65-75ch; /* 字符数 */

/* 窄文本 */
max-width: 45-55ch;

/* 宽文本 */
max-width: 85-95ch;
```

**应用场景**
- 正文段落: 65-75ch
- 引用: 55-65ch
- 说明文字: 45-55ch

---

### 6.2 文本截断

**单行截断**
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

**多行截断**
```css
display: -webkit-box;
-webkit-line-clamp: 2; /* 行数 */
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
```

---

## 7. Tailwind配置示例

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Manrope',
          'Noto Sans SC',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          'IBM Plex Mono',
          'Courier New',
          'monospace',
        ],
        code: [
          'Fira Code',
          'IBM Plex Mono',
          'monospace',
        ],
      },
      fontSize: {
        'hero': [
          '64px',
          { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }
        ],
        'h1': [
          '48px',
          { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }
        ],
        'h2': [
          '36px',
          { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }
        ],
        'h3': [
          '24px',
          { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0' }
        ],
        'h4': [
          '18px',
          { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0' }
        ],
        'body-lg': [
          '18px',
          { lineHeight: '1.6', fontWeight: '400' }
        ],
        'body': [
          '16px',
          { lineHeight: '1.6', fontWeight: '400' }
        ],
        'body-sm': [
          '14px',
          { lineHeight: '1.5', fontWeight: '400' }
        ],
        'caption': [
          '12px',
          { lineHeight: '1.4', fontWeight: '500' }
        ],
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.05em',
      },
      maxWidth: {
        'xs': '20rem',   /* 320px */
        'sm': '24rem',   /* 384px */
        'md': '28rem',   /* 448px */
        'lg': '32rem',   /* 512px */
        'xl': '36rem',   /* 576px */
        '2xl': '42rem',  /* 672px */
        '3xl': '48rem',  /* 768px */
        '4xl': '56rem',  /* 896px */
        '5xl': '64rem',  /* 1024px */
        '6xl': '72rem',  /* 1152px */
        '7xl': '80rem',  /* 1280px */
      },
    },
  },
};
```

---

## 8. 排版最佳实践

### 8.1 可读性原则

**行高**
- 标题: 1.1-1.3
- 正文: 1.5-1.7
- 代码: 1.5-1.6

**段落长度**
- 每段 3-5 句话
- 每句 15-25 个词
- 段落之间空一行

**对比度**
- 正文文本对比度 ≥ 4.5:1
- 大文本对比度 ≥ 3:1

---

### 8.2 视觉层次

**建立层次**
1. 使用字号区分层级
2. 使用字重强调重要性
3. 使用颜色引导视线
4. 使用间距分组内容

**保持一致**
- 同级内容使用相同样式
- 全局保持字体一致
- 统一使用相同的间距规则

---

### 8.3 避免的问题

**排版禁忌**
- 避免过度使用斜体
- 避免全大写文本（标签除外）
- 避免过多不同的字号
- 避免行高过小或过大
- 避免文本块过宽

---

**文档版本**: 1.0
**最后更新**: 2025-01-28
**维护者**: RWAI Design Team
