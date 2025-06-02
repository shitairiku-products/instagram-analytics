'use client';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

const DateFilter = ({ startDate, endDate, onDateChange }: DateFilterProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const date = e.target.value;
    if (type === 'start') {
      onDateChange(date, endDate);
    } else {
      onDateChange(startDate, date);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="startDate" className="text-sm text-gray-700">開始日:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => handleDateChange(e, 'start')}
          className="px-3 py-2 bg-gray-100 rounded-lg"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="endDate" className="text-sm text-gray-700">終了日:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => handleDateChange(e, 'end')}
          className="px-3 py-2 bg-gray-100 rounded-lg"
        />
      </div>
    </div>
  );
};

export default DateFilter; 