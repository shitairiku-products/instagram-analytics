'use client';

import { useState, useEffect, useRef } from 'react';

type Company = {
  id: string;
  name: string;
  igId: string;
};

type CompanyDropdownProps = {
  isOpen: boolean;
  companies: Company[];
  onSelect: (company: Company) => void;
  onClose: () => void;
};

export default function CompanyDropdown({ isOpen, companies, onSelect, onClose }: CompanyDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!Array.isArray(companies)) {
      console.error('companies is not an array:', companies);
      setFilteredCompanies([]);
      return;
    }

    const filtered = companies.filter(company =>
      company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-100 bg-gray-100 rounded-lg shadow-lg h-[600px] overflow-hidden z-50">
      <div className="p-2">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="企業名で検索..."
          className="w-full px-3 py-2 bg-white shadow-inner rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-y-auto max-h-[550px]">
        {filteredCompanies.length === 0 ? (
          <div className="px-4 py-3 text-gray-500 text-center">
            該当する企業が見つかりません
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div 
              key={company.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
              onClick={() => {
                onSelect(company);
                onClose();
                setSearchQuery('');
              }}
            >
              <div className="truncate">
                {company.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 