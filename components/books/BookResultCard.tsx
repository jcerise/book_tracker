import React from 'react'
import { ProcessedBookData } from '@/lib/types/googleBooks'
import { truncateDescription, formatPublicationDate } from '@/lib/utils/googleBooks'

interface BookResultCardProps {
  book: ProcessedBookData
  onSelect: (book: ProcessedBookData) => void
}

export default function BookResultCard({ book, onSelect }: BookResultCardProps) {
  const handleSelect = () => {
    onSelect(book)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect()
    }
  }

  return (
    <div 
      className="book-result-card"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select book: ${book.title} by ${book.author}`}
    >
      <div className="book-result-cover">
        <img 
          src={book.cover_url || '/placeholder-book.svg'}
          alt={`Cover of ${book.title}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-book.svg'
          }}
        />
      </div>
      
      <div className="book-result-details">
        <h3 className="book-result-title">
          {book.title}
        </h3>
        
        <p className="book-result-author">
          by {book.author}
        </p>
        
        <div className="book-result-meta">
          {book.publisher && (
            <span className="book-result-publisher">
              {book.publisher}
            </span>
          )}
          
          {book.publishedDate && (
            <span className="book-result-date">
              {formatPublicationDate(book.publishedDate)}
            </span>
          )}
        </div>
        
        {book.pageCount && (
          <div className="book-result-pages">
            {book.pageCount} pages
          </div>
        )}
        
        {book.categories && book.categories.length > 0 && (
          <div className="book-result-genres">
            {book.categories.slice(0, 2).map((category, index) => (
              <span key={index} className="book-result-genre-tag">
                {category}
              </span>
            ))}
          </div>
        )}
        
        {book.description && (
          <p className="book-result-description">
            {truncateDescription(book.description, 120)}
          </p>
        )}
        
        {book.averageRating && (
          <div className="book-result-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(book.averageRating))}
              {'☆'.repeat(5 - Math.floor(book.averageRating))}
            </span>
            <span className="rating-text">
              {book.averageRating.toFixed(1)}
              {book.ratingsCount && ` (${book.ratingsCount} reviews)`}
            </span>
          </div>
        )}
        
        <div className="book-result-select-indicator">
          Click to select this book
        </div>
      </div>
    </div>
  )
}