'use client';

import { useEffect, useState } from 'react';
import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';
import { useDateStore } from '@/components/store/dateStore';
import { useCompanyStore } from '@/components/store/companyStore';

const HomeContainer = () => {
  const [isClient, setIsClient] = useState(false);
  const { startDate, endDate, resetToDefault } = useDateStore();
  const { selectedCompany } = useCompanyStore();

  const { insights, isLoading, error } = useYearlyInsights(startDate, endDate);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 2);
    
    resetToDefault(
      firstDayOfYear.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }, [isClient, resetToDefault]);

  if (!isClient) return null;

  if (!selectedCompany) {
    return <div className="text-center py-4">会社を選択してください</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          <div className="p-6">
            <DataTable insights={insights} />
          </div>

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

