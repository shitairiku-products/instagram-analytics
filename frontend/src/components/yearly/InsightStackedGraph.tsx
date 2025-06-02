'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type BarConfig = {
  key: string;
  name: string;
  fill: string;
};

type LineConfig = {
  key: string;
  name: string;
  stroke: string;
};

interface InsightStackedGraphProps {
  data: {
    yearMonth: string;
    reach: number;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  }[];
  bars: BarConfig[];
  line: LineConfig;
}

const InsightStackedGraph = ({ data, bars, line }: InsightStackedGraphProps) => {
  return (
    <div className="h-64 w-full bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          {bars.map((bar) => (
            <Bar 
              key={bar.key}
              yAxisId="left"
              dataKey={bar.key}
              name={bar.name}
              stackId="engagement"
              fill={bar.fill}
            />
          ))}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.stroke}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightStackedGraph; 