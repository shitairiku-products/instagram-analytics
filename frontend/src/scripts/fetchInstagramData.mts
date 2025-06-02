import fetchInstagramData from '../utils/instagramApi.mjs';

const main = async () => {
  try {
    console.log('Fetching Instagram data...');
    const data = await fetchInstagramData();
    console.log(`Successfully fetched ${data.length} posts`);
    console.log('Data saved to src/data/post_insights.json');
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    process.exit(1);
  }
};

main(); 