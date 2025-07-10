import { GoogleBooksVolume, ProcessedBookData, ImageLinks } from '../types/googleBooks'

/**
 * Get the optimal image URL based on the desired size
 */
export const getOptimalImageUrl = (
  imageLinks?: ImageLinks, 
  preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!imageLinks) return ''

  // Priority order for each preferred size
  const sizePriorities = {
    thumbnail: ['thumbnail', 'smallThumbnail', 'small', 'medium'],
    small: ['small', 'thumbnail', 'medium', 'smallThumbnail'],
    medium: ['medium', 'small', 'large', 'thumbnail'],
    large: ['large', 'extraLarge', 'medium', 'small']
  }

  const priorities = sizePriorities[preferredSize]
  
  for (const size of priorities) {
    const url = imageLinks[size as keyof ImageLinks]
    if (url) {
      // Convert HTTP to HTTPS for Google Books images
      return url.replace('http://', 'https://')
    }
  }

  return ''
}

/**
 * Extract year from Google Books published date
 */
export const extractYearFromDate = (publishedDate?: string): number | undefined => {
  if (!publishedDate) return undefined
  
  const year = parseInt(publishedDate.substring(0, 4))
  return isNaN(year) ? undefined : year
}

/**
 * Extract ISBN-10 and ISBN-13 from industry identifiers
 */
export const extractISBNs = (industryIdentifiers?: Array<{ type: string; identifier: string }>) => {
  const isbn10 = industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier
  const isbn13 = industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
  
  return { isbn10, isbn13 }
}

/**
 * Get primary ISBN (prefer ISBN-13, fallback to ISBN-10)
 */
export const getPrimaryISBN = (industryIdentifiers?: Array<{ type: string; identifier: string }>): string | undefined => {
  const { isbn10, isbn13 } = extractISBNs(industryIdentifiers)
  return isbn13 || isbn10
}

/**
 * Validate ISBN format (10 or 13 digits)
 */
export const validateISBN = (isbn: string): boolean => {
  const cleanedISBN = isbn.replace(/[-\s]/g, '')
  return /^(\d{10}|\d{13})$/.test(cleanedISBN)
}

/**
 * Clean and format ISBN for API calls
 */
export const formatISBN = (isbn: string): string => {
  return isbn.replace(/[-\s]/g, '')
}

/**
 * Convert Google Books volume to our processed book data format
 */
export const processGoogleBooksVolume = (volume: GoogleBooksVolume): ProcessedBookData => {
  const { volumeInfo } = volume
  const { isbn10, isbn13 } = extractISBNs(volumeInfo.industryIdentifiers)
  
  return {
    id: volume.id,
    title: volumeInfo.title,
    authors: volumeInfo.authors || [],
    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    published_year: extractYearFromDate(volumeInfo.publishedDate),
    description: volumeInfo.description,
    pageCount: volumeInfo.pageCount,
    total_pages: volumeInfo.pageCount,
    categories: volumeInfo.categories || [],
    genre: volumeInfo.categories?.join(', '),
    imageLinks: volumeInfo.imageLinks,
    cover_url: getOptimalImageUrl(volumeInfo.imageLinks, 'medium'),
    isbn10,
    isbn13,
    isbn: getPrimaryISBN(volumeInfo.industryIdentifiers),
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount
  }
}

/**
 * Create truncated description for display
 */
export const truncateDescription = (description?: string, maxLength = 150): string => {
  if (!description) return 'No description available'
  
  if (description.length <= maxLength) return description
  
  return description.substring(0, maxLength).trim() + '...'
}

/**
 * Format publication date for display
 */
export const formatPublicationDate = (publishedDate?: string): string => {
  if (!publishedDate) return 'Unknown'
  
  const year = extractYearFromDate(publishedDate)
  if (!year) return 'Unknown'
  
  // Try to parse full date
  const date = new Date(publishedDate)
  if (isNaN(date.getTime())) return year.toString()
  
  // Return formatted date if valid
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Detect if input is an ISBN or title search
 */
export const detectSearchType = (input: string): 'isbn' | 'title' => {
  const cleanedInput = input.replace(/[-\s]/g, '')
  // Check if it's a valid ISBN format (10 or 13 digits)
  if (/^\d{10}$/.test(cleanedInput) || /^\d{13}$/.test(cleanedInput)) {
    return 'isbn'
  }
  return 'title'
}

/**
 * Create search query for Google Books API (supports both ISBN and title)
 */
export const createGoogleBooksQuery = (searchInput: string): string => {
  const searchType = detectSearchType(searchInput)
  
  if (searchType === 'isbn') {
    const cleanedISBN = formatISBN(searchInput)
    return `isbn:${cleanedISBN}`
  } else {
    // For title searches, use title field and clean the input
    const cleanedTitle = searchInput.trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ')
    return `intitle:"${cleanedTitle}"`
  }
}

/**
 * Validate search input (ISBN or title)
 */
export const validateSearchInput = (input: string): { isValid: boolean; error?: string } => {
  const trimmedInput = input.trim()
  
  if (!trimmedInput) {
    return { isValid: false, error: 'Please enter an ISBN or book title' }
  }
  
  const searchType = detectSearchType(trimmedInput)
  
  if (searchType === 'isbn') {
    if (!validateISBN(trimmedInput)) {
      return { isValid: false, error: 'Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN' }
    }
  } else {
    // Title validation
    if (trimmedInput.length < 2) {
      return { isValid: false, error: 'Book title must be at least 2 characters long' }
    }
    if (trimmedInput.length > 100) {
      return { isValid: false, error: 'Book title is too long (max 100 characters)' }
    }
  }
  
  return { isValid: true }
}