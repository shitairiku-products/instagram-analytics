import { useEffect, useState } from 'react';
import { AccountInsight } from '@/types/accountInsight'; // ou outro tipo específico se necessário
import { useCompanyStore } from '@/components/store/companyStore';
import { fetchFromAPI } from '@/lib/api';

export const useYearlyInsights = (startDate: string, endDate: string) => {
  const [insights, setInsights] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!selectedCompany) {
        setError('会社が選択されていません');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const data = await fetchFromAPI<AccountInsight[]>(
          `/api/v1/instagram/analytics/annual-summary?from=${startDate}&to=${endDate}`
        );

        setInsights(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedCompany, startDate, endDate]);

  return { insights, isLoading, error };
};

