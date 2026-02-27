#!/usr/bin/env python3
import argparse
import csv
import re
import sqlite3
from pathlib import Path
from typing import Dict, List

ARENA_NO_TO_FOLDER_ID: Dict[int, str] = {
    1: "1-intelligent-research-system",
    2: "2-business-dashboard-website",
    3: "3-document-review-risk-control",
    4: "enterprise-demo-video",
    5: "5-educational-app-children",
    6: "6-time-series-forecasting-energy",
    7: "7-document-translation",
    8: "intelligent-system",
    9: "system",
    10: "10-nl2sql",
    11: "feature-recommendation-assistant-demo",
    12: "12-credit-report",
    13: "single",
}

TITLE_EN_MAP: Dict[str, str] = {
    "智能调研报告生成": "Enterprise-Level Intelligent Research Report Generation System Demo",
    "业务看板搭建": "Business Dashboard & Website Demo",
    "文档审核与风控": "Document Review & Risk Control Demo",
    "企业演示视频": "Enterprise Demo Video",
    "儿童教育趣味应用": "Educational App for Children Demo",
    "长时间序列预测系统": "Long-Term Time Series Forecasting System Demo (Energy)",
    "智能文档翻译系统": "Intelligent Document Translation System Demo",
    "智能合同法审系统": "Intelligent Contract Legal Review System Demo",
    "通用目标检测系统": "Universal Object Detection System Demo",
    "SQL语言智能生成": "Universal Practice of SQL Language Intelligent Generation (NL2SQL)",
    "功能推荐助手": "Feature Recommendation Assistant Demo",
    "智能信贷报告生成系统": "Intelligent Credit Report Generation System Demo",
    "单条产业链图谱": "Single Industrial Chain Graph",
}

CATEGORY_EN_MAP: Dict[str, str] = {
    "服务": "Service",
    "运营": "Operations",
    "管理": "Management",
    "营销": "Marketing",
    "风控": "Risk Control",
    "通用": "General",
}

INDUSTRY_EN_MAP: Dict[str, str] = {
    "信息技术": "Information Technology",
    "金融贸易": "Finance & Trade",
    "科研教育": "Science & Education",
    "能源制造": "Energy & Manufacturing",
    "行政管理": "Administration",
    "文化体育": "Culture & Sports",
    "通用": "General",
    "农林牧渔": "Agriculture, Forestry, Animal Husbandry & Fishery",
}

VERIFICATION_STATUS_EN_MAP: Dict[str, str] = {
    "已验证": "Verified",
    "验证中": "In Verification",
}

METRIC_EN_MAP: Dict[str, str] = {
    "一周": "One Week",
    "1~2天": "1-2 Days",
    "很高": "Very High",
    "较高": "Relatively High",
    "中等": "Medium",
    "较低": "Relatively Low",
    "较优": "Optimal",
}

HIGHLIGHTS_EN_MAP: Dict[str, str] = {
    "一周构建1个包含资料搜集、知识整合、报告生成功能的智能调研系统Demo": "Build an intelligent research system demo with data collection, knowledge integration, and report generation in one week",
    "0技术门槛1-2日内搭建出1个有基础互动能力的业务看板或网站Demo": "Build a business dashboard or website demo with basic interactivity in 1-2 days with zero technical threshold",
    "一周构建1个完整性检查与风险评估的文档解析系统Demo": "Build a document parsing system demo with completeness checks and risk assessment in one week",
    "最快2.5日内生成1个企业级产品或功能简要演示视频": "Generate an enterprise-level product or feature demo video in as fast as 2.5 days",
    "一周搭建一个儿童教育应用Demo": "Build a children’s educational app demo in one week",
    "一周用低代码快速构建并验证一个面向能源领域的长时间序列预测系统Demo": "Rapidly build and verify a low-code long-term time-series forecasting demo for the energy sector in one week",
    "一周快速构建1个智能文档翻译Demo": "Rapidly build an intelligent document translation demo in one week",
    "一天搭建出基于要素抽取与跨合同规则校验、可配置与溯源的智能合同法审系统Demo": "Build an intelligent contract legal review demo with element extraction, cross-contract rule checks, configurability, and traceability in one day",
    "一周构建1个高精度、含数据流闭环、具备自进化能力的通用目标检测系统Demo": "Build a high-precision universal object detection demo with closed-loop data flow and self-evolution capability in one week",
    "快速搭建一个大模型，通过对话生成SQL脚本": "Rapidly build a large model that generates SQL scripts via conversation",
    "一周基于低代码构建一个具备主动追问与推荐能力的对话式助手Demo": "Build a low-code conversational assistant demo with active follow-up and recommendation capability in one week",
    "一周低代码构建具备多源数据整合、合规校验、信贷报告一键生成能力的银行智能信贷系统Demo": "Build a low-code banking intelligent credit demo with multi-source data integration, compliance checks, and one-click credit report generation in one week",
    "一周低代码完成单条全国产业链图谱全流程构建": "Complete full-process construction of a single national industrial-chain graph with low code in one week",
}

