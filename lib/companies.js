"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sync_1 = require("csv-parse/sync");
var input = '../data/2026-06-05_-_Worker_and_Temporary_Worker.csv';
var records = (0, sync_1.parse)(input, {
    columns: true,
    skip_empty_lines: true
});
console.log('the parsed records are', records);
