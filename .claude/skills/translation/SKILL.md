---
name: translation
description: 通用翻译工具。翻译文本或 JSON 内容，支持中译英、英译中等多种语言对。
---

# Translation

通用翻译 skill。

## 功能

- 翻译文本内容
- 翻译 JSON（保持结构，只翻译值）
- 支持多种语言对

## 调用方式

用户调用此 skill 时，我直接执行翻译任务。

### 参数（从用户消息解析）

- `text`: 要翻译的文本
- `json`: 要翻译的 JSON 对象
- `target_lang`: 目标语言（默认 en）
- `source_lang`: 源语言（默认 auto 检测）

### 执行步骤

1. 识别输入类型（文本或 JSON）
2. 如果是 JSON，保持结构只翻译值
3. 如果是文本，直接翻译
4. 输出翻译结果
