import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Fetch all books with filtering and pagination
      const { status, page = 1, limit = 20 } = req.query
      let query = supabase.from('books').select('*')

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query
        .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1)
        .order('created_at', { ascending: false })

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      res.status(200).json(data)
      break
    case 'POST':
      // Create new book
      const bookData = req.body
      const { data: newBook, error: postError } = await supabase.from('books').insert(bookData).select()

      if (postError) {
        return res.status(500).json({ error: postError.message })
      }

      res.status(201).json(newBook)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
