import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stats = await calculateReadingStatistics()
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate statistics' })
  }
}

async function calculateReadingStatistics() {
  const currentYear = new Date().getFullYear()

  const booksThisYear = await supabase
    .from('books')
    .select('id') // only need count
    .eq('status', 'finished')
    .gte('finished_date', `${currentYear}-01-01`)
    .lt('finished_date', `${currentYear + 1}-01-01`)

  const currentlyReading = await supabase
    .from('books')
    .select('*', { count: 'exact' })
    .eq('status', 'currently_reading')

  const currentlyReadingBooks = await supabase
    .from('books')
    .select('*')
    .eq('status', 'currently_reading')
    .order('started_date', { ascending: false })
    .limit(5)

  const { data: finishedBooksPages } = await supabase
    .from('books')
    .select('total_pages')
    .eq('status', 'finished')

  const totalPagesRead =
    finishedBooksPages?.reduce((acc, book) => acc + (book.total_pages || 0), 0) || 0

  const genreStats = await getGenreStatistics()
  const favoriteGenre = genreStats.length > 0 ? genreStats.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'

  const monthlyData = await getMonthlyReadingData(currentYear)

  const { data: readingGoalData } = await supabase
    .from('reading_goals')
    .select('target_books')
    .eq('year', currentYear)
    .single()

  return {
    booksThisYear: booksThisYear.data?.length || 0,
    currentlyReading: currentlyReading.count || 0,
    currentlyReadingBooks: currentlyReadingBooks.data || [],
    totalPagesRead,
    favoriteGenre,
    monthlyData,
    genreStats,
    readingGoal: readingGoalData?.target_books || 0,
  }
}

async function getMonthlyReadingData(year: number) {
  const { data, error } = await supabase
    .from('books')
    .select('finished_date')
    .eq('status', 'finished')
    .gte('finished_date', `${year}-01-01`)
    .lt('finished_date', `${year + 1}-01-01`)

  if (error) {
    throw new Error(error.message)
  }

  const monthlyCounts = Array(12).fill(0)
  data.forEach((book) => {
    if (book.finished_date) {
      const month = new Date(book.finished_date).getMonth()
      monthlyCounts[month]++
    }
  })

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return monthNames.map((name, index) => ({
    name,
    books: monthlyCounts[index],
  }))
}

async function getGenreStatistics() {
  const { data, error } = await supabase
    .from('books')
    .select('genre')
    .eq('status', 'finished')
    .not('genre', 'is', null)

  if (error) {
    throw new Error(error.message)
  }

  const genreCounts: { [key: string]: number } = {}
  data.forEach((book) => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
    }
  })

  return Object.entries(genreCounts).map(([name, value]) => ({ name, value }))
}
