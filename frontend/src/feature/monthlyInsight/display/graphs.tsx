'use client';

import { AccountInsight } from '@/types/accountInsight';
import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import LineGraph from '@/components/monthly/LineGraph';

interface GraphProps {
  startDate: string;
  endDate: string;
}

const fetchInsights = async (companyId: string, startDate: string, endDate: string) => {
  const params = new URLSearchParams({
    companyId,
    startDate,
    endDate,
  });

  const response = await fetch(`/api/accountInsights?${params}`);
  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }

  return response.json();
};

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [
    {
      key: 'followers',
      name: '新規フォロワー数',
      stroke: '#8884d8',
    },
  ];

  const formattedData = monthlyData.map(item => ({
    date: item.date,
    value: item.followers
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [
    {
      key: 'impressions',
      name: 'インプレッション',
      stroke: '#82ca9d',
    },
    {
      key: 'reach_total',
      name: 'リーチ',
      stroke: '#ffc658',
    },
  ];

  const formattedData = monthlyData.map(item => ({
    date: item.date,
    value: item.reach_total
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ProfileVisitsGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [
    {
      key: 'profile_visits',
      name: 'プロフィールアクセス',
      stroke: '#0088fe',
    },
  ];

  const formattedData = monthlyData.map(item => ({
    date: item.date,
    value: item.profile_visits
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const WebsiteTapRateGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const lines = [
    {
      key: 'website_tap_rate',
      name: 'ウェブサイトのタップ率',
      stroke: '#8884d8',
    },
  ];

  const formattedData = monthlyData.map(item => ({
    date: item.date,
    value: item.website_tap_rate
  }));

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
}; 