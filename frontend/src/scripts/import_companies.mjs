import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    const seedPath = path.join(__dirname, '..', 'data', 'company_seed.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    
    console.log(`Found ${seedData.length} companies in seed file`);

    for (const company of seedData) {
      // Remove quotes from igId if present
      const cleanIgId = company.igId.replace(/"/g, '');
      
      // Find existing company by igId
      const existingCompany = await prisma.company.findFirst({
        where: {
          igId: cleanIgId
        }
      });

      if (existingCompany) {
        // Update existing company
        await prisma.company.update({
          where: {
            id: existingCompany.id
          },
          data: {
            name: company.name,
            longToken: company.longToken
          }
        });
        console.log(`Updated company: ${company.name} (${cleanIgId})`);
      } else {
        // Create new company
        await prisma.company.create({
          data: {
            name: company.name,
            igId: cleanIgId,
            longToken: company.longToken
          }
        });
        console.log(`Created company: ${company.name} (${cleanIgId})`);
      }
    }

    console.log('Successfully imported all companies');
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Failed to import companies: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
