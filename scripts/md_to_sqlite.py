#!/usr/bin/env python3
import argparse
import html
import json
import re
import sqlite3
import time
from pathlib import Path
from typing import Dict, List

CODE_TO_FOLDER = {
    "C4": "1-intelligent-research-system",
    "C2": "2-business-dashboard-website",
    "C3": "3-document-review-risk-control",
    "C1": "enterprise-demo-video",
    "B1": "5-educational-app-children",
    "C5": "6-time-series-forecasting-energy",
    "C7": "7-document-translation",
    "Y1": "intelligent-system",
    "C6": "system",
    "P2": "10-nl2sql",
    "C8": "feature-recommendation-assistant-demo",
    "X1": "12-credit-report",
    "X2": "single",
}
TEMPLATE_FOLDER_ID = "1-intelligent-research-system"


def clean_title_from_filename(filename: str) -> str:
    name = filename.replace(".md", "")
    name = re.sub(r"^[A-Z]\d+-", "", name)
    name = name.replace(" 副本", "")
    return name.strip()


def split_lines(text: str):
    return [x.strip() for x in text.splitlines() if x.strip()]


def strip_tags(value: str) -> str:
    value = re.sub(r"<br\s*/?>", "\n", value, flags=re.I)
    value = re.sub(r"</p>\s*<p[^>]*>", "\n", value, flags=re.I)
    value = re.sub(r"<a[^>]*href=\"([^\"]+)\"[^>]*>(.*?)</a>", r"\2 (\1)", value, flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def extract_html_tables(markdown: str):
    return re.findall(r"<table[\s\S]*?</table>", markdown, flags=re.I)


def parse_table_rows(table_html: str):
    rows = []
    for row_html in re.findall(r"<tr>([\s\S]*?)</tr>", table_html, flags=re.I):
        cells = [strip_tags(c) for c in re.findall(r"<td[^>]*>([\s\S]*?)</td>", row_html, flags=re.I)]
        rows.append(cells)
    return rows


def parse_labeled_block(text: str):
    labels = {
        "概况", "分类标签", "实施周期", "团队构成",
        "业务痛点", "核心功能", "核心业务指标", "核心技术指标", "其他价值回报",
        "入选最佳实践理由", "版本基本信息", "实施详情"
    }
    parsed = {}
    current = None
    for line in split_lines(text):
        line_clean = line.replace("**", "").strip()
        if line_clean in labels:
            current = line_clean
            parsed[current] = []
            continue
        if current:
            parsed[current].append(line_clean)
    return parsed


def parse_arena_list_markdown(md_text: str, lang: str) -> List[Dict]:
    blocks = re.split(r"\n---\n", md_text)
    entries = []
    for block in blocks:
        title_match = re.search(r"###\s+\d+\.\s+(.+)", block)
        if not title_match:
            continue
        title = title_match.group(1).strip()
        id_match = re.search(r"\*\*ID\*\*:\s*`([^`]+)`", block)
        arena_id = id_match.group(1).strip() if id_match else title

        if lang == "zh":
            industry = re.search(r"\*\*行业类别\*\*:\s*(.+)", block)
            category = re.search(r"\*\*应用类别\*\*:\s*(.+)", block)
            status = re.search(r"\*\*验证状态\*\*:\s*(.+)", block)
            champion = re.search(r"\*\*擂主\*\*:\s*(.+)", block)
            challenger = re.search(r"\*\*攻擂中\*\*:\s*(.+)", block)
            highlights = re.search(r"\*\*亮点\*\*:\s*(.+)", block)
            speed = re.search(r"-\s*速度:\s*(.+)", block)
            quality = re.search(r"-\s*质量:\s*(.+)", block)
            security = re.search(r"-\s*安全:\s*(.+)", block)
            cost = re.search(r"-\s*成本:\s*(.+)", block)
        else:
            industry = re.search(r"\*\*Industry\*\*:\s*(.+)", block)
            category = re.search(r"\*\*Category\*\*:\s*(.+)", block)
            status = re.search(r"\*\*Verification Status\*\*:\s*(.+)", block)
            champion = re.search(r"\*\*Champion\*\*:\s*(.+)", block)
            challenger = re.search(r"\*\*Challenger\*\*:\s*(.+)", block)
            highlights = re.search(r"\*\*Highlights\*\*:\s*(.+)", block)
            speed = re.search(r"-\s*Speed:\s*(.+)", block)
            quality = re.search(r"-\s*Quality:\s*(.+)", block)
            security = re.search(r"-\s*Security:\s*(.+)", block)
            cost = re.search(r"-\s*Cost:\s*(.+)", block)

        entries.append(
            {
                "id": arena_id,
                "title": title,
                "industry": (industry.group(1).strip() if industry else ""),
                "category": (category.group(1).strip() if category else ""),
                "verification_status": (status.group(1).strip() if status else ""),
                "champion": (champion.group(1).strip() if champion else ""),
                "challenger": (challenger.group(1).strip() if challenger else ""),
                "highlights": (highlights.group(1).strip() if highlights else ""),
                "metric_speed": (speed.group(1).strip() if speed else ""),
                "metric_quality": (quality.group(1).strip() if quality else ""),
                "metric_security": (security.group(1).strip() if security else ""),
                "metric_cost": (cost.group(1).strip() if cost else ""),
            }
        )
    return entries


def parse_summary_markdown(md_text: str, title_zh: str):
    highlight = ""
    m = re.search(r"1\\\.\s+\*\*业务亮点\*\*[\s\S]*?\|\s*([^|\n]+?)\s*\|", md_text)
    if m:
        highlight = m.group(1).strip()

    case_no = ""
    m = re.search(r"编号[：:]\s*([A-Za-z0-9\-]+)", md_text)
    if m:
        case_no = m.group(1).strip()

    tables = extract_html_tables(md_text)
    basic_blocks = [{}, {}, {}]
    if tables:
        basic_rows = parse_table_rows(tables[0])
        if basic_rows and basic_rows[0]:
            for i, cell in enumerate(basic_rows[0][:3]):
                basic_blocks[i] = parse_labeled_block(cell)

    left = basic_blocks[0]
    mid = basic_blocks[1]
    right = basic_blocks[2]

    overview_text = " ".join(left.get("概况", [])).strip()
    cls_lines = left.get("分类标签", [])
    industry = ""
    category = ""
    for line in cls_lines:
        if line.startswith("行业类别"):
            industry = line.split("：", 1)[-1].strip()
        if line.startswith("应用类别"):
            category = line.split("：", 1)[-1].strip()
    cycle = " ".join(left.get("实施周期", [])).strip()
    team = left.get("团队构成", [])

    pain_points = mid.get("业务痛点", [])
    core_functions = mid.get("核心功能", [])
    biz_metrics = right.get("核心业务指标", [])
    tech_metrics = right.get("核心技术指标", [])
    other_values = right.get("其他价值回报", [])

    best_reason = []
    best_info = []
    best_detail = []
    if len(tables) >= 2:
        blocks = []
        for t in tables[1:4]:
            rows = parse_table_rows(t)
            if rows and rows[0]:
                blocks.append(parse_labeled_block(rows[0][0]))
        for block in blocks:
            best_reason += block.get("入选最佳实践理由", [])
            best_info += block.get("版本基本信息", [])
            best_detail += block.get("实施详情", [])

    detail_link = ""
    link_m = re.search(r"\((https?://[^)]+)\)", " ".join(best_detail))
    if link_m:
        detail_link = link_m.group(1)

    sections = [
        {
            "title": "1. 业务亮点",
            "subsections": [
                {"title": "亮点", "content": [f"- {highlight}" if highlight else f"- {title_zh}"]}
            ],
        },
        {
            "title": "2. 基本信息",
            "subsections": [
                {"title": "2.1 概况", "content": [f"**业务背景**: {overview_text}", f"**解决方案**: {title_zh}"]},
                {"title": "2.2 分类标签", "content": [f"**行业类别**: {industry}", f"**应用类别**: {category}"]},
                {"title": "2.3 实施周期", "content": [f"- {cycle}"] if cycle else []},
                {"title": "2.4 团队构成", "content": [f"- {x}" for x in team] if team else []},
                {"title": "2.5 业务痛点", "content": [f"- {x}" for x in pain_points] if pain_points else []},
                {"title": "2.6 核心功能", "content": [f"- {x}" for x in core_functions] if core_functions else []},
            ],
        },
        {
            "title": "3. 最佳实践版本",
            "subsections": [
                {"title": "3.1 版本信息", "content": [f"- {x}" for x in best_info]},
                {"title": "3.1.2 入选最佳实践理由", "content": [f"- {x}" for x in best_reason]},
                {"title": "3.1.3 实施详情", "content": [f"[实践详情]({detail_link})"] if detail_link else []},
                {"title": "3.1.4 指标", "content": [f"- {x}" for x in biz_metrics + tech_metrics + other_values]},
            ],
        },
    ]

    overview_md = "\n\n".join(
        [f"## {s['title']}\n\n" + "\n\n".join([f"### {ss['title']}\n" + "\n".join(ss["content"]) for ss in s["subsections"] if ss["content"]]) for s in sections]
    )
    return {
        "highlight": highlight,
        "industry": industry,
        "category": category,
        "cycle": cycle,
        "case_no": case_no,
        "sections": sections,
        "markdown": overview_md,
    }


def parse_detail_markdown(md_text: str):
    tables = extract_html_tables(md_text)
    phases = []
    steps = []

    for table in tables:
        rows = parse_table_rows(table)
        if not rows or not rows[0]:
            continue
        first = rows[0][0]
        if "PHASE" in first.upper():
            m = re.search(r"PHASE\s*(\d+)\s*(.*)", first, flags=re.I)
            number = int(m.group(1)) if m else len(phases) + 1
            title = (m.group(2) or "").strip() if m else first
            subs = []
            for row in rows[1:]:
                if len(row) < 2:
                    continue
                key = row[0].replace("**", "").strip()
                val_lines = split_lines(row[1])
                if not key:
                    continue
                subs.append({"title": key, "content": [f"- {x}" for x in val_lines]})
            phases.append({"number": number, "title": title, "subsections": subs})
        elif any("步骤序号" in c for r in rows for c in r):
            step = {"number": 0, "title": "", "subsections": []}
            for row in rows:
                if len(row) < 2:
                    continue
                k = row[0].replace("**", "").strip()
                v = row[1].strip()
                if k == "步骤序号":
                    try:
                        step["number"] = int(v)
                    except Exception:
                        step["number"] = len(steps) + 1
                elif k == "步骤名称":
                    step["title"] = v
                elif k:
                    step["subsections"].append({"title": k, "content": split_lines(v)})
            if step["number"] > 0:
                steps.append(step)

    impl_md_parts = []
    for p in phases:
        impl_md_parts.append(f"__PHASE {p['number']} {p['title']}__")
        for ss in p["subsections"]:
            impl_md_parts.append("")
            impl_md_parts.append(f"__{ss['title']}__")
            impl_md_parts.extend(ss["content"])
        impl_md_parts.append("")
    impl_md = "\n".join(impl_md_parts).strip()

    tech_md_parts = []
    for s in steps:
        tech_md_parts.extend([
            "__步骤序号__", str(s["number"]),
            "__步骤名称__", s["title"],
        ])
        for ss in s["subsections"]:
            if ss["title"] in {"步骤序号", "步骤名称"}:
                continue
            tech_md_parts.append(f"__{ss['title']}__")
            tech_md_parts.extend(ss["content"] or ["/"])
        tech_md_parts.append("")
    tech_md = "\n".join(tech_md_parts).strip()

    return {
        "implementation": {"phases": phases, "markdown": impl_md},
        "tech": {"steps": steps, "markdown": tech_md},
    }


def ensure_schema(conn: sqlite3.Connection):
    conn.executescript(
        """
        PRAGMA encoding = 'UTF-8';
        CREATE TABLE IF NOT EXISTS arenas (
          id TEXT PRIMARY KEY,
          folder_id TEXT NOT NULL UNIQUE,
          title_zh TEXT NOT NULL,
          title_en TEXT NOT NULL,
          category_zh TEXT NOT NULL,
          category_en TEXT NOT NULL,
          industry_zh TEXT NOT NULL,
          industry_en TEXT NOT NULL,
          verification_status TEXT NOT NULL,
          champion_zh TEXT NOT NULL,
          champion_en TEXT NOT NULL,
          challenger_zh TEXT NOT NULL,
          challenger_en TEXT NOT NULL,
          highlights_zh TEXT NOT NULL,
          highlights_en TEXT NOT NULL,
          metric_speed TEXT NOT NULL,
          metric_quality TEXT NOT NULL,
          metric_security TEXT NOT NULL,
          metric_cost TEXT NOT NULL,
          has_content INTEGER NOT NULL DEFAULT 0,
          video_file TEXT
        );
        CREATE TABLE IF NOT EXISTS arena_overview_tab (
          arena_folder_id TEXT NOT NULL,
          locale TEXT NOT NULL,
          content TEXT NOT NULL,
          data_json TEXT,
          source TEXT NOT NULL,
          source_md TEXT,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (arena_folder_id, locale)
        );
        CREATE TABLE IF NOT EXISTS arena_implementation_tab (
          arena_folder_id TEXT NOT NULL,
          locale TEXT NOT NULL,
          content TEXT NOT NULL,
          data_json TEXT,
          source TEXT NOT NULL,
          source_md TEXT,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (arena_folder_id, locale)
        );
        CREATE TABLE IF NOT EXISTS arena_tech_configuration_tab (
          arena_folder_id TEXT NOT NULL,
          locale TEXT NOT NULL,
          content TEXT NOT NULL,
          data_json TEXT,
          source TEXT NOT NULL,
          source_md TEXT,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (arena_folder_id, locale)
        );
        """
    )


def upsert_arena(conn: sqlite3.Connection, folder_id: str, base: dict):
    row = conn.execute("SELECT * FROM arenas WHERE folder_id = ?", (folder_id,)).fetchone()
    data = {
        "id": base.get("id_zh") or (row["id"] if row else folder_id),
        "folder_id": folder_id,
        "title_zh": base.get("title_zh") or (row["title_zh"] if row else folder_id),
        "title_en": base.get("title_en") or (row["title_en"] if row else base.get("title_zh", folder_id)),
        "category_zh": base.get("category_zh") or (row["category_zh"] if row else ""),
        "category_en": base.get("category_en") or (row["category_en"] if row else base.get("category_zh", "")),
        "industry_zh": base.get("industry_zh") or (row["industry_zh"] if row else ""),
        "industry_en": base.get("industry_en") or (row["industry_en"] if row else base.get("industry_zh", "")),
        "verification_status": base.get("verification_status_zh") or (row["verification_status"] if row else "验证中"),
        "champion_zh": base.get("champion_zh") or (row["champion_zh"] if row else "待补充"),
        "champion_en": base.get("champion_en") or (row["champion_en"] if row else "TBD"),
        "challenger_zh": base.get("challenger_zh") or (row["challenger_zh"] if row else ""),
        "challenger_en": base.get("challenger_en") or (row["challenger_en"] if row else ""),
        "highlights_zh": base.get("highlights_zh") or (row["highlights_zh"] if row else ""),
        "highlights_en": base.get("highlights_en") or (row["highlights_en"] if row else base.get("highlights_zh", "")),
        "metric_speed": base.get("metric_speed_zh") or (row["metric_speed"] if row else "一周"),
        "metric_quality": base.get("metric_quality_zh") or (row["metric_quality"] if row else "中等"),
        "metric_security": base.get("metric_security_zh") or (row["metric_security"] if row else "中等"),
        "metric_cost": base.get("metric_cost_zh") or (row["metric_cost"] if row else "中等"),
        "has_content": 1,
        "video_file": row["video_file"] if row else None,
    }
    conn.execute(
        """
        INSERT INTO arenas (
          id, folder_id, title_zh, title_en, category_zh, category_en, industry_zh, industry_en,
          verification_status, champion_zh, champion_en, challenger_zh, challenger_en, highlights_zh, highlights_en,
          metric_speed, metric_quality, metric_security, metric_cost, has_content, video_file
        ) VALUES (
          :id, :folder_id, :title_zh, :title_en, :category_zh, :category_en, :industry_zh, :industry_en,
          :verification_status, :champion_zh, :champion_en, :challenger_zh, :challenger_en, :highlights_zh, :highlights_en,
          :metric_speed, :metric_quality, :metric_security, :metric_cost, :has_content, :video_file
        )
        ON CONFLICT(folder_id) DO UPDATE SET
          id = excluded.id,
          title_zh = excluded.title_zh,
          title_en = excluded.title_en,
          category_zh = excluded.category_zh,
          category_en = excluded.category_en,
          industry_zh = excluded.industry_zh,
          industry_en = excluded.industry_en,
          verification_status = excluded.verification_status,
          champion_zh = excluded.champion_zh,
          champion_en = excluded.champion_en,
          challenger_zh = excluded.challenger_zh,
          challenger_en = excluded.challenger_en,
          highlights_zh = excluded.highlights_zh,
          highlights_en = excluded.highlights_en,
          metric_speed = excluded.metric_speed,
          metric_quality = excluded.metric_quality,
          metric_security = excluded.metric_security,
          metric_cost = excluded.metric_cost,
          has_content = 1
        """,
        data,
    )


def upsert_tab(conn: sqlite3.Connection, table: str, folder_id: str, payload: dict, source_md: str, source: str = "md", locale: str = "zh"):
    ts = int(time.time() * 1000)
    conn.execute(
        f"""
        INSERT INTO {table} (arena_folder_id, locale, content, data_json, source, source_md, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(arena_folder_id, locale) DO UPDATE SET
          content = excluded.content,
          data_json = excluded.data_json,
          source = excluded.source,
          source_md = excluded.source_md,
          updated_at = excluded.updated_at
        """,
        (folder_id, locale, payload["markdown"], json.dumps(payload, ensure_ascii=False), source, source_md, ts),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", required=True)
    parser.add_argument("--md-dir", required=True)
    parser.add_argument("--template-dir", required=False, default="")
    parser.add_argument("--arena-zh-md", required=False, default="")
    parser.add_argument("--arena-en-md", required=False, default="")
    parser.add_argument("--skip-arenas", action="store_true", help="Only sync tab content, do not update arenas metadata rows")
    args = parser.parse_args()

    db_path = Path(args.db)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    md_dir = Path(args.md_dir)
    template_dir = Path(args.template_dir) if args.template_dir else Path(__file__).resolve().parents[1] / "Content" / "Arena" / "All Arenas" / TEMPLATE_FOLDER_ID
    arena_zh_md = Path(args.arena_zh_md) if args.arena_zh_md else Path(__file__).resolve().parents[1] / "Content" / "Arena" / "page.zh.md"
    arena_en_md = Path(args.arena_en_md) if args.arena_en_md else Path(__file__).resolve().parents[1] / "Content" / "Arena" / "page.en.md"

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    ensure_schema(conn)

    base_by_folder: Dict[str, dict] = {}
    if not args.skip_arenas:
        zh_entries = parse_arena_list_markdown(arena_zh_md.read_text(encoding="utf-8"), "zh") if arena_zh_md.exists() else []
        en_entries = parse_arena_list_markdown(arena_en_md.read_text(encoding="utf-8"), "en") if arena_en_md.exists() else []
        folder_order = list(CODE_TO_FOLDER.values())
        for idx, folder in enumerate(folder_order):
            z = zh_entries[idx] if idx < len(zh_entries) else {}
            e = en_entries[idx] if idx < len(en_entries) else {}
            base_by_folder[folder] = {
                "id_zh": z.get("id"),
                "title_zh": z.get("title"),
                "title_en": e.get("title"),
                "industry_zh": z.get("industry"),
                "industry_en": e.get("industry"),
                "category_zh": z.get("category"),
                "category_en": e.get("category"),
                "verification_status_zh": z.get("verification_status"),
                "champion_zh": z.get("champion"),
                "champion_en": e.get("champion"),
                "challenger_zh": z.get("challenger"),
                "challenger_en": e.get("challenger"),
                "highlights_zh": z.get("highlights"),
                "highlights_en": e.get("highlights"),
                "metric_speed_zh": z.get("metric_speed"),
                "metric_quality_zh": z.get("metric_quality"),
                "metric_security_zh": z.get("metric_security"),
                "metric_cost_zh": z.get("metric_cost"),
            }

    summaries = {}
    details = {}
    for path in md_dir.glob("*.md"):
        m = re.match(r"^([A-Z]\d+)-(.+)\.md$", path.name)
        if not m:
            continue
        code = m.group(1)
        content = path.read_text(encoding="utf-8")
        if "实践详情" in path.name:
            details[code] = (path, content)
        else:
            summaries[code] = (path, content)

    for code, folder in CODE_TO_FOLDER.items():
        if folder == TEMPLATE_FOLDER_ID:
            continue
        summary_path, summary_text = summaries.get(code, (None, ""))
        detail_path, detail_text = details.get(code, (None, ""))
        title_zh = clean_title_from_filename(summary_path.name if summary_path else f"{code}-未命名.md")

        summary = parse_summary_markdown(summary_text, title_zh) if summary_text else {
            "highlight": title_zh, "industry": "", "category": "", "cycle": "一周",
            "sections": [{"title": "1. 基本信息", "subsections": [{"title": "1.1 概况", "content": [f"**业务背景**: {title_zh}"]}]}],
            "markdown": f"## 1. 基本信息\n\n### 1.1 概况\n**业务背景**: {title_zh}",
        }
        detail = parse_detail_markdown(detail_text) if detail_text else {
            "implementation": {"phases": [], "markdown": "__PHASE 1 待补充__\n\n__实施内容__\n- 待补充"},
            "tech": {"steps": [], "markdown": "__步骤序号__\n1\n__步骤名称__\n待补充\n__步骤定义__\n待补充"},
        }

        if not args.skip_arenas:
            upsert_arena(conn, folder, base_by_folder.get(folder, {}))
        upsert_tab(conn, "arena_overview_tab", folder, summary, str(summary_path or ""))
        upsert_tab(conn, "arena_implementation_tab", folder, detail["implementation"], str(detail_path or ""))
        upsert_tab(conn, "arena_tech_configuration_tab", folder, detail["tech"], str(detail_path or ""))
        # Keep EN route available by duplicating normalized content
        upsert_tab(conn, "arena_overview_tab", folder, summary, str(summary_path or ""), source="md", locale="en")
        upsert_tab(conn, "arena_implementation_tab", folder, detail["implementation"], str(detail_path or ""), source="md", locale="en")
        upsert_tab(conn, "arena_tech_configuration_tab", folder, detail["tech"], str(detail_path or ""), source="md", locale="en")

    # Ensure template arena metadata row exists
    if not args.skip_arenas:
        upsert_arena(conn, TEMPLATE_FOLDER_ID, base_by_folder.get(TEMPLATE_FOLDER_ID, {}))

    # Keep 1-intelligent-research-system fixed as template data from content files
    template_files = {
        "arena_overview_tab": template_dir / "overview.zh.md",
        "arena_implementation_tab": template_dir / "implementation.zh.md",
        "arena_tech_configuration_tab": template_dir / "tech-configuration.zh.md",
    }
    template_files_en = {
        "arena_overview_tab": template_dir / "overview.en.md",
        "arena_implementation_tab": template_dir / "implementation.en.md",
        "arena_tech_configuration_tab": template_dir / "tech-configuration.en.md",
    }
    for table, file_path in template_files.items():
        if file_path.exists():
            md = file_path.read_text(encoding="utf-8")
            payload = {"markdown": md, "template": True, "folder_id": TEMPLATE_FOLDER_ID}
            upsert_tab(conn, table, TEMPLATE_FOLDER_ID, payload, str(file_path), source="template-fixed", locale="zh")
    for table, file_path in template_files_en.items():
        if file_path.exists():
            md = file_path.read_text(encoding="utf-8")
            payload = {"markdown": md, "template": True, "folder_id": TEMPLATE_FOLDER_ID}
            upsert_tab(conn, table, TEMPLATE_FOLDER_ID, payload, str(file_path), source="template-fixed", locale="en")

    conn.commit()
    conn.close()
    print("md_to_sqlite sync complete")


if __name__ == "__main__":
    main()
