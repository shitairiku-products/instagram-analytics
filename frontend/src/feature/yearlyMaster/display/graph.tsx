'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { useDateStore } from '@/components/store/dateStore';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateFeedData, aggregateReelsData, aggregateStoryData } from '@/components/calucurate/accountCalculate';

interface FeedGraphProps {
  selectedType: 'FEED' | 'REELS' | 'STORY';
}

const FeedGraph = ({ selectedType }: FeedGraphProps) => {
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

  const getAggregatedData = () => {
    switch (selectedType) {
      case 'FEED':
        return aggregateFeedData(insights);
      case 'REELS':
        return aggregateReelsData(insights);
      case 'STORY':
        return aggregateStoryData(insights);
      default:
        return [];
    }
  };

  const getTypeLabel = () => {
    const labels = {
      'FEED': 'フィード',
      'REELS': 'リール',
      'STORY': 'ストーリー'
    };
    return labels[selectedType];
  };

  const graphData = getAggregatedData();
  const typeLabel = getTypeLabel();

  if (isLoading) {
    return <div className="text-center py-4">グラフデータを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!graphData.length) {
    return <div className="text-center py-4">表示するデータがありません</div>;
  }

  return (
    <div className="h-64 w-full bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis 
            dataKey="yearMonth"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px'
            }}
          />
          <Bar 
            yAxisId="left"
            dataKey="likes"
            name={`${typeLabel}いいね`}
            stackId="engagement"
            fill="#D3D3D3"
          />
          <Bar 
            yAxisId="left"
            dataKey="comments"
            name={`${typeLabel}コメント`}
            stackId="engagement"
            fill="#20B2AA"
          />
          <Bar 
            yAxisId="left"
            dataKey="shares"
            name={`${typeLabel}シェア`}
            stackId="engagement"
            fill="#4682B4"
          />
          <Bar 
            yAxisId="left"
            dataKey="saves"
            name={`${typeLabel}保存`}
            stackId="engagement"
            fill="#6B8E23"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="reach"
            name={`${typeLabel}リーチ`}
            stroke="#DAA520"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedGraph; 