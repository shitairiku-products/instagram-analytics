import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// 日付範囲を計算する関数
function getDateRange() {
  const end = new Date();
  end.setDate(end.getDate() - 1); // 昨日まで

  const start = new Date(end);
  start.setDate(start.getDate() - 89); // 90日前

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

// メディアリストを取得する関数
async function getMediaList(igId, accessToken, since, until) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?fields=id,media_type,media_product_type,timestamp&since=${since}&until=${until}&limit=50&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media list for account ${igId}:`, data.error);
      console.error(`Error details:`, {
        message: data.error.message,
        type: data.error.type,
        code: data.error.code,
        fbtrace_id: data.error.fbtrace_id
      });
      return null;
    }

    if (!data.data || data.data.length === 0) {
      console.log(`No media found for account ${igId} between ${since} and ${until}`);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching media list for account ${igId}:`, error);
    return null;
  }
}

// メディアインサイトを取得する関数
async function getMediaInsights(mediaId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=reach,saved,shares,comments,likes&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || !data.data) {
      console.log(`No insights data available for media ${mediaId}`);
      return null;
    }

    const insights = {
      reach: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0
    };

    data.data.forEach(metric => {
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
  } catch (error) {
    console.error(`Error fetching insights for media ${mediaId}:`, error);
    return null;
  }
}

export async function getAccountInsights(igId, accessToken, startDate, endDate) {
  try {
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);
    if (!mediaList || mediaList.length === 0) {
      console.log('No media found for the specified date range');
      return { insights: [], mediaTypeCount: {} };
    }

    const mediaTypeCount = {
      AD: 0,
      FEED: 0,
      STORY: 0,
      REEL: 0,
      CAROUSEL_ALBUM: 0
    };

    // 日付ごとのメトリクスを初期化
    const dateMetrics = {};
    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMetrics[dateStr] = {
        date: dateStr,
        posts: 0,
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
    }

    // 各メディアのインサイトを取得
    for (const media of mediaList) {
      const mediaDate = new Date(media.timestamp).toISOString().split('T')[0];
      if (!dateMetrics[mediaDate]) continue;

      const mediaType = media.media_type;
      mediaTypeCount[mediaType] = (mediaTypeCount[mediaType] || 0) + 1;
      dateMetrics[mediaDate].posts += 1;

      const mediaInsights = await getMediaInsights(media.id, accessToken);
      if (!mediaInsights) continue;

      // メディタイプに応じてメトリクスを更新
      const typePrefix = mediaType.toLowerCase().replace('_', '');
      dateMetrics[mediaDate][`${typePrefix}Reach`] += mediaInsights.reach || 0;
      dateMetrics[mediaDate][`${typePrefix}Likes`] += mediaInsights.likes || 0;
      dateMetrics[mediaDate][`${typePrefix}Comments`] += mediaInsights.comments || 0;
      dateMetrics[mediaDate][`${typePrefix}Saves`] += mediaInsights.saves || 0;
      dateMetrics[mediaDate][`${typePrefix}Shares`] += mediaInsights.shares || 0;
    }

    // 日付ごとのメトリクスを配列に変換
    const insightsArray = Object.values(dateMetrics);

    return {
      insights: insightsArray,
      mediaTypeCount
    };
  } catch (error) {
    console.error('Error in getAccountInsights:', error);
    return {
      insights: [],
      mediaTypeCount: {
        AD: 0,
        FEED: 0,
        STORY: 0,
        REEL: 0,
        CAROUSEL_ALBUM: 0
      }
    };
  }
}

