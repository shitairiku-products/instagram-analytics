'use client';

import { PostInsight } from '@/types/post';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface GraphProps {
  companyId: string;
  startDate?: string;
  endDate?: string;
  selectedTypes: string[];
}

const Graph = ({ companyId, startDate, endDate, selectedTypes }: GraphProps) => {
  const [data, setData] = useState<PostInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({ 
          companyId,
          types: selectedTypes.join(',')
        });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const posts = await response.json();
        setData(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (isLoading) {
    return <div className="text-center py-4">グラフデータを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-4">データが見つかりませんでした</div>;
  }

  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartData = sortedData.map(post => {
    const engagement = post.reach ? ((post.likes + post.comments + post.saved + post.shares) / post.reach * 100).toFixed(2) : '0';
    return {
      date: new Date(post.timestamp).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
      エンゲージメント率: Number(engagement),
      いいね: post.likes,
      コメント: post.comments,
      保存: post.saved,
      シェア: post.shares,
    };
  });

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            yAxisId="left"
            orientation="left"
            domain={[0, 30]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 'auto']}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value, name) => [
            name === 'エンゲージメント率' ? `${value}%` : value,
            name
          ]}/>
          <Legend />
          <Bar dataKey="いいね" stackId="a" fill="#E5E7EB" yAxisId="left" />
          <Bar dataKey="コメント" stackId="a" fill="#93C5FD" yAxisId="left" />
          <Bar dataKey="保存" stackId="a" fill="#6B7280" yAxisId="left" />
          <Bar dataKey="シェア" stackId="a" fill="#10B981" yAxisId="left" />
          <Line
            type="monotone"
            dataKey="エンゲージメント率"
            stroke="#C5BC9D"
            strokeWidth={2}
            yAxisId="right"
            dot={{ fill: '#C5BC9D' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph; 