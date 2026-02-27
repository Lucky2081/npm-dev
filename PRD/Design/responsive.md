# RWAI Arena - 响应式设计

> 定义网站的响应式布局规则和移动端适配规范

---

## 1. 响应式设计原则

### 1.1 Mobile First

**设计理念**
- 优先设计移动端体验
- 逐步增强到桌面端
- 确保核心功能在所有设备可用

**开发策略**
```css
/* 默认移动端样式 */
.element {
  width: 100%;
  padding: 16px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .element {
    width: 50%;
    padding: 24px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .element {
    width: 33.333%;
    padding: 32px;
  }
}
```

---

### 1.2 断点系统

**Tailwind默认断点**
```
xs: 0-639px       （手机竖屏）
sm: 640px-767px   （手机横屏）
md: 768px-1023px  （平板）
lg: 1024px-1279px （小桌面）
xl: 1280px-1535px （桌面）
2xl: 1536px+      （大桌面）
```

**常用断点**
```javascript
// JavaScript媒体查询
const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// 媒体查询Hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
```

---

## 2. 布局响应式

### 2.1 容器系统

**响应式容器**
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px; /* 移动端 */
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px; /* 平板 */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 32px; /* 桌面 */
    max-width: 1200px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1400px;
  }
}
```

---

### 2.2 网格系统

**Arena卡片网格**
```css
.arena-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr; /* 移动端：1列 */
}

@media (min-width: 640px) {
  .arena-grid {
    grid-template-columns: repeat(2, 1fr); /* 手机横屏：2列 */
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .arena-grid {
    grid-template-columns: repeat(3, 1fr); /* 小桌面：3列 */
    gap: 24px;
  }
}

@media (min-width: 1280px) {
  .arena-grid {
    grid-template-columns: repeat(4, 1fr); /* 桌面：4列 */
  }
}
```

---

**行业卡片网格**
```css
.industry-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr; /* 移动端 */
}

@media (min-width: 768px) {
  .industry-grid {
    grid-template-columns: repeat(2, 1fr); /* 平板：2列 */
  }
}

@media (min-width: 1024px) {
  .industry-grid {
    grid-template-columns: repeat(3, 1fr); /* 桌面：3列 */
  }
}

@media (min-width: 1280px) {
  .industry-grid {
    grid-template-columns: repeat(6, 1fr); /* 大桌面：6列 */
  }
}
```

---

**特性网格（Blueprint Includes）**
```css
.features-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr; /* 移动端 */
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr); /* 平板：2列 */
    gap: 24px;
  }
}

@media (min-width: 1280px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr); /* 桌面：4列 */
  }
}
```

---

### 2.3 Flex布局响应式

**Hero区CTA按钮**
```css
.hero-cta {
  display: flex;
  flex-direction: column; /* 移动端：垂直堆叠 */
  gap: 12px;
  align-items: center;
}

@media (min-width: 640px) {
  .hero-cta {
    flex-direction: row; /* 手机横屏及以上：水平排列 */
    justify-content: center;
  }
}
```

---

**导航栏布局**
```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px; /* 移动端 */
}

/* 桌面端导航菜单 */
@media (min-width: 1024px) {
  .navbar {
    height: 64-72px;
    padding: 0 32px;
  }

  .nav-links {
    display: flex; /* 显示导航链接 */
  }

  .mobile-menu-button {
    display: none; /* 隐藏汉堡菜单 */
  }
}

/* 移动端导航菜单 */
@media (max-width: 1023px) {
  .nav-links {
    display: none; /* 隐藏导航链接 */
  }

  .mobile-menu-button {
    display: flex; /* 显示汉堡菜单 */
  }
}
```

---

## 3. 排版响应式

### 3.1 标题字号

**流体排版（Fluid Typography）**
```css
/* H1 */
h1 {
  font-size: clamp(32px, 5vw, 64px);
  line-height: 1.1-1.2;
}

/* H2 */
h2 {
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.2-1.3;
}

/* H3 */
h3 {
  font-size: clamp(20px, 3vw, 32px);
  line-height: 1.3;
}
```

---

**固定断点字号**
```css
/* H1 */
h1 {
  font-size: 32px; /* 移动端 */
  line-height: 1.2;
}

@media (min-width: 768px) {
  h1 {
    font-size: 48px; /* 平板及以上 */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 64px; /* 桌面及以上 */
  }
}
```

---

### 3.2 正文字号

```css
/* 标准正文 */
body {
  font-size: 16px; /* 所有设备 */
  line-height: 1.6;
}

/* 小屏幕可调整 */
@media (max-width: 639px) {
  body {
    font-size: 15px; /* 可选：小屏幕稍微减小 */
  }
}
```

---

### 3.3 间距响应式

**Section间距**
```css
section {
  padding: 60px 0; /* 移动端 */
}

@media (min-width: 768px) {
  section {
    padding: 80px 0; /* 平板 */
  }
}

@media (min-width: 1024px) {
  section {
    padding: 100px 0; /* 桌面 */
  }
}

@media (min-width: 1536px) {
  section {
    padding: 120px 0; /* 大桌面 */
  }
}
```

---

**卡片内边距**
```css
.card {
  padding: 16px; /* 移动端 */
}

@media (min-width: 768px) {
  .card {
    padding: 20px; /* 平板 */
  }
}

@media (min-width: 1024px) {
  .card {
    padding: 24px; /* 桌面 */
  }
}
```

---

## 4. 组件响应式

### 4.1 导航栏

**移动端汉堡菜单**
```css
/* 汉堡按钮 */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
  cursor: pointer;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #0F172A;
  transition: all 0.3s ease;
}

