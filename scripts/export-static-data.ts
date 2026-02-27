import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import type { Arena } from '@/lib/types';
import { arenas as fallbackArenas } from '@/lib/data';

const SQLITE_PATH = path.join(process.cwd(), 'Content', 'Arena', 'data', 'rwai-arena.sqlite');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const ARENAS_JSON_PATH = path.join(PUBLIC_DATA_DIR, 'arenas.json');
const ARENA_CONTENT_JSON_PATH = path.join(PUBLIC_DATA_DIR, 'arena-content.json');
const SQLITE_EXPORT_JSON_PATH = path.join(PUBLIC_DATA_DIR, 'sqlite-export.json');

type ArenaContentMap = Record<string, Record<string, Record<string, string>>>;

function ensureOutputDir() {
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    console.warn(`[export-static-data] failed to parse existing JSON: ${filePath}`, error);
    return null;
  }
}

function buildArenaFromSqliteRow(row: any): Arena {
  const verificationStatus = row.verification_status_zh ?? row.verification_status ?? '';
  return {
    id: row.id,
    folderId: row.folder_id,
    title: { zh: row.title_zh, en: row.title_en },
    category: row.category_zh,
    categoryEn: row.category_en,
    industry: row.industry_zh,
    industryEn: row.industry_en,
    verificationStatus,
    champion: row.champion_zh,
    championEn: row.champion_en,
    challenger: row.challenger_zh,
    challengerEn: row.challenger_en,
    highlights: row.highlights_zh,
    highlightsEn: row.highlights_en,
    metrics: {
      speed: row.speed_zh ?? row.metric_speed ?? '',
      quality: row.quality_zh ?? row.metric_quality ?? '',
      security: row.security_zh ?? row.metric_security ?? '',
      cost: row.cost_zh ?? row.metric_cost ?? '',
    },
    hasContent: !!row.has_content,
    videoFile: row.video_file || undefined,
  };
}

function buildDataFromSqlite() {
  const db = new Database(SQLITE_PATH, { readonly: true });

  const arenaRows = db.prepare('SELECT * FROM arenas ORDER BY CAST(id AS INTEGER) ASC').all();
  const arenas = arenaRows.map(buildArenaFromSqliteRow);

  const contentRows = db.prepare(`
    SELECT arena_folder_id, tab_key, locale, content
    FROM arena_contents
  `).all() as Array<{ arena_folder_id: string; tab_key: string; locale: string; content: string }>;

  const overviewRows = db.prepare(`
    SELECT arena_folder_id, locale, content
    FROM arena_overview_tab
  `).all() as Array<{ arena_folder_id: string; locale: string; content: string }>;

  const implementationRows = db.prepare(`
    SELECT arena_folder_id, locale, content
    FROM arena_implementation_tab
  `).all() as Array<{ arena_folder_id: string; locale: string; content: string }>;

  const techConfigRows = db.prepare(`
    SELECT arena_folder_id, locale, content
    FROM arena_tech_configuration_tab
  `).all() as Array<{ arena_folder_id: string; locale: string; content: string }>;

  db.close();

  const contentMap: ArenaContentMap = {};

  function setContent(folderId: string, locale: string, tabKey: string, content: string) {
    if (!folderId || !locale || !tabKey || !content) {
      return;
    }
    contentMap[folderId] = contentMap[folderId] || {};
    contentMap[folderId][locale] = contentMap[folderId][locale] || {};
    contentMap[folderId][locale][tabKey] = content;
  }

  for (const row of contentRows) {
    setContent(row.arena_folder_id, row.locale, row.tab_key, row.content);
  }

  // Structured tab tables should override generic arena_contents
  for (const row of overviewRows) {
    setContent(row.arena_folder_id, row.locale, 'overview', row.content);
  }
  for (const row of implementationRows) {
    setContent(row.arena_folder_id, row.locale, 'implementation', row.content);
  }
  for (const row of techConfigRows) {
    setContent(row.arena_folder_id, row.locale, 'tech-configuration', row.content);
  }

  return {
    arenas,
    contentMap,
    rawTables: {
      arenas: arenaRows,
      arena_contents: contentRows,
      arena_overview_tab: overviewRows,
      arena_implementation_tab: implementationRows,
      arena_tech_configuration_tab: techConfigRows,
    },
  };
}

function main() {
  ensureOutputDir();

  const hasSqlite = fs.existsSync(SQLITE_PATH);
  const now = new Date().toISOString();

  if (hasSqlite) {
    const sqliteData = buildDataFromSqlite();

    // Always overwrite old exported files, and prioritize SQLite source of truth.
    writeJson(ARENAS_JSON_PATH, sqliteData.arenas);
    writeJson(ARENA_CONTENT_JSON_PATH, sqliteData.contentMap);
    writeJson(SQLITE_EXPORT_JSON_PATH, {
      source: 'sqlite',
      exportedAt: now,
      sqlitePath: SQLITE_PATH,
      ...sqliteData.rawTables,
    });

    console.log(`[export-static-data] source=sqlite`);
    console.log(`[export-static-data] wrote ${ARENAS_JSON_PATH}`);
    console.log(`[export-static-data] wrote ${ARENA_CONTENT_JSON_PATH}`);
    console.log(`[export-static-data] wrote ${SQLITE_EXPORT_JSON_PATH}`);
    return;
  }

  // Keep checked-in exported JSON when SQLite is absent to avoid content regression in CI.
  const existingArenas = readJsonIfExists<Arena[]>(ARENAS_JSON_PATH);
  const existingArenaContent = readJsonIfExists<ArenaContentMap>(ARENA_CONTENT_JSON_PATH);
  const existingArenaCount = Array.isArray(existingArenas) ? existingArenas.length : 0;
  const existingContentArenaCount = existingArenaContent ? Object.keys(existingArenaContent).length : 0;

  if (existingArenaCount > 0 && existingContentArenaCount > 0) {
    writeJson(SQLITE_EXPORT_JSON_PATH, {
      source: 'existing-json',
      exportedAt: now,
      sqlitePath: SQLITE_PATH,
      message: 'SQLite file not found; kept existing exported JSON files from repository.',
      existingArenaCount,
      existingContentArenaCount,
    });

    console.log(`[export-static-data] source=existing-json`);
    console.log(`[export-static-data] kept ${ARENAS_JSON_PATH}`);
    console.log(`[export-static-data] kept ${ARENA_CONTENT_JSON_PATH}`);
    console.log(`[export-static-data] wrote ${SQLITE_EXPORT_JSON_PATH}`);
    return;
  }

  // Final fallback path when SQLite and checked-in JSON are both unavailable.
  // Do not read markdown from Content/Arena/All Arenas here.
  writeJson(ARENAS_JSON_PATH, fallbackArenas);
  writeJson(ARENA_CONTENT_JSON_PATH, {});
  writeJson(SQLITE_EXPORT_JSON_PATH, {
    source: 'fallback',
    exportedAt: now,
    sqlitePath: SQLITE_PATH,
    message: 'SQLite file not found; exported fallback data from lib/data.ts only.',
  });

  console.log(`[export-static-data] source=fallback`);
  console.log(`[export-static-data] wrote ${ARENAS_JSON_PATH}`);
  console.log(`[export-static-data] wrote ${ARENA_CONTENT_JSON_PATH}`);
  console.log(`[export-static-data] wrote ${SQLITE_EXPORT_JSON_PATH}`);
}

main();
