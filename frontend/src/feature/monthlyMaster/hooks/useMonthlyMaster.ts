import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { fetchFromAPI } from '@/lib/api';
import { mapMonthlyApiDataToAccountInsight, MonthlyApiResponse } from '@/utils/transform/monthlyAdapter';
import { AccountInsight } from '@/types/accountInsight';

export const useMonthlyMaster = (startDate: string, endDate: string, mediatype: string = 'feed') => {
  const [insights, setInsights] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    if (!selectedCompany) {
      setError('会社が選択されていません');
      setIsLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFromAPI<MonthlyApiResponse[]>(
          `/api/v1/instagram/analytics/monthly-details?mediatype=${mediatype}&from=${startDate}&to=${endDate}`
        );
        const transformed = mapMonthlyApiDataToAccountInsight(data);
        setInsights(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedCompany?.id, startDate, endDate, mediatype]);

  return { insights, isLoading, error };
};



