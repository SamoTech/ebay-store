import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

/**
 * Tiny JSON file store.
 *
 * Serverless filesystems (Vercel) are read-only except for the OS temp
 * directory, so the store falls back to `os.tmpdir()` when the primary
 * directory cannot be written. Writes never throw: callers get a boolean and
 * can decide whether persistence matters for their response.
 */

const PRIMARY_DIR = process.env.DEALSHUB_DATA_DIR || path.join(process.cwd(), 'data');
const FALLBACK_DIR = path.join(os.tmpdir(), 'dealshub-data');

let activeDir: string | null = null;

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function resolveDir(): Promise<string> {
  if (activeDir) return activeDir;

  try {
    await ensureDir(PRIMARY_DIR);
    activeDir = PRIMARY_DIR;
    return activeDir;
  } catch {
    await ensureDir(FALLBACK_DIR);
    activeDir = FALLBACK_DIR;
    return activeDir;
  }
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const dir = await resolveDir();
    const raw = await fs.readFile(path.join(dir, fileName), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persist a JSON file.
 *
 * @returns `true` when the data was written, `false` when the filesystem is
 * unavailable (read-only deployments) — never throws.
 */
export async function writeJsonFile<T>(fileName: string, value: T): Promise<boolean> {
  try {
    const dir = await resolveDir();
    await fs.writeFile(path.join(dir, fileName), JSON.stringify(value, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}
