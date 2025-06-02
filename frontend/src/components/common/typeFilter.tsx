'use client';

interface TypeFilterProps {
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
  onTypeChange: (types: ('FEED' | 'REELS' | 'STORY')[]) => void;
}

const TypeFilter = ({ selectedTypes, onTypeChange }: TypeFilterProps) => {
  const types: ('FEED' | 'REELS' | 'STORY')[] = ['FEED', 'REELS', 'STORY'];
  const typeLabels = {
    'FEED': 'フィード',
    'REELS': 'リール',
    'STORY': 'ストーリー'
  };

  const handleTypeClick = (type: 'FEED' | 'REELS' | 'STORY') => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex gap-2">
      {types.map(type => (
        <button
          key={type}
          onClick={() => handleTypeClick(type)}
          className={`px-4 py-1 rounded-lg border ${
            selectedTypes.includes(type)
              ? 'bg-[#ECE9C3] border-[#ECE9C3]'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {typeLabels[type]}
        </button>
      ))}
    </div>
  );
};

export default TypeFilter; 