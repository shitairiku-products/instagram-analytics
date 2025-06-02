'use client';

import { useState, useEffect } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import { useCompanyStore } from '@/components/store/companyStore';
import { useDateStore } from '@/components/store/dateStore';
import TypeFilter from '@/components/common/typeFilter';

type MediaType = 'REELS' | 'FEED' | 'STORY';

export default function HomeContainer() {
  const { selectedCompany } = useCompanyStore();
  const { startDate, endDate, resetToDefault } = useDateStore();
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(['REELS', 'FEED', 'STORY']);

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, 2);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    resetToDefault(
      lastMonth.toISOString().split('T')[0],
      lastDayOfLastMonth.toISOString().split('T')[0]
    );
  }, [resetToDefault]);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  return (
    <div className="px-4">
      <div>
        <div className="flex justify-between items-center pb-4">
          <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
        </div>
        <div className="mb-8">
          <DataTable 
            companyId={selectedCompany.id} 
            startDate={startDate} 
            endDate={endDate}
            selectedTypes={selectedTypes}
          />
        </div>
        <Graph 
          companyId={selectedCompany.id} 
          startDate={startDate} 
          endDate={endDate}
          selectedTypes={selectedTypes}
        />
      </div>
    </div>
  );
} 