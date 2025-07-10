import { Book } from '@/lib/types'
import BookCard from './BookCard'

interface BookGridProps {
  books: Book[]
  onStatusChange: (id: string, newStatus: Book['status']) => void
}

export default function BookGrid({ books, onStatusChange }: BookGridProps) {
  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onStatusChange={onStatusChange} />
      ))}
    </div>
  )
}