PREFIX_EN_MAP: Dict[str, str] = {
    "私部署版：": "Private Deployment: ",
    "云端版：": "Cloud Version: ",
}

SPECIAL_CHALLENGER_EN_MAP: Dict[str, str] = {
    "寻找攻擂者": "Looking for Challengers",
    "暂无": "None",
}

CSV_ZH_TO_KEY: Dict[str, str] = {
    "擂台编号": "arena_no",
    "擂台名称": "title_zh",
    "本周擂主": "champion_zh",
    "验证状态": "verification_status_zh",
    "亮点": "highlights_zh",
    "行业类别": "industry_zh",
    "应用类别": "category_zh",
    "速度": "speed_zh",
    "质量": "quality_zh",
    "安全": "security_zh",
    "成本": "cost_zh",
    "攻擂中": "challenger_zh",
}

OUTPUT_FIELDNAMES: List[str] = [
    "arena_no",
    "title_zh",
    "title_en",
    "champion_zh",
    "champion_en",
    "verification_status_zh",
    "verification_status_en",
    "highlights_zh",
    "highlights_en",
    "industry_zh",
    "industry_en",
    "category_zh",
    "category_en",
    "speed_zh",
    "speed_en",
    "quality_zh",
    "quality_en",
    "security_zh",
    "security_en",
    "cost_zh",
    "cost_en",
    "challenger_zh",
    "challenger_en",
]


def split_list_value(text: str) -> List[str]:
    return [x.strip() for x in re.split(r"[,，]", text or "") if x.strip()]


def translate_joined(value: str, mapper: Dict[str, str]) -> str:
    return ", ".join([mapper.get(item, item) for item in split_list_value(value)])


def normalize_title_zh(title: str) -> str:
    normalized = (title or "").strip()
    if normalized.lower() == "sql语言智能生成":
        return "SQL语言智能生成"
    return normalized


def translate_stack_text(value: str) -> str:
    text = (value or "").strip()
    if text in SPECIAL_CHALLENGER_EN_MAP:
        return SPECIAL_CHALLENGER_EN_MAP[text]
    for zh, en in PREFIX_EN_MAP.items():
        text = text.replace(zh, en)
    text = text.replace("（", "(").replace("）", ")")
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" +", " + ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_zh_csv(csv_path: Path) -> List[Dict[str, str]]:
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise RuntimeError(f"CSV has no header: {csv_path}")
        rows: List[Dict[str, str]] = []
        for raw in reader:
            mapped: Dict[str, str] = {}
            for zh_col, key in CSV_ZH_TO_KEY.items():
                mapped[key] = (raw.get(zh_col) or "").strip()
            rows.append(mapped)
    return rows


def build_bilingual_rows(rows: List[Dict[str, str]]) -> List[Dict[str, str]]:
    output: List[Dict[str, str]] = []
    for row in rows:
        title_zh = normalize_title_zh(row["title_zh"])
        out = {
            "arena_no": row["arena_no"],
            "title_zh": title_zh,
            "title_en": TITLE_EN_MAP.get(title_zh, title_zh),
            "champion_zh": row["champion_zh"],
            "champion_en": translate_stack_text(row["champion_zh"]),
            "verification_status_zh": row["verification_status_zh"],
            "verification_status_en": VERIFICATION_STATUS_EN_MAP.get(row["verification_status_zh"], row["verification_status_zh"]),
            "highlights_zh": row["highlights_zh"],
            "highlights_en": HIGHLIGHTS_EN_MAP.get(row["highlights_zh"], row["highlights_zh"]),
            "industry_zh": row["industry_zh"],
            "industry_en": translate_joined(row["industry_zh"], INDUSTRY_EN_MAP),
            "category_zh": row["category_zh"],
            "category_en": translate_joined(row["category_zh"], CATEGORY_EN_MAP),
            "speed_zh": row["speed_zh"],
            "speed_en": METRIC_EN_MAP.get(row["speed_zh"], row["speed_zh"]),
            "quality_zh": row["quality_zh"],
            "quality_en": METRIC_EN_MAP.get(row["quality_zh"], row["quality_zh"]),
            "security_zh": row["security_zh"],
            "security_en": METRIC_EN_MAP.get(row["security_zh"], row["security_zh"]),
            "cost_zh": row["cost_zh"],
            "cost_en": METRIC_EN_MAP.get(row["cost_zh"], row["cost_zh"]),
            "challenger_zh": row["challenger_zh"],
            "challenger_en": translate_stack_text(row["challenger_zh"]),
        }
        output.append(out)
    return output


