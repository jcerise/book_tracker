import Link from 'next/link'
import { Book } from '@/lib/types'

interface BookCardProps {
  book: Book
  onStatusChange?: (id: string, newStatus: Book['status']) => void
  showStatusChanger?: boolean
}

export default function BookCard({ book, onStatusChange, showStatusChanger = true }: BookCardProps) {
  return (
    <div className="book-card">
      <div className="book-cover">
        <Link href={`/edit-book/${book.id}`} legacyBehavior>
          <div className="edit-icon">⚙️</div>
        </Link>
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} />
        ) : (
          <span>No Cover</span>
        )}
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-author">{book.author}</div>
      {showStatusChanger && onStatusChange && (
        <div className="status-selector" style={{ marginTop: '10px' }}>
          <select
            className="form-input"
            value={book.status}
            onChange={(e) => onStatusChange(book.id, e.target.value as Book['status'])}
          >
            <option value="want_to_read">Want to Read</option>
            <option value="currently_reading">Currently Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      )}
    </div>
  )
}
