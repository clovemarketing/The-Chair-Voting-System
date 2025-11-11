-- Update database to allow multiple votes from same device
-- Run this in your Supabase SQL Editor

-- Remove UNIQUE constraint on voter_session to allow multiple votes
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_voter_session_key;