---
name: tech-config-translation
description: 读取 tech-configuration.zh.json，翻译得到 tech-configuration.en.json。保持 JSON 结构一致。每次处理一条数据。
---

# Tech Config Translation

翻译技术配置 JSON 从中文到英文。

## 数据源

- 目录: `Content/Arena/All Arenas/{arena-folder}/`
- 源文件: `tech-configuration.zh.json`
- 目标文件: `tech-configuration.en.json`（同目录）

## 翻译规则

1. **保持 JSON 结构一致**：steps、subsections 结构不变
2. **翻译所有中文内容**：
   - `steps` 中的 `title` 字段
   - `subsections` 中的 `title` 字段
   - `content` 数组中的文本内容
3. **不翻译的字段**：
   - `number` (步骤编号保持原样)
   - 代码块中的代码和命令
   - URL 链接
   - 文件名和技术专有名词（如 Node、npm、python、Claude Code 等）
4. **术语一致性**：
   - 步骤定义 -> Step Definition
   - 参与人员 -> Participants
   - 本步输入 -> Input
   - 本步产出 -> Output
   - 预估时间 -> Estimated Time
   - 角色名称 -> Role Name
   - 技能要求 -> Skill Requirements
   - 角色数量 -> Number of Roles
   - 输入名称 -> Input Name
   - 输入介绍 -> Input Description
   - 输入示例 -> Input Example
   - 资源链接 -> Resource Links
   - 输出名称 -> Output Name
   - 输出介绍 -> Output Description
   - 算法工程师 -> Algorithm Engineer
   - 前端工程师 -> Frontend Engineer
   - 后端工程师 -> Backend Engineer
   - 安装 -> Install
   - 配置 -> Configure
   - 启动 -> Start/Launch

## 执行步骤

用户调用此 skill 时，我执行以下步骤：

1. 遍历 `Content/Arena/All Arenas/` 下的 arena 目录
2. 找到下一条待处理的记录：
   - 有 `tech-configuration.zh.json` 但没有 `tech-configuration.en.json`，或者
   - `tech-configuration.zh.json` 的修改时间晚于 `tech-configuration.en.json`（中文版已更新）
3. 读取 `tech-configuration.zh.json` 内容
4. 翻译 JSON 中的中文文本值为英文（保持 JSON 结构不变）
5. 校验翻译后的 JSON 结构与源结构一致
6. 写入 `tech-configuration.en.json` 文件
7. 输出处理结果

## 增量更新

通过比较文件修改时间判断是否需要更新：
- 使用 `stat -f %m` (macOS) 或 `stat -c %Y` (Linux) 获取文件修改时间戳
- 如果 `tech-configuration.zh.json` 时间戳 > `tech-configuration.en.json` 时间戳，则需要更新

## 保证

- 只翻译值，不改变 JSON 结构
- 保持 steps 数组和 subsections 数组结构
- 每次只处理一条数据

## 用法

```bash
# 调用 skill 翻译下一条
$tech-config-translation

# 指定 arena-folder
$tech-config-translation --folder 1-intelligent-research-system
```
