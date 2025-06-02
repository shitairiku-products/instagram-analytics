// 日次データの型定義
export interface DailyInsightData {
  date: string;
  followers: number;
  follows: number;
  posts: number;
  reach_total: number;
  reach_follower: number;
  reach_non_follower: number;
  reach_unknown: number;
  impressions: number;
  profile_visits: number;
  website_taps: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  carousel: {
    reach: number;
    impressions: number;
  };
}

// 月次集計データの型定義
export interface MonthlyInsightData {
  year_month: string;
  followers: number;
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