'use client';

import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';
import { useDateStore } from '@/components/store/dateStore';
import { useEffect, useRef } from 'react';
import { ExportPDFButton } from '@/components/ExportPDFButton';

const HomeContainer = () => {
  const { startDate, endDate, resetToDefault } = useDateStore();
  const { insights, isLoading, error } = useYearlyInsights(startDate, endDate);

  const tableRef = useRef<HTMLDivElement | null>(null);
  const leftGraphRef = useRef<HTMLDivElement | null>(null);
  const rightGraphRef = useRef<HTMLDivElement | null>(null);


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
    <div className="space-y-6 px-6">
      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          <div>
            <ExportPDFButton chartRefs={[tableRef, leftGraphRef, rightGraphRef]} />
          </div>

          <div ref={tableRef} className="bg-white text-black p-6 rounded shadow">
            <DataTable insights={insights} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={leftGraphRef} className="bg-white text-black p-4 rounded shadow">
              <LeftGraph insights={insights} />
            </div>
            <div ref={rightGraphRef} className="bg-white text-black p-4 rounded shadow">
              <RightGraph insights={insights} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer;


