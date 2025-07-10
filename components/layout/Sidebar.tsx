import { useStatistics } from '@/hooks/useStatistics'
import ReadingGoal from '@/components/stats/ReadingGoal'
import BookCard from '@/components/books/BookCard'

export default function Sidebar() {
  const { stats } = useStatistics()

  return (
    <aside className="sidebar">
      <div className="widget">
        <h3 className="widget-title">Currently Reading</h3>
        {stats?.currentlyReadingBooks?.map((book) => (
          <BookCard key={book.id} book={book} showStatusChanger={false} />
        ))}
      </div>

      {stats && (
        <ReadingGoal
          initialTarget={stats.readingGoal}
          booksRead={stats.booksThisYear}
        />
      )}

      <div className="widget">
        <h3 className="widget-title">Quick Stats</h3>
        {stats && (
          <div style={{ fontSize: '14px', lineHeight: 1.8 }}>
            <div>Books this year: {stats.booksThisYear}</div>
            <div>Total pages read: {stats.totalPagesRead}</div>
            <div>Favorite Genre: {stats.favoriteGenre}</div>
          </div>
        )}
      </div>
    </aside>
  )
}
