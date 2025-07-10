import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleBooksResponse } from '@/lib/types/googleBooks'
import { processGoogleBooksVolume, validateSearchInput, createGoogleBooksQuery, detectSearchType } from '@/lib/utils/googleBooks'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { isbn: searchQuery } = req.query

  if (!searchQuery || typeof searchQuery !== 'string') {
    return res.status(400).json({ error: 'Search query is required' })
  }

  // Validate search input (ISBN or title)
  const validation = validateSearchInput(searchQuery)
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error })
  }

  try {
    // Create search query based on input type
    const query = createGoogleBooksQuery(searchQuery)
    const searchType = detectSearchType(searchQuery)
    
    // Call Google Books API with appropriate parameters
    const maxResults = searchType === 'isbn' ? 10 : 20 // More results for title searches
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=relevance`
    
    // Add API key if available
    const finalUrl = process.env.GOOGLE_BOOKS_API_KEY 
      ? `${apiUrl}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      : apiUrl

    const response = await fetch(finalUrl)
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`)
    }

    const data: GoogleBooksResponse = await response.json()

    // Check if any results found
    if (!data.items || data.items.length === 0) {
      const errorMessage = searchType === 'isbn' 
        ? `No books found for ISBN: ${searchQuery}`
        : `No books found for title: "${searchQuery}"`
      
      return res.status(404).json({ 
        error: errorMessage,
        totalItems: 0,
        results: [],
        searchType
      })
    }

    // Process all results
    const processedResults = data.items.map(processGoogleBooksVolume)

    // Return multiple results for user selection
    res.status(200).json({
      totalItems: data.totalItems,
      results: processedResults,
      query: searchQuery,
      searchType
    })

  } catch (error) {
    console.error('Google Books API error:', error)
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API error: 429')) {
        return res.status(429).json({ 
          error: 'Too many requests. Please try again in a moment.' 
        })
      }
      
      if (error.message.includes('API error: 403')) {
        return res.status(403).json({ 
          error: 'API access denied. Please check API key configuration.' 
        })
      }
    }

    res.status(500).json({ 
      error: 'Failed to fetch book data. Please try again.' 
    })
  }
}
