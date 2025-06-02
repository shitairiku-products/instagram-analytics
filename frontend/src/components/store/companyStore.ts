import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/types/company';

interface CompanyState {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      selectedCompany: null,
      setSelectedCompany: (company) => set({ selectedCompany: company }),
    }),
    {
      name: 'company-storage', // ストレージのキー名
    }
  )
); 