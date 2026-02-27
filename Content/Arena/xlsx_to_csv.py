#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import posixpath
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL_DOC = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"m": NS_MAIN, "r": NS_REL_DOC, "pr": NS_PKG_REL}


def sanitize_sheet_name(name: str) -> str:
    safe = "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in name.strip())
    return safe or "Sheet"


def col_letters_to_index(ref: str) -> int:
    match = re.match(r"([A-Za-z]+)", ref)
    if not match:
        return 0
    letters = match.group(1).upper()
    index = 0
    for ch in letters:
        index = index * 26 + (ord(ch) - ord("A") + 1)
    return max(index - 1, 0)


def load_xml(zipf: zipfile.ZipFile, name: str) -> ET.Element:
    with zipf.open(name) as f:
        return ET.parse(f).getroot()


def parse_shared_strings(zipf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zipf.namelist():
        return []

    root = load_xml(zipf, "xl/sharedStrings.xml")
    items: list[str] = []
    for si in root.findall("m:si", NS):
        text_parts = [t.text or "" for t in si.findall(".//m:t", NS)]
        items.append("".join(text_parts))
    return items


def parse_sheet_paths(zipf: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = load_xml(zipf, "xl/workbook.xml")
    rels = load_xml(zipf, "xl/_rels/workbook.xml.rels")

    rel_map: dict[str, str] = {}
    for rel in rels.findall("pr:Relationship", NS):
        rel_id = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if rel_id and target:
            full_path = posixpath.normpath(posixpath.join("xl", target))
            rel_map[rel_id] = full_path

    results: list[tuple[str, str]] = []
    for sheet in workbook.findall("m:sheets/m:sheet", NS):
        name = sheet.attrib.get("name", "Sheet")
        rel_id = sheet.attrib.get(f"{{{NS_REL_DOC}}}id")
        if not rel_id:
            continue
        path = rel_map.get(rel_id)
        if path and path in zipf.namelist():
            results.append((name, path))

    return results


def read_cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")

    if cell_type == "inlineStr":
        parts = [t.text or "" for t in cell.findall(".//m:t", NS)]
        return "".join(parts)

    v = cell.find("m:v", NS)
    if v is None or v.text is None:
        return ""

    raw = v.text
    if cell_type == "s":
        try:
            return shared_strings[int(raw)]
        except (ValueError, IndexError):
            return raw
    if cell_type == "b":
        return "TRUE" if raw == "1" else "FALSE"
    return raw


def parse_sheet_rows(zipf: zipfile.ZipFile, sheet_path: str, shared_strings: list[str]) -> list[list[str]]:
    root = load_xml(zipf, sheet_path)

    row_maps: list[dict[int, str]] = []
    max_col = 0

    for row in root.findall("m:sheetData/m:row", NS):
        row_map: dict[int, str] = {}
        for cell in row.findall("m:c", NS):
            ref = cell.attrib.get("r", "")
            col_idx = col_letters_to_index(ref)
            row_map[col_idx] = read_cell_value(cell, shared_strings)
            if col_idx + 1 > max_col:
                max_col = col_idx + 1
        row_maps.append(row_map)

    if max_col == 0:
        return []

    rows: list[list[str]] = []
    for row_map in row_maps:
        values = [""] * max_col
        for idx, val in row_map.items():
            if 0 <= idx < max_col:
                values[idx] = val
        rows.append(values)

    return rows


def to_csv(xlsx_path: Path) -> list[Path]:
    if not xlsx_path.exists():
        raise FileNotFoundError(f"File not found: {xlsx_path}")

    outputs: list[Path] = []
    with zipfile.ZipFile(xlsx_path, "r") as zipf:
        shared_strings = parse_shared_strings(zipf)
        sheets = parse_sheet_paths(zipf)

        if not sheets:
            raise ValueError("No worksheets found in workbook.")

        # 只处理 sheet1，跳过 sheet2、sheet3
        sheet_name, sheet_path = sheets[0]
        out_path = xlsx_path.with_suffix(".csv")

        rows = parse_sheet_rows(zipf, sheet_path, shared_strings)

        # 删除第一行
        if rows:
            rows = rows[1:]

        # 删除最后一行
        if rows:
            rows = rows[:-1]

        # 删除第一列（索引为 0，A 列）
        for row in rows:
            if row:
                row.pop(0)

        
        # 删除全部空行（所有列都为空）
        rows = [row for row in rows if any(cell.strip() for cell in row)]

        with out_path.open("w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerows(rows)

        outputs.append(out_path)

    return outputs


def main() -> None:
    default_file = Path(__file__).resolve().parent / "List of Arenas.xlsx"

    parser = argparse.ArgumentParser(
        description="Convert an .xlsx file to CSV file(s) in the same directory."
    )
    parser.add_argument(
        "xlsx",
        nargs="?",
        default=str(default_file),
        help="Path to the .xlsx file (default: Content/Arena/List of Arenas.xlsx)",
    )
    args = parser.parse_args()

    xlsx_path = Path(args.xlsx).expanduser().resolve()
    outputs = to_csv(xlsx_path)

    print(f"Input: {xlsx_path}")
    for p in outputs:
        print(f"Generated: {p}")


if __name__ == "__main__":
    main()
