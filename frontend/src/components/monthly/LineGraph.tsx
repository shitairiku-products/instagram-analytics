'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type LineConfig = {
  key: string;
  name: string;
  stroke: string;
};

interface LineGraphProps {
  data: {
    date: string;
    value: number;
  }[];
  lines: LineConfig[];
  height?: string;
}

const LineGraph = ({ data, lines, height = '100%' }: LineGraphProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">表示するデータがありません</div>;
  }

  return (
    <div className={`w-full bg-white`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
            tickFormatter={(value) => `${value}日`}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
            }}
            labelFormatter={(value) => `${value}日`}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.stroke}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph; 