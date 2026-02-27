# Arena 数据同步说明

## 概述

Arena 列表现在从 Excel 文件完全自动读取并同步到页面。

## 数据流

```
Excel 文件 → 同步脚本 → page.raw.md + lib/data.ts → Arena 页面
```

## 文件说明

### 1. 数据源
**文件**: `Content/Arena/List of Arenas.xlsx`

Excel 文件包含所有 Arena 的数据，包括：
- 擂台编号
- 擂台名称（中文）
- 本周擂主（技术栈）
- 亮点
- 行业类别
- 应用类别
- 简要描述
- 技术类别
- 速度、质量、安全、成本指标

### 2. 同步脚本
**文件**: `scripts/sync-arena-list.ts`

功能：
- 读取 Excel 文件
- 转换数据格式
- 生成 Markdown 文件（page.raw.md）
- 生成 TypeScript 数据文件（lib/data.ts）

### 3. 输出文件

#### page.raw.md
**文件**: `Content/Arena/page.raw.md`

包含所有 Arena 的详细信息的 Markdown 格式文档。

#### lib/data.ts
**文件**: `lib/data.ts`

包含：
- `arenas`: Arena 数组，用于页面渲染
- `categories`: 类别配置
- `industries`: 行业配置
- 辅助函数：`getArenaById`, `filterArenas`, `getStats` 等

### 4. Arena 页面
**文件**: `app/[locale]/arena/page.tsx`

从 `lib/data.ts` 读取数据并渲染 Arena 列表。

## 使用方法

### 同步数据

当 Excel 文件更新后，运行以下命令同步数据：

```bash
npm run sync-arena-list
```

这将：
1. 读取 `Content/Arena/List of Arenas.xlsx`
2. 更新 `Content/Arena/page.raw.md`
3. 更新 `lib/data.ts`

### 开发服务器

```bash
npm run dev
```

访问 http://localhost:3000/zh/arena 或 http://localhost:3000/en/arena 查看 Arena 列表。

## 数据映射

### 质量/速度指标映射

Excel 中的定性描述会自动转换为数值：

| 描述 | 数值 |
|------|------|
| 很高/很快 | 95 |
| 较高/较快 | 85 |
| 中等 | 75 |
| 较低/较慢 | 65 |
| 很低/很慢 | 55 |

### 类别映射

| 中文 | English Key |
|------|-------------|
| 服务 | service |
| 管理 | management |
| 营销 | marketing |
| 风控 | risk-control |
| 运营 | operations |
| 通用 | general |

### 行业映射

| 中文 | English Key |
|------|-------------|
| 金融 | finance |
| 零售 | retail |
| 教育 | education |
| 医疗 | healthcare |
| 能源 | energy |
| 制造 | manufacturing |
| 通用 | general |

## 添加新 Arena

1. 在 `Content/Arena/List of Arenas.xlsx` 中添加新行
2. 运行 `npm run sync-arena-list`
3. 刷新浏览器查看更新

## 注意事项

- Excel 文件必须保持格式一致
- 擂台编号不能为空
- 包含"敬请期待"的行会被自动跳过
- 每次运行脚本会完全覆盖 `page.raw.md` 和 `lib/data.ts`
