import React from 'react'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import BookResultCard from './BookResultCard'
import { ProcessedBookData } from '@/lib/types/googleBooks'

interface BookResultsModalProps {
  isOpen: boolean
  onClose: () => void
  results: ProcessedBookData[]
  onSelectBook: (book: ProcessedBookData) => void
  isLoading: boolean
  error?: string | null
  query?: string
  searchType?: 'isbn' | 'title'
}

export default function BookResultsModal({
  isOpen,
  onClose,
  results,
  onSelectBook,
  isLoading,
  error,
  query,
  searchType = 'isbn'
}: BookResultsModalProps) {
  const handleSelectBook = (book: ProcessedBookData) => {
    onSelectBook(book)
    onClose()
  }

  const getModalTitle = () => {
    const searchTypeText = searchType === 'isbn' ? 'ISBN' : 'title'
    if (isLoading) return `Searching by ${searchTypeText}...`
    if (error) return 'Search Error'
    if (results.length === 0) return 'No books found'
    if (results.length === 1) return 'Book found'
    return `${results.length} books found`
  }

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="book-results-loading">
          <LoadingSpinner size="lg" text={`Searching Google Books by ${searchType}...`} />
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div className="book-results-error">
          <div className="error-icon">⚠️</div>
          <h3>Search Failed</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={onClose}
          >
            Try Again
          </button>
        </div>
      )
    }

    // No results state
    if (results.length === 0) {
      return (
        <div className="book-results-empty">
          <div className="empty-icon">📚</div>
          <h3>No books found</h3>
          <p>
            {query 
              ? `No books were found for ${searchType === 'isbn' ? 'ISBN' : 'title'}: "${query}"`
              : 'No books were found for your search'
            }
          </p>
          <div className="empty-suggestions">
            <p>Try:</p>
            <ul>
              {searchType === 'isbn' ? (
                <>
                  <li>Double-checking the ISBN number</li>
                  <li>Removing any dashes or spaces</li>
                  <li>Searching by book title instead</li>
                </>
              ) : (
                <>
                  <li>Checking the spelling of the title</li>
                  <li>Using a shorter or more general title</li>
                  <li>Searching by ISBN if you have it</li>
                </>
              )}
            </ul>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )
    }

    // Results grid
    return (
      <div className="book-results-container">
        {query && (
          <div className="book-results-query">
            Showing results for {searchType === 'isbn' ? 'ISBN' : 'title'}: <strong>{query}</strong>
          </div>
        )}
        
        <div className="book-results-grid">
          {results.map((book, index) => (
            <BookResultCard
              key={`${book.id}-${index}`}
              book={book}
              onSelect={handleSelectBook}
            />
          ))}
        </div>
        
        <div className="book-results-footer">
          <p className="results-count">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="xl"
      closeOnBackdrop={!isLoading}
    >
      {renderContent()}
    </Modal>
  )
}