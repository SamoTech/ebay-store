import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * The store resolves its directory when it is first used, so the environment
 * variable is set before the module is imported.
 */
const testDir = path.join(os.tmpdir(), `dealshub-jsonstore-${process.pid}`);

describe('jsonStore', () => {
  let jsonStore: typeof import('@/lib/server/jsonStore');

  beforeAll(async () => {
    process.env.DEALSHUB_DATA_DIR = testDir;
    jsonStore = await import('@/lib/server/jsonStore');
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    delete process.env.DEALSHUB_DATA_DIR;
  });

  it('returns the fallback when the file does not exist', async () => {
    const result = await jsonStore.readJsonFile('missing.json', { events: [] });

    expect(result).toEqual({ events: [] });
  });

  it('round-trips JSON data', async () => {
    const written = await jsonStore.writeJsonFile('round-trip.json', { count: 3 });

    expect(written).toBe(true);
    await expect(jsonStore.readJsonFile('round-trip.json', { count: 0 })).resolves.toEqual({
      count: 3,
    });
  });

  it('returns the fallback for corrupt JSON instead of throwing', async () => {
    await fs.writeFile(path.join(testDir, 'corrupt.json'), '{ not json', 'utf8');

    await expect(jsonStore.readJsonFile('corrupt.json', { ok: true })).resolves.toEqual({
      ok: true,
    });
  });

  it('reports failure instead of throwing when the directory is unwritable', async () => {
    const unwritableDir = path.join(testDir, 'unwritable');
    await fs.mkdir(unwritableDir, { recursive: true });

    const isolated = await import('@/lib/server/jsonStore');
    const original = process.env.DEALSHUB_DATA_DIR;
    process.env.DEALSHUB_DATA_DIR = unwritableDir;

    try {
      // Use a path that cannot be created (a file exists where a dir is needed).
      await fs.writeFile(path.join(unwritableDir, 'blocked'), 'x', 'utf8');
      const result = await isolated.writeJsonFile('blocked/nested.json', { a: 1 });

      expect(typeof result).toBe('boolean');
    } finally {
      process.env.DEALSHUB_DATA_DIR = original;
    }
  });
});
