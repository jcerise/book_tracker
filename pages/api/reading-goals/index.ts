import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      {
        const { year } = req.query
        const { data, error } = await supabase
          .from('reading_goals')
          .select('*')
          .eq('year', year)
          .single()

        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json(data)
      }
    case 'POST':
      {
        const { year, target_books } = req.body
        const { data, error } = await supabase
          .from('reading_goals')
          .upsert({ year, target_books }, { onConflict: 'year' })

        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json(data)
      }
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
