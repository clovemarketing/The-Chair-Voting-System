import { useState, useEffect } from 'react';
import { Chair } from '../lib/supabase';

interface ChairCardProps {
  chair: Chair;
  onVote: (chairId: string) => void;
  hasVoted: boolean;
  isLoading: boolean;
}

export function ChairCard({ chair, onVote, hasVoted, isLoading }: ChairCardProps) {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (hasVoted && cooldown === 0) {
      setCooldown(4);
    }
  }, [hasVoted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="w-32 h-32 rounded-lg overflow-hidden mb-6 shadow-md">
        <img
          src={chair.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center'}
          alt={chair.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {chair.name}
      </h3>

      <p className="text-gray-600 text-center mb-6 flex-grow">
        {chair.description}
      </p>

      <button
        onClick={() => onVote(chair.id)}
        disabled={cooldown > 0 || isLoading}
        className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
          cooldown > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg'
        }`}
      >
        {cooldown > 0 ? `Vote again in ${cooldown}s` : 'Vote'}
      </button>
    </div>
  );
}
