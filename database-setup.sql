-- Chair Voting System Database Setup
-- Run these commands in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create chairs table
CREATE TABLE IF NOT EXISTS chairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chair_id uuid NOT NULL REFERENCES chairs(id) ON DELETE CASCADE,
  voter_session text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(voter_session)
);

-- Enable Row Level Security
ALTER TABLE chairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view chairs"
  ON chairs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_chair_id ON votes(chair_id);
CREATE INDEX IF NOT EXISTS idx_votes_session ON votes(voter_session);

-- Insert initial chair data
INSERT INTO chairs (name, description) VALUES
  ('The Cloud Seat', 'Soft, cushioned comfort that feels like floating on air'),
  ('The Orbit Seat', 'Modern ergonomic design with 360° swivel capability'),
  ('The Focus Seat', 'Premium support for extended work sessions')
ON CONFLICT (name) DO NOTHING;

-- Add image_url column
ALTER TABLE chairs ADD COLUMN IF NOT EXISTS image_url text;

-- Update chairs with placeholder images
UPDATE chairs SET image_url = CASE
  WHEN name = 'The Cloud Seat' THEN 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=center'
  WHEN name = 'The Orbit Seat' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center'
  WHEN name = 'The Focus Seat' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center'
END
WHERE image_url IS NULL;