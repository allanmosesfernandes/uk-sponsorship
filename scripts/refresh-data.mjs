
// 1. Fetch the gov.uk website
// 2. -> convert all the contents in to text.
// 3. -> In this text search for CSV link
// 4. -> Download the CSV


const GOV_SPONSOR_URL = 'https://www.gov.uk/api/content/government/publications/register-of-licensed-sponsors-workers';

const response = await fetch(GOV_SPONSOR_URL);
if (response.ok) {
    const data = await response.json();
    const csvLink = data.details.attachments[0].url;
    const fetchCSV = await fetch(csvLink);
    if (fetchCSV.ok) {
        const data = await fetchCSV.text();
        
    }
} else {
    throw new Error('something went wrong')
}