# Scripts - 工具脚本文档

本目录包含自动化工具脚本，用于代码质量检查和内容同步。

## 📁 目录

- [国际化检查](#国际化检查-check-i18n)
- [内容同步](#内容同步)
- [Arena数据同步](#arena数据同步)

---

## 国际化检查 (check-i18n)

### 🎯 目的
自动检查代码中的硬编码中英文文本，确保国际化(i18n)正确实现。

### 🚀 使用方法

```bash
npm run check-i18n
```

### ✅ 检查内容

1. **JSX中的硬编码中文**
   - 检测 `<div>中文文本</div>` 格式的硬编码
   - 排除注释、aria-labels、data-testid
   - 排除已使用条件判断的情况

2. **对象属性中的硬编码中文**
   - 检测 `title: '中文'`、`description: '中文'` 等格式
   - 排除包含 `isChina` 或 `locale` 条件判断的行

3. **硬编码英文**
   - 检测用户可见的英文文本
   - 排除技术术语、类名、URL等

### 📋 输出示例

**成功时：**
```
✓ No hardcoded Chinese text found in JSX
✓ No hardcoded English text found in JSX
✓ All i18n checks passed!
```

**失败时：**
```
✗ Found hardcoded Chinese text(s):
app\[locale]\arena\[id]\client-page.tsx:631
  Text: "DeepResearch Bench排名第2"
  Context: title: 'DeepResearch Bench排名第2',

Please review the results above and fix any hardcoded text.
Remember to use: {locale === 'zh' ? '中文' : 'English'}
```

### 🔧 修复方法

#### JSX中的硬编码
```tsx
// ❌ 错误 - 硬编码
<h1>业务亮点</h1>

// ✅ 正确 - 使用条件判断
<h1>{isChina ? '业务亮点' : 'Business Highlights'}</h1>
```

#### 对象属性中的硬编码
```tsx
// ❌ 错误 - 硬编码
const highlights = [
  {
    title: '减少95%手动研究工作量',
    description: '自动化资料搜集、信息整合',
  }
];

// ✅ 正确 - 使用条件判断
const highlights = [
  {
    title: isChina ? '减少95%手动研究工作量' : 'Reduce 95% Manual Workload',
    description: isChina ? '自动化资料搜集、信息整合' : 'Automated data collection',
  }
];
```

#### 数据访问
```tsx
// ✅ 正确 - 根据locale访问对应字段
{arena.title[locale as keyof typeof arena.title] || arena.title.zh}
{isChina ? arena.champion : arena.championEn}
```

### 📝 最佳实践

1. **开发新功能时**
   - 所有用户可见文本必须使用条件判断
   - 使用 `isChina` 或 `locale === 'zh'` 判断
   - 在对象定义时就提供双语版本

2. **修改现有代码时**
   - 修改前先运行 `npm run check-i18n` 确认当前状态
   - 修改后再次运行检查确保没有引入新问题

3. **提交代码前**
   - 运行完整的i18n检查
   - 确保所有检查通过后再提交

### 🔄 持续集成

建议在CI/CD流程中添加此检查：
```yaml
# .github/workflows/ci.yml
- name: Check i18n
  run: npm run check-i18n
```

---

## 内容同步 (sync-content)

### 🎯 目的
同步`.raw.md`原始内容文件，生成`.en.md`和`.zh.md`分离的双语文本文件。

### 🚀 使用方法

```bash
npm run sync-content
```

### 📝 工作原理

1. 读取 `Content/` 目录下所有 `.raw.md` 文件
2. 解析 `#### English` 和 `#### 中文` 标记
3. 提取对应语言的内容
4. 生成独立的 `.en.md` 和 `.zh.md` 文件

### ⚠️ 注意事项

- 原始文件必须使用 `#### English` 和 `#### 中文` 标记
- 不要直接编辑 `.en.md` 或 `.zh.md` 文件（会被覆盖）
- 修改内容请编辑 `.raw.md` 文件

---

## Arena数据同步 (sync-arena-list)

### 🎯 目的
从Excel文件同步Arena列表数据到 `lib/data.ts`。

### 🚀 使用方法

```bash
npm run sync-arena-list
```

### 📝 输入文件
- `Content/Arena/List of Arenas.xlsx`

### 📄 输出文件
- `lib/data.ts` - Arena数据数组
- `Content/Arena/page.en.md` - 英文Arena列表页
- `Content/Arena/page.zh.md` - 中文Arena列表页
- `Content/Arena/page.raw.md` - 原始内容

### ⚠️ 注意事项

- Excel文件必须包含所有必需的列
- 修改Excel后需要重新运行此脚本
- 自动生成文件夹ID映射
- 自动检查Content目录是否存在

---

## 🛠️ 开发新脚本

### 命名规范

- TypeScript脚本: `*.ts` (使用tsx运行)
- Bash脚本: `*.sh` (Unix/Linux/macOS)
- Batch脚本: `*.bat` (Windows)

### 添加到package.json

```json
{
  "scripts": {
    "your-script": "tsx scripts/your-script.ts"
  }
}
```

### 脚本模板

```typescript
#!/usr/bin/env tsx
/**
 * Script description
 *
 * Purpose: What this script does
 * Usage: npm run your-script
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function main() {
  console.log('Running script...');

  // Your code here

  console.log('✓ Script completed successfully');
  process.exit(0);
}

main();
```

---

## 📚 相关文档

- [质量检查清单](../../PRD/QA/quality-checklist.md) - 完整的QA检查项
- [国际化指南](../../PRD/QA/quality-checklist.md#64-internationalization-i18n-code-review-) - i18n最佳实践
- [内容管理](../../PRD/QA/quality-checklist.md#6-content-management-workflow) - 内容工作流

---

**最后更新**: 2026-02-04
**维护者**: RWAI Development Team
