import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import StatCard from '@/components/stats/StatCard'
import MonthlyChart from '@/components/charts/MonthlyChart'

export default function Dashboard() {
  const [stats, setStats] = useState<any>({})
  const router = useRouter()

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
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="add-book-btn" onClick={() => router.push('/add-book')}>Add New Book</button>
      </div>

      <div className="stats-grid">
        <StatCard label="Books Read This Year" value={stats.booksThisYear} />
        <StatCard label="Currently Reading" value={stats.currentlyReading} />
        <StatCard label="Total Pages Read" value={stats.totalPagesRead} />
        <StatCard label="Favorite Genre" value={stats.favoriteGenre} />
      </div>

      <div className="chart-container">
        {stats.monthlyData && <MonthlyChart data={stats.monthlyData} />}
      </div>
    </div>
  )
}
