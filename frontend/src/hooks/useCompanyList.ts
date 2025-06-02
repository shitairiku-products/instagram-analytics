import { useEffect, useState } from 'react';
import { getCompanies } from '@/lib/api';
import { Company } from '@/types/company';

export const useCompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, []);

  return { companies, loading };
};
