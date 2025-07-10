
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn VARCHAR(13),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  published_year INTEGER,
  genre VARCHAR(100),
  description TEXT,
  cover_url VARCHAR(500),
  total_pages INTEGER,
  status VARCHAR(20) CHECK (status IN ('want_to_read', 'currently_reading', 'finished')),
  current_page INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  started_date DATE,
  finished_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed)
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Books are insertable by everyone" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Books are updatable by everyone" ON books FOR UPDATE USING (true);
CREATE POLICY "Books are deletable by everyone" ON books FOR DELETE USING (true);
