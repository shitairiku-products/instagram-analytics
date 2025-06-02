'use client';

import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { useDateStore } from '@/components/store/dateStore';
import { AccountInsight } from '@/types/accountInsight';
import InsightDataTable from '@/components/yearly/InsightDataTable';

interface DataTableProps {
  selectedType: 'FEED' | 'REELS' | 'STORY';
}

const DataTable = ({ selectedType }: DataTableProps) => {
  const [insights, setInsights] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();
  const { startDate, endDate } = useDateStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) {
        setError('会社が選択されていません');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/yearlyMaster?companyId=${selectedCompany.id}&startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, startDate, endDate]);

  const getAggregatedData = (): Array<{
    yearMonth: string;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagement: number;
  }> => {
    if (!insights.length) return [];

    const aggregatedData = insights.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          yearMonth,
          reach: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          engagement: 0
        };
      }

      const prefix = selectedType.toLowerCase();
      const reachKey = `${prefix}Reach` as keyof AccountInsight;
      const likesKey = `${prefix}Likes` as keyof AccountInsight;
      const commentsKey = `${prefix}Comments` as keyof AccountInsight;
      const sharesKey = `${prefix}Shares` as keyof AccountInsight;
      const savesKey = `${prefix}Saves` as keyof AccountInsight;

      acc[yearMonth].reach += (curr[reachKey] as number) || 0;
      acc[yearMonth].likes += (curr[likesKey] as number) || 0;
      acc[yearMonth].comments += (curr[commentsKey] as number) || 0;
      acc[yearMonth].shares += (curr[sharesKey] as number) || 0;
      acc[yearMonth].saves += (curr[savesKey] as number) || 0;
      acc[yearMonth].engagement = 
        acc[yearMonth].likes + 
        acc[yearMonth].comments + 
        acc[yearMonth].shares + 
        acc[yearMonth].saves;

      return acc;
    }, {} as Record<string, {
      yearMonth: string;
      reach: number;
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      engagement: number;
    }>);

    return Object.values(aggregatedData).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
  };

  const getColumns = () => {
    const prefix = selectedType.toLowerCase();
    const typeLabel = {
      'feed': 'フィード',
      'reels': 'リール',
      'story': 'ストーリー'
    }[prefix];

    return [
      { key: 'yearMonth', label: '月' },
      { key: `${prefix}_reach`, label: `${typeLabel}リーチ` },
      { key: `${prefix}_engagement`, label: `${typeLabel}エンゲージメント` },
      { key: `${prefix}_likes`, label: `${typeLabel}いいね` },
      { key: `${prefix}_comments`, label: `${typeLabel}コメント` },
      { key: `${prefix}_shares`, label: `${typeLabel}シェア` },
      { key: `${prefix}_saves`, label: `${typeLabel}保存` },
    ];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const aggregatedData = getAggregatedData();
  const columns = getColumns();

  return <InsightDataTable data={aggregatedData} columns={columns} />;
};

export default DataTable; 