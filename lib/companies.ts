
import { parse } from "csv-parse/sync";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Fuse from 'fuse.js';

type CsvRow = {
    'Organisation Name': string;
    'Town/City': string;
    'County'?: string;
    'Type & Rating': string;
    'Route': string;
}

export type CompanyRecord = {
    companyName: string;
    city: string;
    county?: string;
    type: string;
    companyRoutes: string[];
}

let companiesCache: Promise<CompanyRecord[]> | null = null;

async function parseCompanies(): Promise<CompanyRecord[]> {
    const fileRoute = path.join(process.cwd(), 'data', 'file.csv');
    const csvText = await readFile(fileRoute, 'utf-8');
    const records: CsvRow[] = parse(csvText, {
        columns: true,
        skip_empty_lines: true
    })
    
    // Create a map to store company records
    const companiesMap = new Map<string, CompanyRecord>();
    
    for (const company of records) {
        // trim white space off the company name
        const companyName = company["Organisation Name"].trim();
        const city = company["Town/City"].trim();
        const county = company?.County ?? '';
        const type = company["Type & Rating"];
        const route = company["Route"];
        const companyRoutes = [route];
    
        if (companiesMap.has(companyName)) {
            const existingRecord = companiesMap.get(companyName);
            if (existingRecord) {
                const existingRoutes = existingRecord.companyRoutes;
                existingRoutes.push(route);
                companiesMap.set(companyName, existingRecord);
            }
        } else {
            // New company so store all records.
            const companyRecord: CompanyRecord = {
                companyName,
                city,
                county,
                type,
                companyRoutes
            }
            companiesMap.set(companyName, companyRecord)
        }
    }
    return Array.from(companiesMap.values());
}

export function loadCompanies(): Promise<CompanyRecord[]> {

    companiesCache ??= parseCompanies();

    return companiesCache;
}