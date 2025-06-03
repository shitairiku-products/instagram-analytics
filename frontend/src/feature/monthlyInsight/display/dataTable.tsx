'use client';

import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMonthlyInsights } from '../hooks/useMonthlyInsights';

interface DataTableProps {
  startDate: string;
  endDate: string;
}

const DataTable = ({ startDate, endDate }: DataTableProps) => {
  const { insights, isLoading, error } = useMonthlyInsights(startDate, endDate, 'feed');

  const monthlyData = calculateNewFollowers(insights, startDate, endDate);

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (!monthlyData.length) {
    return <div className="text-center py-4">データが見つかりませんでした</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-[12px] w-1/7 px-1 py-2 text-left font-medium">日付</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">新規フォロワー数</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">インプレッション</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">リーチ</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">プロフィール<br />アクセス</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">ウェブサイトの<br />タップ</th>
            <th className="text-[12px] w-1/7 px-1 py-2 text-right font-medium">ウェブサイトの<br />タップ率</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="text-[10px] py-0.5 px-2 text-left">{row.date}日</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.followers.toLocaleString()}</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.impressions.toLocaleString()}</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.reach_total.toLocaleString()}</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.profile_visits.toLocaleString()}</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.website_taps.toLocaleString()}</td>
              <td className="text-[10px] py-0.5 px-2 text-right">{row.website_tap_rate.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;


