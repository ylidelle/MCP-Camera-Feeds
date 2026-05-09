import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'observations');
const OBS_FILE = path.join(DATA_DIR, 'observations.json');

export interface Observation {
  id: string;
  cameraId: string;
  cameraName: string;
  note: string;
  tags: string[];
  timestamp: string;
}

async function load(): Promise<Observation[]> {
  if (!existsSync(OBS_FILE)) return [];
  const raw = await readFile(OBS_FILE, 'utf-8');
  return JSON.parse(raw) as Observation[];
}

async function save(obs: Observation[]): Promise<void> {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  await writeFile(OBS_FILE, JSON.stringify(obs, null, 2), 'utf-8');
}

export async function makeObservation(params: {
  cameraId: string;
  cameraName: string;
  note: string;
  tags?: string[];
}): Promise<Observation> {
  const all = await load();
  const entry: Observation = {
    id: `obs_${Date.now()}`,
    cameraId: params.cameraId,
    cameraName: params.cameraName,
    note: params.note,
    tags: params.tags ?? [],
    timestamp: new Date().toISOString(),
  };
  all.push(entry);
  await save(all);
  return entry;
}

export async function getObservations(params: {
  cameraId?: string;
  limit: number;
}): Promise<Observation[]> {
  const all = await load();
  const filtered = params.cameraId
    ? all.filter((o) => o.cameraId === params.cameraId)
    : all;
  return filtered.slice(-params.limit).reverse();
}