async function fetchAndSaveAccountInsights() {
  try {
    // すべての企業を取得
    const companies = await prisma.Company.findMany();
    
    // 過去30日間のデータを取得
    const { startDate, endDate } = getDateRange();
    console.log(`Fetching data from ${startDate} to ${endDate}`);

    for (const company of companies) {
      console.log(`Fetching insights for company: ${company.name}`);
      
      const { insights } = await getAccountInsights(
        company.igId,
        company.longToken,
        startDate,
        endDate
      );

      if (!insights || insights.length === 0) {
        console.log(`Skipping company ${company.name} due to no data`);
        continue;
      }

      // 各日付のインサイトをデータベースに保存
      for (const dayInsight of insights) {
        await prisma.accountInsight.upsert({
          where: {
            companyId_igId_date: {
              companyId: company.id,
              igId: company.igId,
              date: new Date(dayInsight.date)
            }
          },
          update: {
            followers: 0,
            follows: 0,
            posts: dayInsight.posts || 0,
            reachTotal: (
              dayInsight.adReach +
              dayInsight.feedReach +
              dayInsight.storyReach +
              dayInsight.reelReach +
              dayInsight.carouselReach
            ) || 0,
            impressions: 0,
            profileVisits: 0,
            webTaps: 0,
            // メディアタイプ別のメトリクス
            adReach: dayInsight.adReach || 0,
            adLikes: dayInsight.adLikes || 0,
            adComments: dayInsight.adComments || 0,
            adSaves: dayInsight.adSaves || 0,
            adShares: dayInsight.adShares || 0,
            feedReach: dayInsight.feedReach || 0,
            feedLikes: dayInsight.feedLikes || 0,
            feedComments: dayInsight.feedComments || 0,
            feedSaves: dayInsight.feedSaves || 0,
            feedShares: dayInsight.feedShares || 0,
            storyReach: dayInsight.storyReach || 0,
            storyLikes: dayInsight.storyLikes || 0,
            storyComments: dayInsight.storyComments || 0,
            storySaves: dayInsight.storySaves || 0,
            storyShares: dayInsight.storyShares || 0,
            reelReach: dayInsight.reelReach || 0,
            reelLikes: dayInsight.reelLikes || 0,
            reelComments: dayInsight.reelComments || 0,
            reelSaves: dayInsight.reelSaves || 0,
            reelShares: dayInsight.reelShares || 0,
            carouselReach: dayInsight.carouselReach || 0,
            carouselLikes: dayInsight.carouselLikes || 0,
            carouselComments: dayInsight.carouselComments || 0,
            carouselSaves: dayInsight.carouselSaves || 0,
            carouselShares: dayInsight.carouselShares || 0,
          },
          create: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(dayInsight.date),
            followers: 0,
            follows: 0,
            posts: dayInsight.posts || 0,
            reachTotal: (
              dayInsight.adReach +
              dayInsight.feedReach +
              dayInsight.storyReach +
              dayInsight.reelReach +
              dayInsight.carouselReach
            ) || 0,
            impressions: 0,
            profileVisits: 0,
            webTaps: 0,
            likesTotal: 0,
            commentsTotal: 0,
            savesTotal: 0,
            sharesTotal: 0,
            // メディアタイプ別のメトリクス
            adReach: dayInsight.adReach || 0,
            adLikes: dayInsight.adLikes || 0,
            adComments: dayInsight.adComments || 0,
            adSaves: dayInsight.adSaves || 0,
            adShares: dayInsight.adShares || 0,
            feedReach: dayInsight.feedReach || 0,
            feedLikes: dayInsight.feedLikes || 0,
            feedComments: dayInsight.feedComments || 0,
            feedSaves: dayInsight.feedSaves || 0,
            feedShares: dayInsight.feedShares || 0,
            storyReach: dayInsight.storyReach || 0,
            storyLikes: dayInsight.storyLikes || 0,
            storyComments: dayInsight.storyComments || 0,
            storySaves: dayInsight.storySaves || 0,
            storyShares: dayInsight.storyShares || 0,
            reelReach: dayInsight.reelReach || 0,
            reelLikes: dayInsight.reelLikes || 0,
            reelComments: dayInsight.reelComments || 0,
            reelSaves: dayInsight.reelSaves || 0,
            reelShares: dayInsight.reelShares || 0,
            carouselReach: dayInsight.carouselReach || 0,
            carouselLikes: dayInsight.carouselLikes || 0,
            carouselComments: dayInsight.carouselComments || 0,
            carouselSaves: dayInsight.carouselSaves || 0,
            carouselShares: dayInsight.carouselShares || 0,
          }
        });
      }

      console.log(`Successfully saved insights for company: ${company.name}`);
    }

    console.log('All account insights have been updated successfully');
  } catch (error) {
    console.error('Error in fetchAndSaveAccountInsights:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトを実行
fetchAndSaveAccountInsights();
