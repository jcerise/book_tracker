import { useState } from 'react'
import BookResultsModal from './BookResultsModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ProcessedBookData } from '@/lib/types/googleBooks'
import { validateSearchInput, detectSearchType } from '@/lib/utils/googleBooks'

interface BookSearchProps {
  onBookSelected: (book: ProcessedBookData) => void
}

interface SearchResponse {
  totalItems: number
  results: ProcessedBookData[]
  query: string
  searchType: 'isbn' | 'title'
  error?: string
}

export default function BookSearch({ onBookSelected }: BookSearchProps) {
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<ProcessedBookData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'isbn' | 'title'>('isbn')

  const handleSearch = async () => {
    const trimmedInput = searchInput.trim()
    
    // Validate search input
    const validation = validateSearchInput(trimmedInput)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid search input')
      return
    }

    // Detect search type
    const detectedType = detectSearchType(trimmedInput)
    setSearchType(detectedType)

    // Clear previous errors
    setError(null)
    setIsLoading(true)
    setIsModalOpen(true)
    setSearchQuery(trimmedInput)

    try {
      const response = await fetch(`/api/isbn/${encodeURIComponent(trimmedInput)}`)
      const data: SearchResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for books')
      }

      setSearchResults(data.results || [])
      
      // Always show modal for user selection, even with single result
      // This gives users the opportunity to review book details before selecting

    } catch (error) {
      console.error('Book search error:', error)
      setError(error instanceof Error ? error.message : 'Failed to search for books')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSelect = (book: ProcessedBookData) => {
    onBookSelected(book)
    handleCloseModal()
    setSearchInput('') // Clear the search field
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSearchResults([])
    setError(null)
    setSearchQuery('')
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setSearchInput('')
    setError(null)
  }

  // Get placeholder text based on detected search type
  const getPlaceholderText = () => {
    if (!searchInput.trim()) {
      return 'Enter ISBN or book title'
    }
    const detectedType = detectSearchType(searchInput)
    return detectedType === 'isbn' 
      ? 'ISBN detected - click Search' 
      : 'Title search - click Search'
  }

  return (
    <>
      <div className="book-search">
        <div className="search-input-container">
          <input
            type="text"
            className={`form-input ${error ? 'error' : ''}`}
            placeholder={getPlaceholderText()}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          
          {searchInput && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        
        <button 
          className="search-btn" 
          onClick={handleSearch}
          disabled={isLoading || !searchInput.trim()}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Searching...</span>
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {searchInput.trim() && (
        <div className="search-type-indicator">
          {detectSearchType(searchInput) === 'isbn' ? (
            <span className="search-type isbn">📖 ISBN Search</span>
          ) : (
            <span className="search-type title">📚 Title Search</span>
          )}
        </div>
      )}

      {error && (
        <div className="search-error">
          {error}
        </div>
      )}

      <BookResultsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        results={searchResults}
        onSelectBook={handleBookSelect}
        isLoading={isLoading}
        error={error}
        query={searchQuery}
        searchType={searchType}
      />
    </>
  )
}
