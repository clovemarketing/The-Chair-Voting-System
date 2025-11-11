/*
  # Chair Voting System Database Schema

  1. New Tables
    - `chairs`
      - `id` (uuid, primary key) - Unique identifier for each chair
      - `name` (text) - Name of the chair (e.g., "The Cloud Seat")
      - `description` (text) - Brief description of the chair
      - `created_at` (timestamptz) - Timestamp of creation
    
    - `votes`
      - `id` (uuid, primary key) - Unique identifier for each vote
      - `chair_id` (uuid, foreign key) - References chairs table
      - `voter_session` (text) - Anonymous session identifier to prevent duplicate voting
      - `created_at` (timestamptz) - Timestamp of vote
  
  2. Security
    - Enable RLS on both tables
    - Allow public read access to chairs table
    - Allow public read access to votes table for counting
    - Allow authenticated and anonymous users to insert votes
    - Prevent duplicate votes from same session using unique constraint
  
  3. Initial Data
    - Pre-populate three chairs: The Cloud Seat, The Orbit Seat, The Focus Seat
*/

CREATE TABLE IF NOT EXISTS chairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chair_id uuid NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
  voter_session text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(voter_session)
);

ALTER TABLE chairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chairs"
  ON chairs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_votes_chair_id ON votes(chair_id);
CREATE INDEX IF NOT EXISTS idx_votes_session ON votes(voter_session);

INSERT INTO chairs (name, description) VALUES
  ('The Cloud Seat', 'Soft, cushioned comfort that feels like floating on air'),
  ('The Orbit Seat', 'Modern ergonomic design with 360° swivel capability'),
  ('The Focus Seat', 'Premium support for extended work sessions')
ON CONFLICT (name) DO NOTHING;