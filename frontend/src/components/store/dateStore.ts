import { create } from 'zustand';

interface DateState {
  startDate: string;
  endDate: string;
  setDateRange: (startDate: string, endDate: string) => void;
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => void;
}

const getInitialDates = () => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  
  return {
    startDate: firstDayOfYear.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

export const useDateStore = create<DateState>((set) => ({
  ...getInitialDates(),
  setDateRange: (startDate: string, endDate: string) => set({ startDate, endDate }),
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => 
    set({ startDate: defaultStartDate, endDate: defaultEndDate }),
})); 