'use client';

import { useState, useEffect } from 'react';
import CompanyDropdown from '../common/CompanyDropdown';
import { useCompanyStore } from '@/components/store/companyStore';
import { useDateStore } from '@/components/store/dateStore';
import Link from 'next/link';
import Image from 'next/image';
import DateFilter from '../common/dateFilter';
import { usePathname } from 'next/navigation';

type Company = {
  id: string;
  name: string;
  igId: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { selectedCompany, setSelectedCompany } = useCompanyStore();
  const { startDate, endDate, setDateRange } = useDateStore();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.error('会社情報の形式が不正:', data);
          setCompanies([]);
        }
      } catch (error) {
        console.error('会社情報の取得に失敗:', error);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany && Array.isArray(companies) && companies.length > 0) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany, setSelectedCompany]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setDateRange(newStartDate, newEndDate);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="">
      <div className="w-full py-2 px-12 bg-[#ECE9C3] shadow">
        <div className="flex items-center">
          <div className="flex items-center gap-6">
            <Image src="/SVG/logo.svg" alt="logo" width={32} height={32} />
            <h1 className="text-xl font-bold">AnalyGram</h1>
          </div>
          <div className="flex items-center ml-auto relative">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="truncate max-w-[300px]">
                <p className="mr-2">{selectedCompany?.name || '会社を選択'}</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            
            <CompanyDropdown
              isOpen={isOpen}
              companies={companies}
              onSelect={handleCompanySelect}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between px-12 py-4 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/yearly">
            <h2 className={`text-medium font-bold mb-2 py-2 px-8 rounded-full shadow-md transition-colors ${
              isActive('/yearly') ? 'bg-[#ECE9C3]' : 'bg-gray-100'
            }`}>年間インサイト</h2>
          </Link>
          <Link href="/monthly">
            <h2 className={`text-medium font-bold mb-2 py-2 px-8 rounded-full shadow-md transition-colors ${
              isActive('/monthly') ? 'bg-[#ECE9C3]' : 'bg-gray-100'
            }`}>月間インサイト</h2>
          </Link>
          <Link href="/yearly/master">
            <h2 className={`text-medium font-bold mb-2 py-2 px-8 rounded-full shadow-md transition-colors ${
              isActive('/yearly/master') ? 'bg-[#ECE9C3]' : 'bg-gray-100'
            }`}>年間メディアタイプマスター</h2>
          </Link>
          <Link href="/monthly/master">
            <h2 className={`text-medium font-bold mb-2 py-2 px-8 rounded-full shadow-md transition-colors ${
              isActive('/monthly/master') ? 'bg-[#ECE9C3]' : 'bg-gray-100'
            }`}>投稿マスター</h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DateFilter 
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>
      </div>
    </header>
  );
} 