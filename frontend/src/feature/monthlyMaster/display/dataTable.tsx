'use client';

import { useMonthlyMaster } from '@/feature/monthlyMaster/hooks/useMonthlyMaster';
import { useCompanyStore } from '@/components/store/companyStore';
import { useEffect, useState } from 'react';

interface DataTableProps {
  companyId: string;
  startDate?: string;
  endDate?: string;
  selectedTypes: string[];
}

const DataTable = ({ startDate = '', endDate = '' }: DataTableProps) => {
  const { selectedCompany } = useCompanyStore();
  const { insights, isLoading, error } = useMonthlyMaster(startDate, endDate);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (insights.length === 0) {
    return <div className="text-center py-4">データが見つかりませんでした</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-2 text-center">月</th>
            <th className="px-4 py-2 text-center">フォロワー</th>
            <th className="px-4 py-2 text-center">リーチ</th>
            <th className="px-4 py-2 text-center">インプレッション</th>
            <th className="px-4 py-2 text-center">プロフィール閲覧</th>
            <th className="px-4 py-2 text-center">リンククリック</th>
            <th className="px-4 py-2 text-center">いいね</th>
            <th className="px-4 py-2 text-center">コメント</th>
            <th className="px-4 py-2 text-center">保存</th>
            <th className="px-4 py-2 text-center">シェア</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-900">
          {insights.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-center">{item.date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit' })}</td>
              <td className="px-4 py-2 text-center">{item.followers}</td>
              <td className="px-4 py-2 text-center">{item.reachTotal}</td>
              <td className="px-4 py-2 text-center">{item.impressions}</td>
              <td className="px-4 py-2 text-center">{item.profileVisits}</td>
              <td className="px-4 py-2 text-center">{item.webTaps}</td>
              <td className="px-4 py-2 text-center">{item.likesTotal}</td>
              <td className="px-4 py-2 text-center">{item.commentsTotal}</td>
              <td className="px-4 py-2 text-center">{item.savesTotal}</td>
              <td className="px-4 py-2 text-center">{item.sharesTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
