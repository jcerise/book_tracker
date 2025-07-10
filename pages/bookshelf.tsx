import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Book } from '@/lib/types'
import BookGrid from '@/components/books/BookGrid'
import { useStatistics } from '@/hooks/useStatistics'

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([])
  const [status, setStatus] = useState('all')
  const router = useRouter()
  const { refreshStats } = useStatistics()

  const fetchBooks = useCallback(async () => {
    const response = await fetch(`/api/books?status=${status}`)
    const data = await response.json()
    setBooks(data)
  }, [status])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleStatusChange = async (id: string, newStatus: Book['status']) => {
    const response = await fetch(`/api/books/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      }
    )

    if (response.ok) {
      fetchBooks() // Re-fetch books to update the list
      refreshStats() // Refresh stats to update sidebar
    }
  }

  return (
    <div className="bookshelf">
      <div className="dashboard-header">
        <h1 className="page-title">My Bookshelf</h1>
        <button className="add-book-btn" onClick={() => router.push('/add-book')}>Add New Book</button>
      </div>

      <div className="shelf-filters">
        <button className={`filter-btn ${status === 'all' ? 'active' : ''}`} onClick={() => setStatus('all')}>All</button>
        <button className={`filter-btn ${status === 'want_to_read' ? 'active' : ''}`} onClick={() => setStatus('want_to_read')}>Want to Read</button>
        <button className={`filter-btn ${status === 'currently_reading' ? 'active' : ''}`} onClick={() => setStatus('currently_reading')}>Currently Reading</button>
        <button className={`filter-btn ${status === 'finished' ? 'active' : ''}`} onClick={() => setStatus('finished')}>Finished</button>
      </div>

      <BookGrid books={books} onStatusChange={handleStatusChange} />
    </div>
  )
}
