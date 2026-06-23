import { loadCompanies } from "./companies";

const PAGE_SIZE = 20;

const data = await loadCompanies();
console.log(data.length)