import fs from 'fs';
import path from 'path';
import type { Arena } from '@/lib/types';
import { arenas as fallbackArenas } from '@/lib/data';

const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const ARENAS_JSON_PATH = path.join(PUBLIC_DATA_DIR, 'arenas.json');
const ARENA_CONTENT_JSON_PATH = path.join(PUBLIC_DATA_DIR, 'arena-content.json');

type ArenaContentMap = Record<string, Record<string, Record<string, string>>>;

let cachedArenas: Arena[] | null = null;
let cachedArenaContent: ArenaContentMap | null = null;

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    console.error(`[static-data] Failed to parse JSON: ${filePath}`, error);
    return null;
  }
}

export async function getAllArenasFromStaticData(): Promise<Arena[]> {
  if (cachedArenas) {
    return cachedArenas;
  }

  const fromJson = readJsonFile<Arena[]>(ARENAS_JSON_PATH);
  cachedArenas = fromJson && fromJson.length > 0 ? fromJson : fallbackArenas;
  return cachedArenas;
}

export async function getArenaContentFromStaticData(
  folderId: string,
  tabKey: string,
  locale: string
): Promise<string | null> {
  if (!cachedArenaContent) {
    cachedArenaContent = readJsonFile<ArenaContentMap>(ARENA_CONTENT_JSON_PATH) || {};
  }

  const content = cachedArenaContent[folderId]?.[locale]?.[tabKey];
  return content || null;
}
