'use client';

interface TypeChoiceProps {
  selectedType: 'FEED' | 'REELS' | 'STORY';
  onTypeChange: (type: 'FEED' | 'REELS' | 'STORY') => void;
}

const TypeChoice = ({ selectedType, onTypeChange }: TypeChoiceProps) => {
  const types: ('FEED' | 'REELS' | 'STORY')[] = ['FEED', 'REELS', 'STORY'];
  const typeLabels = {
    'FEED': 'フィード',
    'REELS': 'リール',
    'STORY': 'ストーリー'
  };

  return (
    <div className="flex gap-2">
      {types.map(type => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-2 rounded-lg border ${
            selectedType === type
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

export default TypeChoice; 