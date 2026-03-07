---
name: sync-overview-pipeline
description: Overview 同步流水线。从数据源生成 zh/en JSON 文件并入库。
---

# Sync Overview Pipeline

Overview 同步流水线。用于生成/更新 `overview.zh.json`，并串联 overview 相关的另外 2 个 skill：

1. `overview-highlights`
2. `overview-translation`

## 工作流程

```
CSV / MD 数据源
        ↓ (提取概览信息)
  overview.zh.json
        ↓ (回填/精简亮点)
  overview-highlights
        ↓
  overview.zh.json
        ↓ (翻译)
  overview-translation
        ↓
  overview.en.json
```

## 数据目录

- 源数据: `Content/Arena/List of Arenas ZH.csv` + `Content/Arena/data/md/` 目录
- 输出文件: `Content/Arena/All Arenas/{arena-folder}/overview.zh.json`
- 输出文件: `Content/Arena/All Arenas/{arena-folder}/overview.en.json`

## 调用的 skill

- `overview-highlights`
  - 用途：回填并精简 `overview.zh.json` 中的 `highlight`、`亮点卡片`、`3.1.1 入选最佳实践理由`
  - 调用时机：完成 `overview.zh.json` 生成后、翻译前
- `overview-translation`
  - 用途：基于最终版 `overview.zh.json` 生成 `overview.en.json`
  - 调用时机：`overview-highlights` 完成后

## 执行原则

1. 先生成/更新中文源文件，再调用另外 2 个 overview skill
2. `overview-translation` 必须基于已经过 `overview-highlights` 处理的最终中文内容执行，避免英文文件落后于中文亮点文案
3. 若用户指定 `--folder`，则 3 个步骤都只处理该擂台
4. 若未指定 `--folder`，则按“先找缺失，再找内容不完整”的顺序批量处理

## 执行步骤

用户调用此 skill 时，我执行以下步骤：

1. **扫描待处理 arena**：按以下优先级找出需要更新的目录：
   - **优先级 1（最高）**：缺少 `overview.zh.json` 或 `overview.en.json` 文件
   - **优先级 2**：`overview.zh.json` 内容为空或缺失关键字段（源数据已更新）
2. **生成或更新 `overview.zh.json`**：
   - 从 CSV 和 MD 数据源提取概览信息
   - 生成或覆盖 `overview.zh.json`
   - 校验 JSON 可解析，且顶层至少包含 `highlight`、`industry`、`category`、`cycle`、`case_no`、`sections`
3. **调用 `overview-highlights`**：
   - 对上一步生成的 `overview.zh.json` 进行回填与精简
   - 确保 `highlight`、`亮点卡片`、`3.1.1 入选最佳实践理由` 已更新为最终展示文案
4. **调用 `overview-translation`**：
   - 基于最终版 `overview.zh.json` 生成或更新 `overview.en.json`
   - 保持 JSON 结构一致
5. **输出处理结果摘要**：
   - 已生成/更新的 `overview.zh.json`
   - 已调用的 `overview-highlights`
   - 已生成/更新的 `overview.en.json`

## 增量更新判断逻辑

判断是否需要更新时，按以下顺序检查：

1. **首先检查文件是否存在**（优先级最高）：
   - 如果缺少 `overview.zh.json` → 需要生成
   - 如果缺少 `overview.en.json` → 需要生成
   - 文件缺失与修改时间无关，直接生成

2. **其次检查内容完整性**：
   - 检查 JSON 文件内容是否为空或缺失关键字段
   - 如果内容不完整或格式错误，则需要更新
3. **最后检查中文与英文是否同步**：
   - 若 `overview.zh.json` 已重新生成或被 `overview-highlights` 更新，则应重新执行 `overview-translation`
   - 不允许只更新中文而跳过英文同步

## JSON 结构

```json
{
  "highlight": "业务亮点",
  "industry": "行业类别",
  "category": "应用类别",
  "cycle": "实施周期",
  "case_no": "编号",
  "sections": [
    {
      "title": "1. 业务亮点",
      "subsections": [
        {"title": "亮点卡片", "content": ["- 亮点内容"]}
      ]
    },
    {
      "title": "2. 基本信息",
      "subsections": [
        {"title": "2.1 概况", "content": ["**业务背景**: ...", "**解决方案**: ..."]},
        {"title": "2.2 分类标签", "content": ["**行业类别**: ...", "**应用类别**: ..."]},
        {"title": "2.3 实施周期", "content": ["- ..."]},
        {"title": "2.4 团队构成", "content": ["- ..."]},
        {"title": "2.5 业务痛点", "content": ["- ..."]},
        {"title": "2.6 核心功能", "content": ["- ..."]}
      ]
    }
  ],
  "markdown": "## 1. 业务亮点\n\n### 亮点\n..."
}
```

## 用法

```bash
# 批量处理所有
$sync-overview-pipeline

# 处理指定 arena
$sync-overview-pipeline --folder 1-intelligent-research-system
```