/* 汉堡菜单面板 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: #FFFFFF;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1001;
  padding: 24px;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.mobile-menu-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
```

---

**桌面端导航**
```css
@media (min-width: 1024px) {
  .hamburger {
    display: none;
  }

  .mobile-menu,
  .mobile-menu-overlay {
    display: none;
  }

  .nav-links {
    display: flex;
    gap: 24-32px;
  }
}
```

---

### 4.2 Arena卡片

**卡片响应式**
```css
.arena-card {
  padding: 16px; /* 移动端 */
  min-height: 260px;
}

@media (min-width: 768px) {
  .arena-card {
    padding: 20px; /* 平板 */
    min-height: 280px;
  }
}

@media (min-width: 1024px) {
  .arena-card {
    padding: 24px; /* 桌面 */
    min-height: 320px;
  }
}

/* 卡片内元素 */
.arena-card .title {
  font-size: 16px; /* 移动端 */
}

@media (min-width: 768px) {
  .arena-card .title {
    font-size: 18px; /* 平板及以上 */
  }
}

/* 移动端隐藏雷达图 */
@media (max-width: 767px) {
  .arena-card .radar-chart {
    display: none;
  }
}
```

---

### 4.3 按钮响应式

**按钮尺寸**
```css
/* 桌面端 */
.button {
  height: 44-48px;
  padding: 12-24px;
  font-size: 14-16px;
}

/* 移动端 */
@media (max-width: 767px) {
  .button {
    height: 48px; /* 触摸友好 */
    padding: 12-20px;
    font-size: 16px;
  }

  /* 全宽按钮（表单） */
  .button.full-width {
    width: 100%;
  }
}
```

---

**按钮组响应式**
```css
.hero-cta .button-group {
  display: flex;
  flex-direction: column; /* 移动端：垂直 */
  gap: 12px;
  width: 100%;
}

@media (min-width: 640px) {
  .hero-cta .button-group {
    flex-direction: row; /* 桌面端：水平 */
    justify-content: center;
    width: auto;
  }

  .hero-cta .button {
    width: auto;
  }
}
```

---

### 4.4 图片响应式

**响应式图片**
```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Next.js Image组件 */
.image-container {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8-12px;
}

/* 对象适配 */
img.cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

img.contain {
  object-fit: contain;
}
```

---

## 5. 触摸优化

### 5.1 触摸目标尺寸

**最小触摸尺寸**
```css
/* 按钮和链接 */
.button,
.link {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* 图标按钮 */
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 复选框/单选框 */
input[type="checkbox"],
input[type="radio"] {
  width: 24px;
  height: 24px;
}
```

---

### 5.2 触摸间距

**增加触摸区域**
```css
/* 链接增加padding */
.nav-link {
  padding: 12px 16px;
  display: inline-block;
}

/* 图标按钮增加padding */
.icon-button {
  padding: 10px;
  margin: -10px;
}
```

---

### 5.3 手势支持

**滑动支持**
```css
/* 可滑动容器 */
.swiper-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.swiper-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.swiper-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

---

## 6. 性能优化

### 6.1 懒加载

**图片懒加载**
```html
<!-- 使用loading属性 -->
<img src="image.jpg" loading="lazy" alt="..." />

<!-- Next.js Image组件自动懒加载 -->
<Image
  src="/image.jpg"
  alt="..."
  width={800}
  height={600}
  loading="lazy"
/>
```

---

**组件懒加载**
```javascript
// Next.js动态导入
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false, // 可选：仅客户端渲染
  }
);
```

---

### 6.2 响应式图片

**srcset属性**
```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="..."
/>
```

---

**Next.js Image组件**
```javascript
<Image
  src="/image.jpg"
  alt="..."
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>
```

---

## 7. 测试清单

### 7.1 设备测试

**移动端**
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 12/13/14 Pro Max (428px)
- [ ] Android 小屏 (360px)
- [ ] Android 大屏 (412px)

**平板端**
- [ ] iPad Mini (768px)
- [ ] iPad (810px - 1024px)
- [ ] iPad Pro (1024px)

**桌面端**
- [ ] 小桌面 (1024px - 1280px)
- [ ] 标准桌面 (1280px - 1536px)
- [ ] 大桌面 (1536px+)

---

### 7.2 功能测试

**布局**
- [ ] 导航栏响应式正常
- [ ] 网格布局正确堆叠
- [ ] 卡片间距合理
- [ ] 文字不溢出

**交互**
- [ ] 汉堡菜单可打开/关闭
- [ ] 按钮触摸目标足够大
- [ ] 滑动手势流畅
- [ ] 链接可点击

**性能**
- [ ] 图片懒加载正常
- [ ] 页面加载速度 < 3秒
- [ ] 动画流畅（60fps）
- [ ] 无水平滚动条

---

## 8. 最佳实践

### 8.1 设计原则

**内容优先**
- 移动端显示核心内容
- 桌面端显示增强内容
- 隐藏次要功能而非压缩

**渐进增强**
- 基础功能在所有设备可用
- 高级功能在大屏幕增强
- 优雅降级处理

**一致性**
- 相同功能在不同设备表现一致
- 保持品牌识别度
- 统一的交互模式

---

### 8.2 开发建议

**CSS优先**
- 优先使用CSS媒体查询
- 避免JavaScript检测设备
- 使用相对单位（rem, em, %, vw, vh）

**性能优先**
- 移动端减少动画
- 懒加载非关键资源
- 优化图片大小

**测试优先**
- 在真实设备测试
- 测试不同屏幕尺寸
- 测试横屏和竖屏

---

**文档版本**: 1.0
**最后更新**: 2025-01-28
**维护者**: RWAI Design Team
