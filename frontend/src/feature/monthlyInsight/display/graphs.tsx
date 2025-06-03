'use client';

import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMonthlyInsights } from '../hooks/useMonthlyInsights';
import LineGraph from '@/components/monthly/LineGraph';

interface GraphProps {
  startDate: string;
  endDate: string;
}

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const { insights, isLoading, error } = useMonthlyInsights(startDate, endDate, 'feed');
  const monthlyData = calculateNewFollowers(insights, startDate, endDate);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [{ key: 'followers', name: '新規フォロワー数', stroke: '#8884d8' }];
  const formattedData = monthlyData.map(item => ({
    date: item.date,
    followers: isNaN(item.followers) ? 0 : item.followers,
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const { insights, isLoading, error } = useMonthlyInsights(startDate, endDate, 'feed');
  const monthlyData = calculateNewFollowers(insights, startDate, endDate);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [
    { key: 'reach_total', name: 'リーチ', stroke: '#ffc658' },
    { key: 'impressions', name: 'インプレッション', stroke: '#82ca9d' },
  ];
  const formattedData = monthlyData.map(item => ({
    date: item.date,
    reach_total: isNaN(item.reach_total) ? 0 : item.reach_total,
    impressions: isNaN(item.impressions) ? 0 : item.impressions,
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ProfileVisitsGraph = ({ startDate, endDate }: GraphProps) => {
  const { insights, isLoading, error } = useMonthlyInsights(startDate, endDate, 'feed');
  const monthlyData = calculateNewFollowers(insights, startDate, endDate);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [{ key: 'profile_visits', name: 'プロフィールアクセス', stroke: '#0088fe' }];
  const formattedData = monthlyData.map(item => ({
    date: item.date,
    profile_visits: isNaN(item.profile_visits) ? 0 : item.profile_visits,
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const WebsiteTapRateGraph = ({ startDate, endDate }: GraphProps) => {
  const { insights, isLoading, error } = useMonthlyInsights(startDate, endDate, 'feed');
  const monthlyData = calculateNewFollowers(insights, startDate, endDate);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [{ key: 'website_tap_rate', name: 'ウェブサイトのタップ率', stroke: '#8884d8' }];
  const formattedData = monthlyData.map(item => ({
    date: item.date,
    website_tap_rate: isNaN(item.website_tap_rate) ? 0 : item.website_tap_rate,
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};
