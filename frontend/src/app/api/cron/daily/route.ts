export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { fetchDailyAccountInsights, fetchDailyPostInsights } from '@/utils/fetchDailyInsights';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5分のタイムアウト設定

export async function GET() {
  try {
    console.log('Starting daily data fetch...');
    
    // アカウントインサイトの取得
    await fetchDailyAccountInsights();
    
    // ポストインサイトの取得
    await fetchDailyPostInsights();
    
    console.log('Daily data fetch completed successfully');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in daily data fetch:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 