def write_en_csv(csv_path: Path, rows: List[Dict[str, str]]) -> None:
    with csv_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def ensure_arenas_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA encoding = 'UTF-8';
        CREATE TABLE IF NOT EXISTS arenas (
          id TEXT PRIMARY KEY,
          folder_id TEXT NOT NULL UNIQUE,
          title_zh TEXT NOT NULL,
          title_en TEXT NOT NULL,
          champion_zh TEXT NOT NULL,
          champion_en TEXT NOT NULL,
          verification_status_zh TEXT NOT NULL,
          verification_status_en TEXT NOT NULL,
          highlights_zh TEXT NOT NULL,
          highlights_en TEXT NOT NULL,
          industry_zh TEXT NOT NULL,
          industry_en TEXT NOT NULL,
          category_zh TEXT NOT NULL,
          category_en TEXT NOT NULL,
          speed_zh TEXT NOT NULL,
          speed_en TEXT NOT NULL,
          quality_zh TEXT NOT NULL,
          quality_en TEXT NOT NULL,
          security_zh TEXT NOT NULL,
          security_en TEXT NOT NULL,
          cost_zh TEXT NOT NULL,
          cost_en TEXT NOT NULL,
          challenger_zh TEXT NOT NULL,
          challenger_en TEXT NOT NULL,
          has_content INTEGER NOT NULL DEFAULT 0,
          video_file TEXT
        );
        """
    )


def table_columns(conn: sqlite3.Connection, table_name: str) -> List[str]:
    rows = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
    return [r[1] for r in rows]


def row_to_dict(row: sqlite3.Row) -> Dict[str, str]:
    return {k: row[k] for k in row.keys()}


def migrate_arenas_table_if_needed(conn: sqlite3.Connection) -> None:
    exists = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='arenas'"
    ).fetchone()
    if not exists:
        ensure_arenas_schema(conn)
        return

    columns = set(table_columns(conn, "arenas"))
    required = {
        "id", "folder_id", "title_zh", "title_en", "champion_zh", "champion_en",
        "verification_status_zh", "verification_status_en", "highlights_zh", "highlights_en",
        "industry_zh", "industry_en", "category_zh", "category_en", "speed_zh", "speed_en",
        "quality_zh", "quality_en", "security_zh", "security_en", "cost_zh", "cost_en",
        "challenger_zh", "challenger_en", "has_content", "video_file",
    }
    if required.issubset(columns) and "arena_no" not in columns:
        return

    conn.execute("DROP TABLE IF EXISTS arenas_backup_for_migration")
    conn.execute("ALTER TABLE arenas RENAME TO arenas_backup_for_migration")
    ensure_arenas_schema(conn)

    backup_cols = set(table_columns(conn, "arenas_backup_for_migration"))
    rows = conn.execute("SELECT * FROM arenas_backup_for_migration").fetchall()

    for row in rows:
        d = row_to_dict(row)
        arena_no = None
        if "arena_no" in backup_cols and d.get("arena_no"):
            arena_no = int(d.get("arena_no"))
        if not arena_no and d.get("id") and str(d.get("id")).isdigit():
            arena_no = int(str(d.get("id")))
        if not arena_no:
            arena_no_match = re.match(r"^(\\d+)-", d.get("folder_id", "") or "")
            if arena_no_match:
                arena_no = int(arena_no_match.group(1))

        conn.execute(
            """
            INSERT OR REPLACE INTO arenas (
              id, folder_id, title_zh, title_en,
              champion_zh, champion_en,
              verification_status_zh, verification_status_en,
              highlights_zh, highlights_en,
              industry_zh, industry_en, category_zh, category_en,
              speed_zh, speed_en, quality_zh, quality_en, security_zh, security_en, cost_zh, cost_en,
              challenger_zh, challenger_en,
              has_content, video_file
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(arena_no or d.get("id") or ""),
                d.get("folder_id") or "",
                d.get("title_zh") or "",
                d.get("title_en") or d.get("title_zh") or "",
                d.get("champion_zh") or "",
                d.get("champion_en") or d.get("champion_zh") or "",
                d.get("verification_status_zh") or d.get("verification_status") or "验证中",
                d.get("verification_status_en") or "In Verification",
                d.get("highlights_zh") or "",
                d.get("highlights_en") or d.get("highlights_zh") or "",
                d.get("industry_zh") or "",
                d.get("industry_en") or d.get("industry_zh") or "",
                d.get("category_zh") or "",
                d.get("category_en") or d.get("category_zh") or "",
                d.get("speed_zh") or d.get("metric_speed") or "",
                d.get("speed_en") or d.get("speed_zh") or d.get("metric_speed") or "",
                d.get("quality_zh") or d.get("metric_quality") or "",
                d.get("quality_en") or d.get("quality_zh") or d.get("metric_quality") or "",
                d.get("security_zh") or d.get("metric_security") or "",
                d.get("security_en") or d.get("security_zh") or d.get("metric_security") or "",
                d.get("cost_zh") or d.get("metric_cost") or "",
                d.get("cost_en") or d.get("cost_zh") or d.get("metric_cost") or "",
                d.get("challenger_zh") or "",
                d.get("challenger_en") or d.get("challenger_zh") or "",
                d.get("has_content") or 0,
                d.get("video_file"),
            ),
        )


