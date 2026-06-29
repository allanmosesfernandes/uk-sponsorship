import { writeFile } from 'node:fs/promises';
import path from "node:path";

// Fetch the gov.uk website content API
const GOV_SPONSOR_URL = 'https://www.gov.uk/api/content/government/publications/register-of-licensed-sponsors-workers';

const MIN_FILE_SIZE = 5_000_000
const response = await fetch(GOV_SPONSOR_URL);
if (!response.ok) throw new Error(`gov.uk API: ${response.status}`);
const govData = await response.json();

// Extract CSV link
const CSV_LINK = govData.details?.attachments[0].url;

// Extract date
const matchResult = CSV_LINK.match(/\d{4}-\d{2}-\d{2}/);
if (!matchResult) throw new Error('could not extract date from CSV URL');
const lastUpdated = matchResult[0];

// Check link exists and valid
if (!CSV_LINK || !CSV_LINK.includes('Worker_and_Temporary_Worker') || !CSV_LINK.endsWith('.csv')) {
    throw new Error(`CSV link might have changed`);
}

// Fetch CSV from link
const csvData = await fetch(CSV_LINK);
if (!csvData.ok) throw new Error(`gov.uk CSV not loading`);

// Sanity check the CSV
const csvTxt = await csvData.text();
const rowCount = (csvTxt.match(/\n/g) || []).length;
if (rowCount < 50_000) throw new Error(`only ${rowCount} rows — expected ~127k`);

// Check row count
if (csvTxt.length < MIN_FILE_SIZE) throw new Error('CSV file size too small');

// Check first row is Organisation
if (!csvTxt.startsWith('Organisation Name')) throw new Error(`CSV rows have changed.`);

// Write files to the directory
// Build path
const csvFileRoute = path.join(process.cwd(), 'data', 'file.csv');
const textFileRoute = path.join(process.cwd(), 'data', 'latest-updated.txt');

// Actual file write
await writeFile(csvFileRoute, csvTxt);
await writeFile(textFileRoute, lastUpdated);

console.log(`Refresh complete: ${lastUpdated}, ${rowCount} rows`)

