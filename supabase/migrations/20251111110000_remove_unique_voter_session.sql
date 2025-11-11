-- Remove UNIQUE constraint on voter_session to allow multiple votes from same device
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_voter_session_key;