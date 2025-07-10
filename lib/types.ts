export interface Book {
  id: string
  isbn?: string
  title: string
  author: string
  publisher?: string
  published_year?: number
  genre?: string
  description?: string
  cover_url?: string
  total_pages?: number
  status: 'want_to_read' | 'currently_reading' | 'finished'
  current_page: number
  rating?: number
  started_date?: string
  finished_date?: string
  created_at: string
  updated_at: string
}

export interface ReadingSession {
  id: string
  book_id: string
  pages_read: number
  session_date: string
  notes?: string
  created_at: string
}
