'use client';

import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';
import { useDateStore } from '@/components/store/dateStore';
import { useEffect } from 'react';

const HomeContainer = () => {
  const { startDate, endDate, resetToDefault } = useDateStore();
  const { insights, isLoading, error } = useYearlyInsights(startDate, endDate);

  useEffect(() => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 2);
    
    resetToDefault(
      firstDayOfYear.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }, [resetToDefault]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          {/* 上部の大きなカード */}
          <div className="p-6">
            <DataTable insights={insights} />
          </div>

          {/* 下部のグリッド */}
          <div className="grid grid-cols-2 gap-6">
              <LeftGraph insights={insights} />
              <RightGraph insights={insights} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer;
