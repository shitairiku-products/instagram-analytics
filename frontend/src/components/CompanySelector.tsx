'use client';

import { useCompanyList } from '@/hooks/useCompanyList';
import { useCompanyStore } from '@/components/store/companyStore';
import { Company } from '@/types/company';

export default function CompanySelector() {
  const { companies, loading } = useCompanyList();
  const { selectedCompany, setSelectedCompany } = useCompanyStore();

  if (loading) return <div className="text-sm text-gray-500">企業を読み込み中...</div>;

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="company" className="text-sm font-semibold">
        会社を選択:
      </label>
      <select
        id="company"
        value={selectedCompany?.id ?? ''}
        onChange={(e) => {
          const company = companies.find((c) => c.id === Number(e.target.value));
          if (company) setSelectedCompany(company);
        }}
        className="border px-2 py-1 rounded"
      >
        <option value="">選択してください</option>
        {companies.map((company: Company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}