def fetch_existing_meta_by_folder(conn: sqlite3.Connection) -> Dict[str, Dict[str, str]]:
    rows = conn.execute("SELECT folder_id, id, has_content, video_file FROM arenas").fetchall()
    result: Dict[str, Dict[str, str]] = {}
    for row in rows:
        result[row[0]] = {
            "id": row[1],
            "has_content": row[2],
            "video_file": row[3],
        }
    return result


def upsert_arenas(conn: sqlite3.Connection, rows: List[Dict[str, str]]) -> None:
    existing_meta = fetch_existing_meta_by_folder(conn)

    conn.execute("DELETE FROM arenas")
    for row in rows:
        arena_no = int(row["arena_no"])
        folder_id = ARENA_NO_TO_FOLDER_ID.get(arena_no, f"arena-{arena_no}")
        old = existing_meta.get(folder_id, {})
        arena_id = str(arena_no)

        conn.execute(
            """
            INSERT INTO arenas (
              id, folder_id,
              title_zh, title_en,
              champion_zh, champion_en,
              verification_status_zh, verification_status_en,
              highlights_zh, highlights_en,
              industry_zh, industry_en,
              category_zh, category_en,
              speed_zh, speed_en,
              quality_zh, quality_en,
              security_zh, security_en,
              cost_zh, cost_en,
              challenger_zh, challenger_en,
              has_content, video_file
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                arena_id,
                folder_id,
                row["title_zh"],
                row["title_en"],
                row["champion_zh"],
                row["champion_en"],
                row["verification_status_zh"],
                row["verification_status_en"],
                row["highlights_zh"],
                row["highlights_en"],
                row["industry_zh"],
                row["industry_en"],
                row["category_zh"],
                row["category_en"],
                row["speed_zh"],
                row["speed_en"],
                row["quality_zh"],
                row["quality_en"],
                row["security_zh"],
                row["security_en"],
                row["cost_zh"],
                row["cost_en"],
                row["challenger_zh"],
                row["challenger_en"],
                int(old.get("has_content") or 0),
                old.get("video_file"),
            ),
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync arena CSV data into SQLite arenas table")
    parser.add_argument("--csv-zh", required=True, help="Path to source Chinese CSV")
    parser.add_argument("--csv-en", required=True, help="Path to generated bilingual/en CSV")
    parser.add_argument("--db", required=True, help="Path to SQLite db")
    args = parser.parse_args()

    csv_zh = Path(args.csv_zh)
    csv_en = Path(args.csv_en)
    db_path = Path(args.db)

    if not csv_zh.exists():
        raise FileNotFoundError(f"Source CSV not found: {csv_zh}")

    zh_rows = parse_zh_csv(csv_zh)
    bi_rows = build_bilingual_rows(zh_rows)
    write_en_csv(csv_en, bi_rows)

    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    try:
        migrate_arenas_table_if_needed(conn)
        upsert_arenas(conn, bi_rows)
        conn.execute("DROP TABLE IF EXISTS arenas_backup_for_migration")
        conn.commit()
    finally:
        conn.close()

    print(f"Generated bilingual csv: {csv_en}")
    print(f"Synced arenas rows: {len(bi_rows)}")


if __name__ == "__main__":
    main()
