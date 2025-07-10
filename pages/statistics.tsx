import { useState, useEffect } from 'react'
import MonthlyChart from '@/components/charts/MonthlyChart'
import GenreChart from '@/components/charts/GenreChart'
import StatCard from '@/components/stats/StatCard'

export default function Statistics() {
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/statistics')
      const data = await response.json()
      setStats(data)
    }

    fetchStats()
  }, [])

  return (
    <div className="dashboard">
      <h1 className="page-title">Reading Statistics</h1>

      <div className="stats-grid">
        <StatCard label="Total Books Read" value={stats.booksThisYear} />
        <StatCard label="Total Pages Read" value={stats.totalPagesRead} />
        <StatCard label="Favorite Genre" value={stats.favoriteGenre} />
      </div>

      <div>
        <h2 className="section-title">Books Read by Month</h2>
        <div className="chart-container">
          {stats.monthlyData && <MonthlyChart data={stats.monthlyData} />}
        </div>
      </div>

      <div>
        <h2 className="section-title">Genre Breakdown</h2>
        <div className="chart-container">
          {stats.genreStats && <GenreChart data={stats.genreStats} />}
        </div>
      </div>
    </div>
  )
}
