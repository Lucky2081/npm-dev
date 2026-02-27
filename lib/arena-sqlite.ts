import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import Database from 'better-sqlite3';
import type { Arena } from '@/lib/types';

const DB_DIR = path.join(process.cwd(), 'Content', 'Arena', 'data');
const DB_PATH = path.join(DB_DIR, 'rwai-arena.sqlite');
const MD_SYNC_SCRIPT = path.join(process.cwd(), 'scripts', 'md_to_sqlite.py');
const CSV_SYNC_SCRIPT = path.join(process.cwd(), 'scripts', 'sync_arenas_csv_to_sqlite.py');
const MD_SOURCE_DIR = path.join(DB_DIR, 'md');
const ARENA_ZH_CSV = path.join(process.cwd(), 'Content', 'Arena', 'List of Arenas.csv');
const ARENA_EN_CSV = path.join(process.cwd(), 'Content', 'Arena', 'List of Arenas.en.csv');
const STRUCTURED_TAB_TABLE: Record<string, string> = {
  overview: 'arena_overview_tab',
  implementation: 'arena_implementation_tab',
  'tech-configuration': 'arena_tech_configuration_tab',
};

let db: Database.Database | null = null;
let initialized = false;

function getDb() {
  if (!db) {
    const isNewDatabase = !fs.existsSync(DB_PATH);
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    if (isNewDatabase) {
      db.exec(`PRAGMA encoding = 'UTF-8'`);
    }
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function ensureSchema() {
  const conn = getDb();
  conn.exec(`
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

    CREATE TABLE IF NOT EXISTS arena_contents (
      arena_folder_id TEXT NOT NULL,
      tab_key TEXT NOT NULL,
      locale TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (arena_folder_id, tab_key, locale)
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
  `);
}
function ensureColumnExists(tableName: string, columnName: string, columnType: string) {
  const conn = getDb();
  const columns = conn.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  if (!columns.some((c) => c.name === columnName)) {
    conn.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  }
}

function ensureStructuredColumns() {
  ensureColumnExists('arena_overview_tab', 'data_json', 'TEXT');
  ensureColumnExists('arena_overview_tab', 'source_md', 'TEXT');
  ensureColumnExists('arena_implementation_tab', 'data_json', 'TEXT');
  ensureColumnExists('arena_implementation_tab', 'source_md', 'TEXT');
  ensureColumnExists('arena_tech_configuration_tab', 'data_json', 'TEXT');
  ensureColumnExists('arena_tech_configuration_tab', 'source_md', 'TEXT');
}

function runPythonArenaCsvSync() {
  if (!fs.existsSync(CSV_SYNC_SCRIPT) || !fs.existsSync(ARENA_ZH_CSV)) {
    return;
  }
  const result = spawnSync('python3', [CSV_SYNC_SCRIPT, '--csv-zh', ARENA_ZH_CSV, '--csv-en', ARENA_EN_CSV, '--db', DB_PATH], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });
  if (result.status !== 0) {
    console.error('[arena-sqlite] sync_arenas_csv_to_sqlite.py failed', result.stderr || result.stdout);
  }
}

function runPythonMdSync() {
  if (!fs.existsSync(MD_SYNC_SCRIPT)) {
    return;
  }
  const result = spawnSync('python3', [MD_SYNC_SCRIPT, '--db', DB_PATH, '--md-dir', MD_SOURCE_DIR, '--skip-arenas'], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });
  if (result.status !== 0) {
    console.error('[arena-sqlite] md_to_sqlite.py failed', result.stderr || result.stdout);
  }
}

export function ensureArenaSqliteReady() {
  if (initialized) {
    return;
  }
  ensureSchema();
  ensureStructuredColumns();
  runPythonArenaCsvSync();
  runPythonMdSync();
  initialized = true;
}

function mapArenaRow(row: any): Arena {
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

export async function getAllArenasFromSqlite(): Promise<Arena[]> {
  ensureArenaSqliteReady();
  const rows = getDb().prepare(`SELECT * FROM arenas ORDER BY CAST(id AS INTEGER) ASC`).all();
  return rows.map(mapArenaRow);
}

export async function getArenaByIdFromSqlite(id: string): Promise<Arena | undefined> {
  ensureArenaSqliteReady();
  const row = getDb().prepare(`SELECT * FROM arenas WHERE id = ? LIMIT 1`).get(id);
  return row ? mapArenaRow(row) : undefined;
}

export async function getArenaByFolderIdFromSqlite(folderId: string): Promise<Arena | undefined> {
  ensureArenaSqliteReady();
  const row = getDb().prepare(`SELECT * FROM arenas WHERE folder_id = ? LIMIT 1`).get(folderId);
  return row ? mapArenaRow(row) : undefined;
}

export async function getArenaContentFromSqlite(
  arenaFolderId: string,
  tabKey: string,
  locale: string
): Promise<string | null> {
  ensureArenaSqliteReady();
  const structuredTable = STRUCTURED_TAB_TABLE[tabKey];
  if (structuredTable) {
    const row = getDb().prepare(`
      SELECT content
      FROM ${structuredTable}
      WHERE arena_folder_id = ? AND locale = ?
      LIMIT 1
    `).get(arenaFolderId, locale) as { content: string } | undefined;
    if (row?.content) {
      return row.content;
    }
  }

  const row = getDb().prepare(`
    SELECT content
    FROM arena_contents
    WHERE arena_folder_id = ? AND tab_key = ? AND locale = ?
    LIMIT 1
  `).get(arenaFolderId, tabKey, locale) as { content: string } | undefined;
  return row?.content || null;
}

export async function getArenaStructuredTabDataFromSqlite(
  arenaFolderId: string,
  tabKey: string,
  locale: string
): Promise<any | null> {
  ensureArenaSqliteReady();
  const structuredTable = STRUCTURED_TAB_TABLE[tabKey];
  if (!structuredTable) {
    return null;
  }
  const row = getDb().prepare(`
    SELECT data_json
    FROM ${structuredTable}
    WHERE arena_folder_id = ? AND locale = ?
    LIMIT 1
  `).get(arenaFolderId, locale) as { data_json?: string } | undefined;

  if (!row?.data_json) {
    return null;
  }
  try {
    return JSON.parse(row.data_json);
  } catch {
    return null;
  }
}
