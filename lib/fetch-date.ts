import { readFile } from "node:fs/promises";
import path from "node:path";

const fileRoute = path.join(process.cwd(), 'data', 'latest-updated.txt');

// Turn an ISO date (e.g. "2026-06-29") into a human label ("29th June 2026").
function formatUpdated(iso: string): string {
  const [year, month, day] = iso.trim().split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  // Ordinal suffix: 1st, 2nd, 3rd, 4th–20th, then by last digit (21st, 22nd…).
  const suffix = day % 10 === 1 && day !== 11 ? 'st'
    : day % 10 === 2 && day !== 12 ? 'nd'
    : day % 10 === 3 && day !== 13 ? 'rd'
    : 'th';
  return `${day}${suffix} ${months[month - 1]} ${year}`;
}

export const latestUpdate = formatUpdated(await readFile(fileRoute, 'utf-8'));