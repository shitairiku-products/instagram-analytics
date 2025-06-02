'use client';

import { useEffect } from 'react';
import DataTable from './dataTable';
import { 
  NewFollowersGraph, 
  ReachImpressionGraph, 
  ProfileVisitsGraph,
  WebsiteTapRateGraph 
} from './graphs';
import { useDateStore } from '@/components/store/dateStore';

const HomeContainer = () => {
  const { startDate, endDate, resetToDefault } = useDateStore();

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 2);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    resetToDefault(
      lastMonth.toISOString().split('T')[0],
      lastDayOfLastMonth.toISOString().split('T')[0]
    );
  }, [resetToDefault]);

  return (
    <div className="px-4 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* 左半分：データテーブル */}
        <div className="h-full">
            <DataTable 
              startDate={startDate}
              endDate={endDate}
            />
        </div>

        {/* 右半分：グラフ */}
        <div className="h-full">
          <div className="h-1/4 max-h-[200px]">
            <NewFollowersGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <ReachImpressionGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <ProfileVisitsGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <WebsiteTapRateGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer; 