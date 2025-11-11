-- Add image_url column to chairs table
ALTER TABLE chairs ADD COLUMN IF NOT EXISTS image_url text;

-- Update existing chairs with placeholder images
UPDATE chairs SET image_url = CASE
  WHEN name = 'The Cloud Seat' THEN 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&crop=center'
  WHEN name = 'The Orbit Seat' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center'
  WHEN name = 'The Focus Seat' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center'
END
WHERE image_url IS NULL;