---
name: overview-highlights
description: 批量回填各擂台 overview.zh.json，并精简“入选最佳实践理由”与“亮点卡片/业务亮点”。
---

# Overview Highlights

用于批量处理 `Content/Arena/All Arenas/*/` 下所有擂台（不是只处理单个擂台）：

1. 回填 `overview.zh.json` 中待回填内容
2. 精简 `overview.zh.json` 中 `3.1.1 入选最佳实践理由`
3. 生成/更新 `overview.zh.json` 中 `1. 业务亮点 -> 亮点卡片` 与顶层 `highlight`

## 处理范围

- 输入目录：`Content/Arena/All Arenas/{arena-folder}/`
- 目标文件：`overview.zh.json`

## 回填规则（overview.zh.json）

定位 `overview.zh.json` 中以下待回填区域：

1. 顶层 `highlight`
2. `sections[].subsections[]` 标题为 `亮点卡片` 的 `content`
3. `sections[].subsections[]` 标题为 `3.1.1 入选最佳实践理由` 的 `content`

要求：

1. 不新增、不删除、不重命名 JSON 字段；仅更新上述内容值
2. 保持原有 `sections/subsections/content` 结构不变
3. 若存在 `[待回填]`、空字符串、或明显冗长表述，则按本 skill 规则替换为可直接展示的业务文案

## 精简规则（overview.zh.json）

定位：`sections[].subsections[]` 中标题为 `3.1.1 入选最佳实践理由`。

将冗长描述改为“短标题 + 一句话价值”，每条 1 行，保留 4 条，格式为：

- `- <短标题>：<精简描述>`

要求：

1. 去除“跑测、榜单截止日期、长括号解释”等冗余叙述
2. 保留核心结论（效果、速度、成本、可用性）
3. 尽量保留关键数字（如排名、时长、降本比例、质量指标）
4. 语句面向业务决策，可直接展示给非技术角色

## 亮点卡片与业务亮点规则

定位：`sections[].subsections[]` 中标题为 `亮点卡片`。

1. 固定输出 4 条卡片，格式：
   - `- <key>：<value>`
2. `key` 建议短句（8-16 字），`value` 保留 1 个核心事实或指标
3. 同步更新顶层 `highlight`：
   - 优先取第一条卡片 `key`
   - 若第一条不适合做总亮点，改为最能代表业务价值的一条

## 参考示例（必须写入/遵循）

将如下待回填内容：

- `[待回填]：该方案在Deep Research评测基准DeepResearch Bench上跑测综合得分为51.86，在该榜单截止12月24日全部开源可用方案中排名第2位（与第1位方案tavily-research（51.97）综合得分差距小于1.5%，确保生成报告准确、可信，提升用户体验。`
- `[待回填]：该方案的报告平均生成时间≤15分钟，比salesforce-air-deep-research（平均约为20分钟）快33%，提升调研效率。`
- `[待回填]：该方案支持以GLM-4.7等API收费相对更低的高性能大模型为基座，从而节省近60%运营成本。`
- `[待回填]：该方案生成报告模板的契合度≥95%，格式规范度≥99%，相比人工方案（约1周，需沟通、调研、专家咨询、校对、排版等流程），人力成本降低约95%。`

精简为：

- `- 效果领先：在 DeepResearch Bench 开源方案中排名第 2，生成内容稳定、可信，适用于正式业务决策场景。`
- `- 生成更快：单篇报告 ≤15 分钟完成，显著快于同类方案（普遍 ≥20 分钟）。`
- `- 成本更低：支持高性价比常用大模型（如 GLM 系列），在保持效果的前提下，整体成本降低 60%+。`
- `- 企业可用：模板契合度 ≥95%，格式规范度 ≥99%，可直接用于内部汇报与对外材料。`

## 1-intelligent-research-system 建议亮点（示例口径）

针对 `Content/Arena/All Arenas/1-intelligent-research-system/overview.zh.json`，建议“亮点卡片”使用以下 key/value：

- `key: DeepResearch Bench排名第2`
  `value: 权威基准测试综合得分51.86，与第一名差距<1.5%`
- `key: 减少95%手动研究工作量`
  `value: 自动化资料搜集、信息整合，大幅提升调研效率`
- `key: 报告≤15分钟生成`
  `value: 快速输出高质量结构化调研文档，支持批量生成`
- `key: 支持开源大模型`
  `value: 节省90%成本，GLM-4.7等常见开源基座大模型`

## 执行步骤

用户调用此 skill 时，我执行：

1. 扫描 `Content/Arena/All Arenas/*/` 全部擂台目录
2. 对每个擂台更新对应 `overview.zh.json` 的：
   - `3.1.1 入选最佳实践理由`（精简）
   - `亮点卡片`（4 条 key:value）
   - 顶层 `highlight`
3. 校验 JSON 可解析、字段结构不变
4. 输出本轮处理清单（已更新/跳过/异常）

## 用法

```bash
# 批量处理所有擂台
$overview-highlights

# 只处理指定擂台
$overview-highlights --folder 1-intelligent-research-system
```
