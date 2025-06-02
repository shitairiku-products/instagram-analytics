import fetchAllCompaniesInstagramData from '../utils/instagramApi.mjs';

async function main() {
  try {
    console.log('Starting Instagram data fetch...');
    await fetchAllCompaniesInstagramData();
    console.log('Instagram data fetch completed successfully.');
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    process.exit(1);
  }
}

main(); 