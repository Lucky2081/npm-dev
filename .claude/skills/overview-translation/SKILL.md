---
name: overview-translation
description: 读取 overview.zh.json，翻译得到 overview.en.json。保持 JSON 结构一致。每次处理一条数据。
---

# Overview Translation

将中文 overview JSON 文件翻译为英文版本。

## 数据源

- 目录: `Content/Arena/All Arenas/{arena-folder}/`
- 源文件: `overview.zh.json`
- 目标文件: `overview.en.json`（同目录）
- **字段基准文件**: `Content/Arena/All Arenas/1-intelligent-research-system/overview.zh.json`

## 字段基准（必须严格遵守）

1. 顶层仅允许字段：`highlight`、`industry`、`category`、`cycle`、`case_no`、`sections`
2. `sections[]` 每项仅允许字段：`title`、`subsections`
3. `subsections[]` 每项仅允许字段：`title`、`content`
4. `content` 必须为字符串数组，不改成对象/富文本结构
5. 不新增、不删除、不重命名任何字段；字段顺序与源 JSON 保持一致
6. 若源文件包含 `markdown` 字段，则必须保留并翻译其文本内容，不得删除
7. 小节标题和编号体系必须沿用源文件，不自行重组章节

## 翻译规则

1. **保持 JSON 结构一致**：sections、subsections 结构不变
2. **翻译所有中文内容**：
   - `highlight` 字段
   - `industry` 字段
   - `category` 字段
   - `cycle` 字段
   - `sections` 中的 `title` 字段
   - `subsections` 中的 `title` 和 `content` 数组中的文本
   - `markdown` 字段
3. **不翻译的字段**：
   - `case_no` (编号保持原样)
   - URL 链接
   - Markdown 链接语法本身（保留 `[text](url)` 结构）
   - 文件名和技术专有名词（如 Node、npm、Python、Claude Code、Dify、Lovable、PoC、RAG、LLM、GLM 等）
   - 代码块中的代码与命令（如存在）
4. **列表格式保持**：
   - 无序列表前缀 `- ` 保持不变
   - 有序列表编号格式 `1. `、`2. ` 保持不变
   - 仅翻译列表项中的自然语言文本
5. **术语一致性**：
   - 行业类别 -> Industry
   - 应用类别 -> Category
   - 实施周期 -> Implementation Cycle
   - 基本信息 -> Basic Information
   - 概况 -> Overview
   - 分类标签 -> Classification Tags
   - 团队构成 -> Team Composition
   - 业务痛点 -> Business Pain Points
   - 核心功能 -> Core Functions
   - 业务亮点 -> Business Highlights
   - 亮点卡片 -> Highlight Cards
   - 演示 -> Demo
   - 最佳实践版本 -> Best Practice Version
   - 入选最佳实践理由 -> Reasons for Best Practice Selection
   - 版本基本信息 -> Version Information
   - 实施详情 -> Implementation Details
   - 指标 -> Metrics

## 执行步骤

用户调用此 skill 时，我执行以下步骤：

1. 遍历 `Content/Arena/All Arenas/` 下的 arena 目录
2. 找到下一条待处理的记录：
   - 有 `overview.zh.json` 文件
   - 没有 `overview.en.json` 文件，或者
   - `overview.zh.json` 的修改时间晚于 `overview.en.json`（源文件已更新）
3. 读取 `overview.zh.json` 文件
4. 翻译所有中文内容为英文，保持 JSON 结构
5. 校验翻译后的 JSON 结构与源结构一致
6. 写入 `overview.en.json` 文件
7. 输出处理结果

## 增量更新

通过比较文件修改时间判断是否需要更新：
- 使用 `stat -f %m` (macOS) 或 `stat -c %Y` (Linux) 获取文件修改时间戳
- 如果 `overview.zh.json` 时间戳 > `overview.en.json` 时间戳，则需要更新

## 保证

- 只翻译值，不改变 JSON 结构
- 保持 sections 数组和 subsections 数组结构
- 保持列表样式、链接结构、Markdown 结构、代码块结构不变
- 每次只处理一条数据

## 用法

```bash
# 调用 skill 处理下一条
$overview-translation

# 指定 arena-folder
$overview-translation --folder 1-intelligent-research-system
```
