
CREATE TABLE reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  target_books INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(year)
);

-- Enable Row Level Security
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reading goals are viewable by everyone" ON reading_goals FOR SELECT USING (true);
CREATE POLICY "Reading goals are insertable by everyone" ON reading_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Reading goals are updatable by everyone" ON reading_goals FOR UPDATE USING (true);
CREATE POLICY "Reading goals are deletable by everyone" ON reading_goals FOR DELETE USING (true);
