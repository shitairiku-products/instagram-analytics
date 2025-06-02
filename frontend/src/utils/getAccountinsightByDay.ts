import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MediaInsights {
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

interface AccountMetrics {
  date: string;
  posts: number;
  followers: number;
  follows: number;
  reachTotal: number;
  impressions: number;
  profileViews: number;
  profileVisits: number;
  websiteClicks: number;
  webTaps: number;
  getDirectionsClicks: number;
  phoneCallClicks: number;
  emailClicks: number;
  likesTotal: number;
  commentsTotal: number;
  savesTotal: number;
  sharesTotal: number;
  adReach: number;
  adLikes: number;
  adComments: number;
  adSaves: number;
  adShares: number;
  feedReach: number;
  feedLikes: number;
  feedComments: number;
  feedSaves: number;
  feedShares: number;
  storyReach: number;
  storyLikes: number;
  storyComments: number;
  storySaves: number;
  storyShares: number;
  reelReach: number;
  reelLikes: number;
  reelComments: number;
  reelSaves: number;
  reelShares: number;
  carouselReach: number;
  carouselLikes: number;
  carouselComments: number;
  carouselSaves: number;
  carouselShares: number;
}

// 昨日の日付範囲を取得する関数
function getYesterdayDateRange(): DateRange {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = startDate;

  return { startDate, endDate };
}

// メディアリストを取得する関数
async function getMediaList(igId: string, accessToken: string, since: string, until: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?fields=id,media_type,media_product_type,timestamp&since=${since}&until=${until}&limit=50&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media list for account ${igId}:`, data.error);
      return null;
    }

    if (!data.data || data.data.length === 0) {
      console.log(`No media found for account ${igId} on ${since}`);
      return [];
    }

    return data.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error(`Error fetching media list for account ${igId}:`, errorMessage);
    return null;
  }
}

// メディアインサイトを取得する関数
async function getMediaInsights(mediaId: string, accessToken: string): Promise<MediaInsights | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${mediaId}/insights?metric=reach,saved,shares,comments,likes&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || !data.data) {
      console.log(`No insights data available for media ${mediaId}`);
      return null;
    }

    const insights: MediaInsights = {
      reach: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0
    };

    data.data.forEach((metric: { name: string; values: { value: string }[] }) => {
      switch (metric.name) {
        case 'reach':
          insights.reach = parseInt(metric.values[0].value) || 0;
          break;
        case 'likes':
          insights.likes = parseInt(metric.values[0].value) || 0;
          break;
        case 'comments':
          insights.comments = parseInt(metric.values[0].value) || 0;
          break;
        case 'saved':
          insights.saves = parseInt(metric.values[0].value) || 0;
          break;
        case 'shares':
          insights.shares = parseInt(metric.values[0].value) || 0;
          break;
      }
    });

    return insights;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error(`Error fetching insights for media ${mediaId}:`, errorMessage);
    return null;
  }
}

async function getAccountInsights(igId: string, accessToken: string): Promise<Partial<AccountMetrics>> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/insights?metric=followers,follows,reach,impressions,profile_views,website_clicks,get_directions_clicks,phone_call_clicks,email_contacts&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || !data.data) {
      console.log(`No account insights data available for account ${igId}`);
      return {};
    }

    const insights: Partial<AccountMetrics> = {};
    data.data.forEach((metric: { name: string; values: { value: string }[] }) => {
      const value = parseInt(metric.values[0].value) || 0;
      switch (metric.name) {
        case 'followers':
          insights.followers = value;
          break;
        case 'follows':
          insights.follows = value;
          break;
        case 'reach':
          insights.reachTotal = value;
          break;
        case 'impressions':
          insights.impressions = value;
          break;
        case 'profile_views':
          insights.profileViews = value;
          break;
        case 'website_clicks':
          insights.websiteClicks = value;
          break;
        case 'get_directions_clicks':
          insights.getDirectionsClicks = value;
          break;
        case 'phone_call_clicks':
          insights.phoneCallClicks = value;
          break;
        case 'email_contacts':
          insights.emailClicks = value;
          break;
      }
    });

    return insights;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error(`Error fetching account insights for account ${igId}:`, errorMessage);
    return {};
  }
}

// アカウントインサイトを取得する関数
async function getAccountInsightsByDay(igId: string, accessToken: string): Promise<AccountMetrics | null> {
  try {
    const { startDate, endDate } = getYesterdayDateRange();
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);
    const accountInsights = await getAccountInsights(igId, accessToken);

    // 昨日の日付のメトリクスを初期化
    const metrics: AccountMetrics = {
      date: startDate,
      posts: 0,
      followers: accountInsights.followers || 0,
      follows: accountInsights.follows || 0,
      reachTotal: accountInsights.reachTotal || 0,
      impressions: accountInsights.impressions || 0,
      profileViews: accountInsights.profileViews || 0,
      profileVisits: accountInsights.profileViews || 0,
      websiteClicks: accountInsights.websiteClicks || 0,
      webTaps: accountInsights.websiteClicks || 0,
      getDirectionsClicks: accountInsights.getDirectionsClicks || 0,
      phoneCallClicks: accountInsights.phoneCallClicks || 0,
      emailClicks: accountInsights.emailClicks || 0,
      likesTotal: 0,
      commentsTotal: 0,
      savesTotal: 0,
      sharesTotal: 0,
      adReach: 0,
      adLikes: 0,
      adComments: 0,
      adSaves: 0,
      adShares: 0,
      feedReach: 0,
      feedLikes: 0,
      feedComments: 0,
      feedSaves: 0,
      feedShares: 0,
      storyReach: 0,
      storyLikes: 0,
      storyComments: 0,
      storySaves: 0,
      storyShares: 0,
      reelReach: 0,
      reelLikes: 0,
      reelComments: 0,
      reelSaves: 0,
      reelShares: 0,
      carouselReach: 0,
      carouselLikes: 0,
      carouselComments: 0,
      carouselSaves: 0,
      carouselShares: 0,
    };

    if (!mediaList || mediaList.length === 0) {
      return metrics;
    }

    // 各メディアのインサイトを取得
    for (const media of mediaList) {
      metrics.posts += 1;
      const mediaInsights = await getMediaInsights(media.id, accessToken);
      if (!mediaInsights) continue;

      // メディアタイプに応じてメトリクスを更新
      const typePrefix = media.media_type.toLowerCase().replace('_', '');
      const reachKey = `${typePrefix}Reach` as keyof AccountMetrics;
      const likesKey = `${typePrefix}Likes` as keyof AccountMetrics;
      const commentsKey = `${typePrefix}Comments` as keyof AccountMetrics;
      const savesKey = `${typePrefix}Saves` as keyof AccountMetrics;
      const sharesKey = `${typePrefix}Shares` as keyof AccountMetrics;

      if (reachKey !== 'date') metrics[reachKey] = (metrics[reachKey] as number) + (mediaInsights.reach || 0);
      if (likesKey !== 'date') metrics[likesKey] = (metrics[likesKey] as number) + (mediaInsights.likes || 0);
      if (commentsKey !== 'date') metrics[commentsKey] = (metrics[commentsKey] as number) + (mediaInsights.comments || 0);
      if (savesKey !== 'date') metrics[savesKey] = (metrics[savesKey] as number) + (mediaInsights.saves || 0);
      if (sharesKey !== 'date') metrics[sharesKey] = (metrics[sharesKey] as number) + (mediaInsights.shares || 0);

      // 合計値を更新
      metrics.likesTotal += mediaInsights.likes || 0;
      metrics.commentsTotal += mediaInsights.comments || 0;
      metrics.savesTotal += mediaInsights.saves || 0;
      metrics.sharesTotal += mediaInsights.shares || 0;
    }

    return metrics;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('Error in getAccountInsightsByDay:', errorMessage);
    return null;
  }
}

// メイン処理関数
async function fetchAndSaveDailyAccountInsights() {
  try {
    // すべての企業を取得
    const companies = await prisma.company.findMany();
    console.log(`${companies.length}社の昨日のデータを取得します`);

    for (const company of companies) {
      try {
        console.log(`\n[${company.name}] データ取得開始...`);
        
        const insights = await getAccountInsightsByDay(company.igId, company.longToken);
        if (!insights) {
          console.log(`[${company.name}] データ取得に失敗`);
          continue;
        }

        // データをDBに保存
        const { date, ...insightData } = insights;
        await prisma.accountInsight.create({
          data: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(date),
            ...insightData
          }
        });

        console.log(`[${company.name}] データを保存完了`);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '不明なエラー';
        console.error(`[${company.name}] エラー:`, errorMessage);
      }
    }

    console.log('\n全ての処理が完了しました');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('Error in fetchAndSaveDailyAccountInsights:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchAndSaveDailyAccountInsights; 