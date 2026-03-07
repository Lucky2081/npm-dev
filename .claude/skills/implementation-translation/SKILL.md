---
name: implementation-translation
description: 读取 implementation.zh.json，翻译得到 implementation.en.json。保持 JSON 结构一致。每次处理一条数据。
---

# Implementation Translation

翻译实施配置 JSON 从中文到英文。

## 数据源

- 目录: `Content/Arena/All Arenas/{arena-folder}/`
- 源文件: `implementation.zh.json`
- 目标文件: `implementation.en.json`（同目录）
- **字段基准文件**: `Content/Arena/All Arenas/1-intelligent-research-system/implementation.zh.json`

## 字段基准（必须严格遵守）

1. 顶层仅允许字段：`phases`
2. `phases[]` 每项仅允许字段：`number`、`title`、`subsections`
3. `subsections[]` 每项仅允许字段：`title`、`content`
4. `content` 必须为字符串数组，不改成对象/富文本结构
5. 不新增、不删除、不重命名任何字段；字段顺序与源 JSON 保持一致
6. 小节标题以基准文件为准：`团队构成`、`实施内容`、`相关资源`、`结果产出`、`实施周期`

## 翻译规则

1. **保持 JSON 结构一致**：phases、subsections 结构不变
2. **翻译所有中文内容**：
   - `phases` 中的 `title` 字段
   - `subsections` 中的 `title` 字段
   - `content` 数组中的文本内容
3. **不翻译的字段/内容**：
   - `number` (阶段编号保持原样)
   - URL 链接
   - Markdown 链接语法本身（保留 `[text](url)` 结构）
   - 文件名和技术专有名词（如 Node、npm、Python、Claude Code、Dify、Lovable、PoC 等）
   - 代码块中的代码与命令（如存在）
4. **列表格式保持**：
   - 无序列表前缀 `- ` 保持不变
   - 有序列表编号格式 `1. `、`2. ` 保持不变
   - 仅翻译列表项中的自然语言文本
5. **术语一致性**：
   - 需求识别与团队构建 -> Requirements Identification and Team Building
   - 价值确认与需求细化 -> Value Confirmation and Requirements Refinement
   - 初步验证与立项 -> Preliminary Verification and Project Initiation
   - 正式上线与优化迭代 -> Official Launch and Iterative Optimization
   - PHASE -> PHASE (保留)
   - 团队构成 -> Team Composition
   - 实施内容 -> Implementation Steps
   - 相关资源 -> Related Resources
   - 结果产出 -> Deliverables
   - 实施周期 -> Timeline
   - 模板： -> Template:
   - 业务对接人 -> Business Liaison
   - 算法对接人 -> Algorithm Liaison
   - 业务侧技术对接人 -> Business-side Technical Liaison
   - 产品经理 -> Product Manager
   - 算法工程师 -> Algorithm Engineer
   - 前端工程师 -> Frontend Engineer
   - 后端工程师 -> Backend Engineer
   - 业务专家 -> Business Expert
   - 算法专家 -> Algorithm Expert

## 执行步骤

用户调用此 skill 时，我执行以下步骤：

1. 遍历 `Content/Arena/All Arenas/` 下的 arena 目录
2. 找到下一条待处理的记录：
   - 有 `implementation.zh.json` 但没有 `implementation.en.json`，或者
   - `implementation.zh.json` 的修改时间晚于 `implementation.en.json`（中文版已更新）
3. 读取 `implementation.zh.json` 内容
4. 翻译 JSON 中的中文文本值为英文（保持 JSON 结构不变）
5. 校验翻译后的 JSON 结构与源结构一致
6. 写入 `implementation.en.json` 文件
7. 输出处理结果

## 增量更新

通过比较文件修改时间判断是否需要更新：
- 使用 `stat -f %m` (macOS) 或 `stat -c %Y` (Linux) 获取文件修改时间戳
- 如果 `implementation.zh.json` 时间戳 > `implementation.en.json` 时间戳，则需要更新

## 保证

- 只翻译值，不改变 JSON 结构
- 保持 phases 数组和 subsections 数组结构
- 保持列表样式、链接结构、代码块结构不变
- 每次只处理一条数据

## 用法

```bash
# 调用 skill 翻译下一条
$implementation-translation

# 指定 arena-folder
$implementation-translation --folder 1-intelligent-research-system
```
