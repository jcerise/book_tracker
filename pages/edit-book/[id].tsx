import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BookForm from '@/components/books/BookForm'
import { Book } from '@/lib/types'

export default function EditBook() {
  const router = useRouter()
  const { id } = router.query
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        const response = await fetch(`/api/books/${id}`)
        if (response.ok) {
          const data = await response.json()
          setBook(data)
        }
      }
      fetchBook()
    }
  }, [id])

  const handleSubmit = async (data: Partial<Book>) => {
    const response = await fetch(`/api/books/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (response.ok) {
      router.push('/bookshelf')
    }
  }

  return (
    <div className="add-book-form">
      <h1 className="page-title">Edit Book</h1>
      {book ? <BookForm book={book} onSubmit={handleSubmit} /> : <p>Loading...</p>}
    </div>
  )
}
