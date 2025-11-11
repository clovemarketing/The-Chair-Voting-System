import { BarChart3 } from 'lucide-react';

interface VoteResult {
  chairName: string;
  votes: number;
  percentage: number;
}

interface LiveResultsProps {
  results: VoteResult[];
  totalVotes: number;
  lastUpdate: Date | null;
}

export function LiveResults({ results, totalVotes, lastUpdate }: LiveResultsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Live Results</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-lg">
          Total Votes: <span className="font-bold text-gray-800">{totalVotes}</span>
        </p>
      </div>

      <div className="space-y-6">
        {results.map((result) => (
          <div key={result.chairName} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 text-lg">
                {result.chairName}
              </span>
              <span className="font-bold text-blue-600 text-xl">
                {result.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${result.percentage}%` }}
              >
                {result.percentage > 10 && (
                  <span className="text-white text-sm font-semibold">
                    {result.votes}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {lastUpdate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
