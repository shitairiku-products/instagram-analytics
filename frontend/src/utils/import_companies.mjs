import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const rawData = fs.readFileSync(path.join(__dirname, '../../data/company_seed.json'), 'utf8');
const companies = JSON.parse(rawData);

const cleanedCompanies = companies.map(company => ({
  ...company,
  igId: company.igId.replace(/['"]/g, '') // Remove all quotes (both single and double)
}));

// Write the cleaned data back to the file
fs.writeFileSync(
  path.join(__dirname, '../../data/company_seed.json'),
  JSON.stringify(cleanedCompanies, null, 2),
  'utf8'
);

console.log('Companies data has been cleaned and saved successfully.');
