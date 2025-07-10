
-- Insert sample reading goal
INSERT INTO reading_goals (year, target_books) VALUES 
  (2025, 50);

-- Insert sample books
INSERT INTO books (isbn, title, author, total_pages, status, genre) VALUES 
  ('9780143127741', 'Atomic Habits', 'James Clear', 320, 'currently_reading', 'Self-Help'),
  ('9780735211292', 'Educated', 'Tara Westover', 334, 'finished', 'Memoir'),
  ('9780525559474', 'Becoming', 'Michelle Obama', 448, 'want_to_read', 'Biography');

-- Insert sample reading sessions
INSERT INTO reading_sessions (book_id, pages_read, session_date) VALUES 
  ((SELECT id FROM books WHERE title = 'Atomic Habits'), 25, '2025-06-28'),
  ((SELECT id FROM books WHERE title = 'Atomic Habits'), 30, '2025-06-29'),
  ((SELECT id FROM books WHERE title = 'Educated'), 50, '2025-06-20');
