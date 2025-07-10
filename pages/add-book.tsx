import { useState } from 'react'
import { useRouter } from 'next/router'
import IsbnSearch from '@/components/books/IsbnSearch'
import BookForm from '@/components/books/BookForm'
import { ProcessedBookData } from '@/lib/types/googleBooks'

export default function AddBook() {
  const [selectedBook, setSelectedBook] = useState<ProcessedBookData | undefined>()
  const router = useRouter()

  const handleBookSelected = (book: ProcessedBookData) => {
    setSelectedBook(book)
  }

  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/bookshelf')
    }
  }

  return (
    <div className="add-book-form p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h1 className="page-title">Add New Book</h1>

      <div className="form-group">
        <label className="form-label">Search by ISBN</label>
        <IsbnSearch onBookSelected={handleBookSelected} />
      </div>

      {selectedBook && (
        <div className="selected-book-indicator">
          <div className="success-message">
            ✅ <strong>{selectedBook.title}</strong> by {selectedBook.author} has been selected and form fields have been populated below.
          </div>
        </div>
      )}

      <BookForm book={selectedBook} onSubmit={handleSubmit} />
    </div>
  )
}
