import { AccountInsight } from '@/types/accountInsight';

type ContentType = {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reach?: number;
};

type DailyData = {
  date: string;
  followers: number;
  follows: number;
  impressions: number;
  ad?: ContentType;
  feed?: ContentType;
  story?: ContentType;
  reel?: ContentType;
  carousel?: ContentType;
  reach_total?: number;
  profile_visits?: number;
  website_taps?: number;
};

export const calculateTotalEngagement = (data: DailyData) => {
  const calculateTotal = (metric: keyof ContentType) => {
    return (
      (data.ad?.[metric] || 0) +
      (data.feed?.[metric] || 0) +
      (data.story?.[metric] || 0) +
      (data.reel?.[metric] || 0) +
      (data.carousel?.[metric] || 0)
    );
  };

  return {
    likes: calculateTotal('likes'),
    comments: calculateTotal('comments'),
    shares: calculateTotal('shares'),
    saves: calculateTotal('saves'),
  };
};

interface MonthlyData {
  year_month: string;
  followers: number;
  follows: number;
  new_followers: number;
  reach: number;
  impressions: number;
  profile_views: number;
  website_taps: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

interface FollowData {
  yearMonth: string;
  followers: number;
  follows: number;
}

export const aggregateMonthlyData = (insights: AccountInsight[]): MonthlyData[] => {
  const monthlyData = new Map<string, MonthlyData>();

  // データを月ごとにグループ化
  insights.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        year_month: yearMonth,
        followers: 0,
        follows: 0,
        new_followers: 0,
        reach: 0,
        impressions: 0,
        profile_views: 0,
        website_taps: 0,
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0,
      });
    }

    const monthData = monthlyData.get(yearMonth)!;
    monthData.followers = insight.followers;
    monthData.follows = insight.follows;
    monthData.reach += insight.reachTotal;
    monthData.impressions += insight.impressions;
    monthData.profile_views += insight.profileVisits;
    monthData.website_taps += insight.webTaps;
    monthData.likes += insight.likesTotal;
    monthData.comments += insight.commentsTotal;
    monthData.saves += insight.savesTotal;
    monthData.shares += insight.sharesTotal;
  });

  // 新規フォロワー数の計算
  const sortedData = Array.from(monthlyData.values()).sort((a, b) => 
    a.year_month.localeCompare(b.year_month)
  );

  for (let i = 1; i < sortedData.length; i++) {
    sortedData[i].new_followers = sortedData[i].followers - sortedData[i - 1].followers;
  }

  return sortedData;
};

export const aggregateFollowData = (insights: AccountInsight[]): FollowData[] => {
  const monthlyData = new Map<string, FollowData>();

  // データを月ごとにグループ化
  insights.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        yearMonth,
        followers: insight.followers,
        follows: insight.follows,
      });
    }
  });

  return Array.from(monthlyData.values()).sort((a, b) => 
    a.yearMonth.localeCompare(b.yearMonth)
  );
};

interface MonthlyAggregatedData {
  yearMonth: string;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export function aggregateFeedData(data: AccountInsight[]): MonthlyAggregatedData[] {
  const monthlyData = new Map<string, MonthlyAggregatedData>();

  data.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        yearMonth,
        reach: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
      });
    }

    const monthData = monthlyData.get(yearMonth)!;
    monthData.reach += insight.feedReach || 0;
    monthData.likes += insight.feedLikes || 0;
    monthData.comments += insight.feedComments || 0;
    monthData.shares += insight.feedShares || 0;
    monthData.saves += insight.feedSaves || 0;
  });

  return Array.from(monthlyData.values()).sort((a, b) => 
    b.yearMonth.localeCompare(a.yearMonth)
  );
}

export function aggregateReelsData(data: AccountInsight[]): MonthlyAggregatedData[] {
  const monthlyData = new Map<string, MonthlyAggregatedData>();

  data.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        yearMonth,
        reach: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
      });
    }

    const monthData = monthlyData.get(yearMonth)!;
    monthData.reach += insight.reelReach || 0;
    monthData.likes += insight.reelLikes || 0;
    monthData.comments += insight.reelComments || 0;
    monthData.shares += insight.reelShares || 0;
    monthData.saves += insight.reelSaves || 0;
  });

  return Array.from(monthlyData.values()).sort((a, b) => 
    b.yearMonth.localeCompare(a.yearMonth)
  );
}

export function aggregateStoryData(data: AccountInsight[]): MonthlyAggregatedData[] {
  const monthlyData = new Map<string, MonthlyAggregatedData>();

  data.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        yearMonth,
        reach: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
      });
    }

    const monthData = monthlyData.get(yearMonth)!;
    monthData.reach += insight.storyReach || 0;
    monthData.likes += insight.storyLikes || 0;
    monthData.comments += insight.storyComments || 0;
    monthData.shares += insight.storyShares || 0;
    monthData.saves += insight.storySaves || 0;
  });

  return Array.from(monthlyData.values()).sort((a, b) => 
    b.yearMonth.localeCompare(a.yearMonth)
  );
} 