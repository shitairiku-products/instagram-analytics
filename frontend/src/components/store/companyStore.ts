import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Company = {
  id: string;
  name: string;
  igId: string;
};

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