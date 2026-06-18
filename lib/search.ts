import Fuse from "fuse.js";
import { loadCompanies } from "./companies";
import type { CompanyRecord } from "./companies";

const companies: CompanyRecord[]= await loadCompanies();

export const fusedCompanies = new Fuse(companies, {
    keys: ['companyName'], threshold: 0.25
});