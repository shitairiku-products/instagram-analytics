'use client';

interface InsightDataTableProps {
  data: Record<string, number | string>[];
  columns: {
    key: string;
    label: string;
  }[];
}

const InsightDataTable = ({ data, columns }: InsightDataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-2 font-medium ${
                  column.key === 'yearMonth' ? 'text-left' : 'text-right'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-2 ${
                    column.key === 'yearMonth' ? 'text-left' : 'text-right'
                  }`}
                >
                  {typeof row[column.key] === 'number'
                    ? row[column.key].toLocaleString()
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsightDataTable; 