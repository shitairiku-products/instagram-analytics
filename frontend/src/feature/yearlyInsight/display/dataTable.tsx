import { AccountInsight } from '@/types/accountInsight';
import { aggregateMonthlyData } from '@/components/calucurate/accountCalculate';
import { useMemo } from 'react';

interface DataTableProps {
  insights: AccountInsight[];
}

const DataTable = ({ insights }: DataTableProps) => {
  const aggregatedData = useMemo(() => {
    return aggregateMonthlyData(insights);
  }, [insights]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-2/18 px-4 py-2 text-left font-medium">年, 月</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">フォロワー数</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">新規フォロワー数</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">リーチ</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">インプレッション数</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">プロフィールのアクセス</th>
            <th className="w-2/18 px-4 py-2 text-right font-medium">ウェブサイトのタップ</th>
            <th className="w-1/18 px-4 py-2 text-right font-medium">いいね</th>
            <th className="w-1/18 px-4 py-2 text-right font-medium">コメント</th>
            <th className="w-1/18 px-4 py-2 text-right font-medium">保存</th>
            <th className="w-1/18 px-4 py-2 text-right font-medium">シェア</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">{row.year_month}</td>
              <td className="px-4 py-2 text-right">{row.followers.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.new_followers.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.reach.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.impressions.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.profile_views.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.website_taps.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.likes.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.comments.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.saves.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.shares.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 