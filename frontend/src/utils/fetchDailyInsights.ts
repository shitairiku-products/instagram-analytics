import fetchAndSaveDailyAccountInsights from './getAccountinsightByDay';
import fetchAndSaveDailyPostInsights from './getPostinsightByDay';

export async function fetchDailyAccountInsights() {
  try {
    console.log('Starting daily account insights fetch...');
    await fetchAndSaveDailyAccountInsights();
    console.log('Completed daily account insights fetch');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('Error fetching daily account insights:', errorMessage);
    throw error;
  }
}

export async function fetchDailyPostInsights() {
  try {
    console.log('Starting daily post insights fetch...');
    await fetchAndSaveDailyPostInsights();
    console.log('Completed daily post insights fetch');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('Error fetching daily post insights:', errorMessage);
    throw error;
  }
} 