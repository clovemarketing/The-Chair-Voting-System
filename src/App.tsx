import { useEffect, useState, useCallback } from 'react';
import { supabase, Chair } from './lib/supabase';
import { ChairCard } from './components/ChairCard';
import { LiveResults } from './components/LiveResults';
import { Vote } from 'lucide-react';

interface VoteResult {
  chairName: string;
  votes: number;
  percentage: number;
}

function App() {
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('voter_session');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('voter_session', newId);
    return newId;
  });

  const fetchChairs = useCallback(async () => {
    const { data, error } = await supabase
      .from('chairs')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching chairs:', error);
      return;
    }

    setChairs(data || []);
  }, []);

  const fetchResults = useCallback(async () => {
    const { data: votes, error } = await supabase
      .from('votes')
      .select('chair_id');

    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }

    const { data: chairsData } = await supabase
      .from('chairs')
      .select('id, name');

    if (!chairsData) return;

    const voteCounts = votes?.reduce((acc, vote) => {
      acc[vote.chair_id] = (acc[vote.chair_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const total = votes?.length || 0;
    setTotalVotes(total);

    const resultsData = chairsData.map(chair => ({
      chairName: chair.name,
      votes: voteCounts[chair.id] || 0,
      percentage: total > 0 ? ((voteCounts[chair.id] || 0) / total) * 100 : 0,
    }));

    resultsData.sort((a, b) => b.votes - a.votes);
    setResults(resultsData);
    setLastUpdate(new Date());
  }, []);



  const handleVote = async (chairId: string) => {
    if (isLoading || cooldown > 0) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('votes')
      .insert({
        chair_id: chairId,
        voter_session: sessionId,
      });

    if (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } else {
      setCooldown(4);
      await fetchResults();
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    fetchChairs();
    fetchResults();

    const channel = supabase
      .channel('votes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChairs, fetchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Vote className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">
              Chair Selection Voting System
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Cast your vote for your favorite chair below!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {chairs.map((chair) => (
            <ChairCard
              key={chair.id}
              chair={chair}
              onVote={handleVote}
              hasVoted={cooldown > 0}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <LiveResults
            results={results}
            totalVotes={totalVotes}
            lastUpdate={lastUpdate}
          />
        </div>

        <footer className="text-center py-8 border-t border-gray-300">
          <p className="text-gray-600 text-lg">
            Developed by <span className="font-semibold text-gray-800">Clove Technologies</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
