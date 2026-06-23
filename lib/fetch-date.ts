import { readFile } from "node:fs/promises";
import path from "node:path";

const fileRoute = path.join(process.cwd(), 'data', 'latest-updated.txt');
export const latestUpdate = await readFile(fileRoute, 'utf-8');