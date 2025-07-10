import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface Statistics {
  booksThisYear: number
  currentlyReading: number
  currentlyReadingBooks: any[]
  totalPagesRead: number
  favoriteGenre: string
  readingGoal: number
}

interface StatisticsContextType {
  stats: Statistics | null
  refreshStats: () => void
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined)

export function StatisticsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Statistics | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/statistics', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refreshStats = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <StatisticsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatisticsContext.Provider>
  )
}

export function useStatistics() {
  const context = useContext(StatisticsContext)
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider')
  }
  return context
}
