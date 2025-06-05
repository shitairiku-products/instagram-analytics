import { AccountInsight } from '@/types/accountInsight';

export interface YearlyApiResponse {
  period: string;
  followers: number;
  reach: number;
  impressions: number;
  profile_visits: number;
  website_clicks: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export const mapYearlyApiDataToAccountInsight = (
  data: YearlyApiResponse[]
): AccountInsight[] => {
  return data.map((item) => {
    const [year, month] = item.period.split('-');
    const date = new Date(Number(year), Number(month) - 1);

    return {
      id: '',
      companyId: '',
      igId: '',
      date: date,
      followers: item.followers,
      follows: 0,
      posts: 0,
      reachTotal: item.reach,
      reachFollower: 0,
      reachNonFollower: 0,
      reachUnknown: 0,
      impressions: item.impressions,
      profileVisits: item.profile_visits,
      webTaps: item.website_clicks,
      likesTotal: item.likes,
      commentsTotal: item.comments,
      savesTotal: item.saves,
      sharesTotal: item.shares,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};
