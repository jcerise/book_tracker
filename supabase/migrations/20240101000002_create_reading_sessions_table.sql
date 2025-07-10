
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  pages_read INTEGER NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reading sessions are viewable by everyone" ON reading_sessions FOR SELECT USING (true);
CREATE POLICY "Reading sessions are insertable by everyone" ON reading_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Reading sessions are updatable by everyone" ON reading_sessions FOR UPDATE USING (true);
CREATE POLICY "Reading sessions are deletable by everyone" ON reading_sessions FOR DELETE USING (true);
