'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateMonthlyData } from '@/components/calucurate/accountCalculate';
import { useMemo } from 'react';

interface RightGraphProps {
  insights: AccountInsight[];
}

const RightGraph = ({ insights }: RightGraphProps) => {
  const graphData = useMemo(() => {
    const monthlyData = aggregateMonthlyData(insights);
    return monthlyData.map(data => ({
      ...data,
      yearMonth: data.year_month
    }));
  }, [insights]);

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
            name="いいね"
            stackId="engagement"
            fill="#D3D3D3"
          />
          <Bar 
            yAxisId="left"
            dataKey="comments" 
            name="コメント"
            stackId="engagement"
            fill="#20B2AA"
          />
          <Bar 
            yAxisId="left"
            dataKey="shares" 
            name="シェア"
            stackId="engagement"
            fill="#696969"
          />
          <Bar 
            yAxisId="left"
            dataKey="saves" 
            name="保存"
            stackId="engagement"
            fill="#40E0D0"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="impressions"
            name="インプレッション"
            stroke="#D4AF37"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RightGraph; 