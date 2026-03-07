#!/usr/bin/env python3
"""Batch-generate overview.md and overview.raw.json from Original Documents/main.md.

Workflow:
1. Parse overview sections from each arena's Original Documents/main.md.
2. Normalize into a stable markdown format (overview.md).
3. Export overview.raw.json (and optionally overview.zh.json).
"""

from __future__ import annotations

import argparse
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Tuple


SECTION_START_RE = re.compile(r"^\s*(\d+)\\\.\s*\*\*(.+?)\*\*\s*$", re.MULTILINE)
VERSION_TITLE_RE = re.compile(r"^\s*3\.(\d+)\s+\*\*(.+?)\*\*\s*$", re.MULTILINE)
CASE_NO_RE = re.compile(r"编号[：:]\s*([A-Za-z0-9_-]+)")

BASIC_BLOCK_TITLES = {
    "概况",
    "分类标签",
    "实施周期",
    "团队构成",
    "业务痛点",
    "核心功能",
    "核心业务指标",
    "核心技术指标",
    "其他价值回报",
}

VERSION_INFO_GROUPS = {"实践者信息", "原作者信息", "关联引用", "版本状态"}


def split_lines_keep_blanks(text: str) -> List[str]:
    lines = [line.strip() for line in text.replace("\r", "").split("\n")]
    while lines and lines[0] == "":
        lines.pop(0)
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def split_kv(line: str) -> Tuple[str, str]:
    parts = re.split(r"[：:]", line, maxsplit=1)
    if len(parts) == 2:
        return parts[0].strip(), parts[1].strip()
    return "", line.strip()


def normalize_commas(text: str) -> str:
    text = text.replace("，", ",")
    parts = [p.strip() for p in text.split(",") if p.strip()]
    return ",".join(parts)


class SectionTablesParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.table_depth = 0
        self.tables: List[List[List[str]]] = []
        self.current_table: List[List[str]] | None = None
        self.current_row: List[str] = []
        self.current_cell_parts: List[str] = []
        self.in_row = False
        self.in_cell = False

        self.link_href: str | None = None
        self.link_text_parts: List[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        attrs_dict = {k.lower(): v for k, v in attrs}
        if tag == "table":
            self.table_depth += 1
            if self.table_depth == 1:
                self.current_table = []
            return
        if self.table_depth != 1:
            return
        if tag == "tr":
            self.in_row = True
            self.current_row = []
            return
        if self.in_row and tag in ("td", "th"):
            self.in_cell = True
            self.current_cell_parts = []
            return
        if self.in_cell and tag == "br":
            self.current_cell_parts.append("\n")
            return
        if self.in_cell and tag == "a":
            self.link_href = attrs_dict.get("href") or ""
            self.link_text_parts = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if self.in_cell and tag in ("p", "div", "li", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"):
            self.current_cell_parts.append("\n")
        if self.in_cell and tag == "a" and self.link_href is not None:
            text = "".join(self.link_text_parts).strip()
            href = (self.link_href or "").strip()
            if text and href:
                self.current_cell_parts.append(f"[{text}]({href})")
            elif text:
                self.current_cell_parts.append(text)
            self.link_href = None
            self.link_text_parts = []
            return
        if self.table_depth != 1:
            if tag == "table":
                self.table_depth -= 1
            return
        if tag in ("td", "th") and self.in_cell:
            raw = html.unescape("".join(self.current_cell_parts))
            lines = split_lines_keep_blanks(raw)
            self.current_row.append("\n".join(lines))
            self.current_cell_parts = []
            self.in_cell = False
            return
        if tag == "tr" and self.in_row:
            if self.current_row and self.current_table is not None:
                self.current_table.append(self.current_row)
            self.current_row = []
            self.in_row = False
            return
        if tag == "table":
            if self.current_table is not None:
                self.tables.append(self.current_table)
                self.current_table = None
            self.table_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self.in_cell:
            return
        if not data.strip():
            return
        cleaned = data.replace("\r", "").strip("\n\t")
        if not cleaned:
            return
        if self.link_href is not None:
            self.link_text_parts.append(cleaned)
        else:
            self.current_cell_parts.append(cleaned)


def section_ranges(md_text: str) -> Dict[int, Tuple[int, int]]:
    matches = list(SECTION_START_RE.finditer(md_text))
    ranges: Dict[int, Tuple[int, int]] = {}
    for idx, match in enumerate(matches):
        number = int(match.group(1))
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(md_text)
        ranges[number] = (start, end)
    return ranges


def extract_section(md_text: str, section_no: int) -> str:
    ranges = section_ranges(md_text)
    section = ranges.get(section_no)
    if not section:
        return ""
    start, end = section
    return md_text[start:end].strip()


def parse_highlight(section1: str) -> str:
    lines = [line.strip() for line in section1.splitlines() if line.strip()]
    for line in lines:
        if not (line.startswith("|") and line.endswith("|")):
            continue
        inner = line.strip("|").strip()
        if not inner or re.fullmatch(r"[:\-\s]+", inner):
            continue
        if "编号" in inner:
            continue
        return inner
    return ""


def parse_case_no(md_text: str) -> str:
    m = CASE_NO_RE.search(md_text)
    return m.group(1) if m else ""


def parse_video_lines(section1: str) -> List[str]:
    out: List[str] = []
    for line in split_lines_keep_blanks(section1):
        if "示例视频" in line or "暂不支持下载" in line or "预期效果展示" in line:
            out.append(line.replace("\\", ""))
    return out


def parse_basic_info(section2: str) -> Dict[str, List[str]]:
    parser = SectionTablesParser()
    parser.feed(section2)
    if not parser.tables:
        return {}

    blocks: Dict[str, List[str]] = {}
    table = parser.tables[0]
    for row in table:
        for cell in row:
            lines = split_lines_keep_blanks(cell)
            current = ""
            for line in lines:
                if line in BASIC_BLOCK_TITLES:
                    current = line
                    blocks.setdefault(current, [])
                elif current:
                    blocks[current].append(line)
    return blocks


def format_reason_lines(lines: List[str]) -> List[str]:
    out: List[str] = []
    ignore_reason_labels = {
        "[待回填]",
        "指标提升",
        "成本优化",
        "补充信息",
        "其他优势",
        "metric improvement",
        "cost optimization",
        "additional info",
        "other advantages",
    }
    for raw in lines:
        line = re.sub(r"^[-*•]\s*", "", raw.strip())
        if not line or "——实践者" in line:
            continue
        if line.strip().lower() in ignore_reason_labels:
            continue
        key, value = split_kv(line)

        if key and value:
            out.append(f"- {key}：{value}")
            continue

        out.append(f"- [待回填]：{line}")
    return out


def _normalize_dependency_name(name: str) -> str:
    name = name.strip()
    name = re.sub(r"\(.*?\)", "", name).strip()
    name = re.sub(r"(首页|官网|文档|GitHub|Github|网站)$", "", name).strip()
    if "Claude Code" in name:
        return "Claude Code"
    if "Metaso MCP" in name or "Metaso" in name:
        return "Metaso MCP"
    if "GLM" in name:
        return "GLM"
    return name


def _normalize_partial_date(value: str) -> str:
    value = value.strip()
    m = re.match(r"^(\d{4}-\d{2})-(?:xx|XX)$", value)
    if m:
        return m.group(1)
    return value


def format_version_info_lines(version_type: str, lines: List[str]) -> List[str]:
    out: List[str] = []
    if version_type:
        out.append(f"- **版本类型**: {version_type}")

    current_group = ""
    team_name = ""
    dependencies: List[str] = []

    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line in VERSION_INFO_GROUPS:
            current_group = line
            continue

        key, value = split_kv(line)

        if current_group == "实践者信息":
            if key and value and not team_name:
                team_name = value
            elif not team_name and line:
                team_name = line
        elif current_group == "关联引用":
            if key and value:
                dep = _normalize_dependency_name(key)
                if dep and dep not in dependencies:
                    dependencies.append(dep)
            else:
                dep = _normalize_dependency_name(line)
                if dep and dep not in dependencies:
                    dependencies.append(dep)
        elif current_group in {"原作者信息", "版本状态"} and key and value:
            value = _normalize_partial_date(value)
            out.append(f"- **{key}**: {value}")
        else:
            if key and value:
                value = _normalize_partial_date(value)
                out.append(f"- **{key}**: {value}")
            else:
                out.append(f"- {line}")

    if team_name:
        out.insert(1 if version_type else 0, f"- **团队名称**: {team_name}")
    if dependencies:
        out.append(f"- **关键依赖**: {' · '.join(dependencies)}")

    return out


def parse_best_practice(section3: str, version_type: str) -> Dict[str, List[str]]:
    parser = SectionTablesParser()
    parser.feed(section3)

    table_map: Dict[str, List[str]] = {}
    for table in parser.tables:
        if not table or not table[0]:
            continue
        first_cell = table[0][0]
        lines = split_lines_keep_blanks(first_cell)
        if not lines:
            continue
        title = lines[0]
        body = lines[1:]
        table_map[title] = body

    reasons = format_reason_lines(table_map.get("入选最佳实践理由", []))
    version_info = format_version_info_lines(version_type, table_map.get("版本基本信息", []))
    details = table_map.get("实施详情", [])
    if details:
        details = [line.replace("实践详情", "[实践详情]") if line.startswith("http") else line for line in details]
    return {
        "reasons": reasons,
        "version_info": version_info,
        "details": details,
    }


def parse_version_type(md_text: str) -> str:
    m = VERSION_TITLE_RE.search(md_text)
    if not m:
        return ""
    return m.group(2).strip()


def build_payload(md_text: str) -> Dict[str, object]:
    section1 = extract_section(md_text, 1)
    section2 = extract_section(md_text, 2)
    section3 = extract_section(md_text, 3)

    highlight = parse_highlight(section1)
    case_no = parse_case_no(md_text)
    video_lines = parse_video_lines(section1)
    basic = parse_basic_info(section2)
    version_type = parse_version_type(md_text)
    best = parse_best_practice(section3, version_type)

    overview_lines = basic.get("概况", [])
    background = overview_lines[0] if overview_lines else ""
    solution = " ".join(overview_lines[1:]).strip() if len(overview_lines) > 1 else ""

    tag_lines = basic.get("分类标签", [])
    industry_val = ""
    category_val = ""
    tech_val = ""
    for line in tag_lines:
        key, value = split_kv(line)
        if "行业" in key:
            industry_val = value
        elif "应用" in key:
            category_val = value
        elif "技术" in key:
            tech_val = value

    cycle_lines = basic.get("实施周期", [])
    cycle = ""
    if cycle_lines:
        _, cycle_val = split_kv(cycle_lines[0])
        cycle = cycle_val

    section1_subsections: List[Dict[str, object]] = [
        {
            "title": "亮点卡片",
            "content": [
                "- [待回填]：[待回填]",
                "- [待回填]：[待回填]",
                "- [待回填]：[待回填]",
                "- [待回填]：[待回填]",
            ],
        }
    ]
    if highlight:
        payload_highlight = "[待回填]"
    else:
        payload_highlight = "[待回填]"
    if video_lines:
        section1_subsections.append({"title": "演示", "content": video_lines})

    section2_subsections: List[Dict[str, object]] = []
    if background or solution:
        content: List[str] = []
        if background:
            content.append(f"**业务背景**: {background}")
        if solution:
            content.append(f"**解决方案**: {solution}")
        section2_subsections.append({"title": "2.1 概况", "content": content})

    tag_content: List[str] = []
    if industry_val:
        tag_content.append(f"**行业类别**: {industry_val}")
    if category_val:
        tag_content.append(f"**应用类别**: {category_val}")
    if tech_val:
        tag_content.append(f"**技术类别**: {tech_val}")
    if tag_content:
        section2_subsections.append({"title": "2.2 分类标签", "content": tag_content})

    if cycle_lines:
        section2_subsections.append(
            {"title": "2.3 实施周期", "content": [f"- {line}" for line in cycle_lines]}
        )
    if basic.get("团队构成"):
        section2_subsections.append(
            {"title": "2.4 团队构成", "content": [f"- {line}" for line in basic["团队构成"]]}
        )
    if basic.get("业务痛点"):
        section2_subsections.append(
            {"title": "2.5 业务痛点", "content": [f"- {line}" for line in basic["业务痛点"]]}
        )
    if basic.get("核心功能"):
        section2_subsections.append(
            {"title": "2.6 核心功能", "content": [f"- {line}" for line in basic["核心功能"]]}
        )

    metrics_content: List[str] = []
    if basic.get("核心业务指标"):
        metrics_content.append("**核心业务指标**")
        metrics_content.extend([f"- {line}" for line in basic["核心业务指标"]])
    if basic.get("核心技术指标"):
        metrics_content.append("**核心技术指标**")
        metrics_content.extend([f"- {line}" for line in basic["核心技术指标"]])
    if basic.get("其他价值回报"):
        metrics_content.append("**其他价值回报**")
        metrics_content.extend([f"- {line}" for line in basic["其他价值回报"]])

    version_index = 1
    vm = VERSION_TITLE_RE.search(md_text)
    if vm:
        version_index = int(vm.group(1))
    section3_prefix = f"3.{version_index}"

    section3_subsections: List[Dict[str, object]] = []
    if best["reasons"]:
        section3_subsections.append(
            {"title": f"{section3_prefix}.1 入选最佳实践理由", "content": best["reasons"]}
        )
    if best["version_info"]:
        section3_subsections.append(
            {"title": f"{section3_prefix}.2 版本基本信息", "content": best["version_info"]}
        )
    if best["details"]:
        section3_subsections.append(
            {"title": f"{section3_prefix}.3 实施详情", "content": best["details"]}
        )
    if metrics_content:
        section3_subsections.append(
            {"title": f"{section3_prefix}.4 指标", "content": metrics_content}
        )

    payload = {
        "highlight": payload_highlight,
        "industry": normalize_commas(industry_val),
        "category": normalize_commas(category_val),
        "cycle": cycle,
        "case_no": case_no,
        "sections": [
            {"title": "1. 业务亮点", "subsections": section1_subsections},
            {"title": "2. 基本信息", "subsections": section2_subsections},
            {"title": "3. 最佳实践版本", "subsections": section3_subsections},
        ],
    }
    return payload


def payload_to_markdown(title: str, payload: Dict[str, object]) -> str:
    def _is_list_line(text: str) -> bool:
        return bool(re.match(r"^([-*+]\s+|\d+\.\s+)", text.strip()))

    def _render_content_with_spacing(content: List[object]) -> List[str]:
        rendered: List[str] = []
        prev_is_list = False
        for item in content:
            line_text = str(item)
            stripped = line_text.strip()
            if not stripped:
                if rendered and rendered[-1] != "":
                    rendered.append("")
                prev_is_list = False
                continue

            current_is_list = _is_list_line(stripped)
            if rendered:
                if not (current_is_list and prev_is_list):
                    if rendered[-1] != "":
                        rendered.append("")
            rendered.append(line_text)
            prev_is_list = current_is_list
        return rendered

    lines: List[str] = [f"# {title}", ""]
    case_no = str(payload.get("case_no", "")).strip()
    cycle = str(payload.get("cycle", "")).strip()
    if case_no:
        lines.append(f"**编号**: {case_no}")
    if cycle:
        lines.append(f"**研发周期**: {cycle}")
    if case_no or cycle:
        lines.append("")

    for section in payload.get("sections", []):
        section_title = section.get("title", "")
        lines.append(f"## {section_title}")
        lines.append("")
        for subsection in section.get("subsections", []):
            subtitle = subsection.get("title", "")
            lines.append(f"### {subtitle}")
            lines.append("")
            content = subsection.get("content", [])
            lines.extend(_render_content_with_spacing(content))
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def parse_title(md_text: str) -> str:
    lines = split_lines_keep_blanks(md_text)
    if not lines:
        return "业务概览"
    first = lines[0].strip()
    if first.startswith("**") and first.endswith("**") and len(first) >= 4:
        return first[2:-2].strip()
    return first.strip("* ").strip()


def process_arena(arena_dir: Path, write_zh_json: bool) -> Tuple[bool, str]:
    main_path = arena_dir / "Original Documents" / "main.md"
    if not main_path.exists():
        return False, "missing Original Documents/main.md"

    md_text = main_path.read_text(encoding="utf-8")
    payload = build_payload(md_text)
    section_items = payload.get("sections", [])
    subsection_count = sum(len(s.get("subsections", [])) for s in section_items)
    if subsection_count == 0:
        return False, "no parsable overview content found"

    title = parse_title(md_text)
    overview_md = payload_to_markdown(title, payload)

    overview_md_path = arena_dir / "overview.md"
    raw_json_path = arena_dir / "overview.raw.json"
    zh_json_path = arena_dir / "overview.zh.json"

    overview_md_path.write_text(overview_md, encoding="utf-8")
    raw_json_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if write_zh_json:
        zh_json_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    return True, f"{subsection_count} subsections"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Batch-generate overview.md and overview.raw.json from Original Documents/main.md"
    )
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parent),
        help="Arena root dir (default: script directory)",
    )
    parser.add_argument(
        "--write-zh-json",
        dest="write_zh_json",
        action="store_true",
        default=True,
        help="Write generated content to overview.zh.json (default: true)",
    )
    parser.add_argument(
        "--no-write-zh-json",
        dest="write_zh_json",
        action="store_false",
        help="Do not write overview.zh.json",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"[ERROR] Invalid root: {root}")
        return 1

    arena_dirs = sorted(
        [
            p
            for p in root.iterdir()
            if p.is_dir() and not p.name.startswith(".") and not p.name.startswith("__")
        ]
    )
    processed = 0
    skipped = 0

    for arena in arena_dirs:
        ok, message = process_arena(arena, write_zh_json=args.write_zh_json)
        if ok:
            processed += 1
            print(f"[OK] {arena.name}: {message}")
        else:
            skipped += 1
            print(f"[SKIP] {arena.name}: {message}")

    print(f"\nDone. processed={processed}, skipped={skipped}, total={len(arena_dirs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
