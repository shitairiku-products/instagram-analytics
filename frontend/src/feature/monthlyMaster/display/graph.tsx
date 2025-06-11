'use client';

import { useMonthlyMaster } from '@/feature/monthlyMaster/hooks/useMonthlyMaster';
import { useCompanyStore } from '@/components/store/companyStore';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphProps {
  companyId: string;
  startDate?: string;
  endDate?: string;
  selectedTypes: string[];
}

const Graph = ({ startDate = '', endDate = '' }: GraphProps) => {
  const { selectedCompany } = useCompanyStore();
  const { insights, isLoading, error } = useMonthlyMaster(startDate, endDate);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">グラフデータを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (insights.length === 0) {
    return <div className="text-center py-4">データが見つかりませんでした</div>;
  }

  const chartData = insights.map(item => {
    const engagement =
      item.reachTotal > 0
        ? ((item.likesTotal + item.commentsTotal + item.savesTotal + item.sharesTotal) / item.reachTotal * 100).toFixed(2)
        : '0';

    return {
      date: item.date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit' }),
      エンゲージメント率: Number(engagement),
      いいね: item.likesTotal,
      コメント: item.commentsTotal,
      保存: item.savesTotal,
      シェア: item.sharesTotal,
    };
  });

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value, name) => [name === 'エンゲージメント率' ? `${value}%` : value, name]} />
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
