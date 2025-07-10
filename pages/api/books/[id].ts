import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      if (!data) {
        return res.status(404).json({ error: 'Book not found' })
      }

      res.status(200).json(data)
      break
    case 'PUT':
      const { status, ...bookData } = req.body

      if (status) {
        bookData.status = status
        if (status === 'finished') {
          bookData.finished_date = new Date().toISOString()
        } else {
          bookData.finished_date = null
        }
      }

      const { data: updatedBook, error: putError } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', id)
        .select()

      if (putError) {
        return res.status(500).json({ error: putError.message })
      }

      res.status(200).json(updatedBook)
      break
    case 'DELETE':
      const { error: deleteError } = await supabase.from('books').delete().eq('id', id)

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message })
      }

      res.status(204).end()
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
