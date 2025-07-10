import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import * as z from 'zod'
import { ProcessedBookData } from '@/lib/types/googleBooks'
import { Book } from '@/lib/types'

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().optional(),
  published_year: z.number().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  total_pages: z.number().min(1, 'Total pages must be greater than 0'),
  cover_url: z.string().optional(),
  isbn: z.string().optional(),
  status: z.enum(['want_to_read', 'currently_reading', 'finished']),
})

type BookFormData = z.infer<typeof bookSchema>

interface BookFormProps {
  book?: ProcessedBookData | Book
  onSubmit: (data: BookFormData) => void
}

export default function BookForm({ book, onSubmit }: BookFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      published_year: undefined,
      genre: '',
      description: '',
      total_pages: 0,
      cover_url: '',
      isbn: '',
      status: 'want_to_read',
    },
  })

  // Update form when book data changes
  useEffect(() => {
    if (book) {
      // Handle both ProcessedBookData and existing Book types
      const isProcessedBookData = 'authors' in book
      
      reset({
        title: book.title || '',
        author: isProcessedBookData ? book.author : book.author || '',
        publisher: book.publisher || '',
        published_year: book.published_year,
        genre: book.genre || '',
        description: book.description || '',
        total_pages: isProcessedBookData 
          ? (book.total_pages || book.pageCount || 0)
          : (book.total_pages || 0),
        cover_url: book.cover_url || '',
        isbn: isProcessedBookData ? book.isbn : book.isbn || '',
        status: isProcessedBookData ? 'want_to_read' : (book.status || 'want_to_read'),
      })
    }
  }, [book, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input type="text" className="form-input" {...register('title')} />
        {errors.title && <p className="error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Author</label>
        <input type="text" className="form-input" {...register('author')} />
        {errors.author && <p className="error">{errors.author.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Publisher</label>
        <input type="text" className="form-input" {...register('publisher')} />
        {errors.publisher && <p className="error">{errors.publisher.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Published Year</label>
        <input type="number" className="form-input" {...register('published_year', { valueAsNumber: true })} />
        {errors.published_year && <p className="error">{errors.published_year.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Genre</label>
        <input type="text" className="form-input" {...register('genre')} />
        {errors.genre && <p className="error">{errors.genre.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea 
          className="form-input" 
          rows={3}
          {...register('description')} 
        />
        {errors.description && <p className="error">{errors.description.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Total Pages</label>
        <input type="number" className="form-input" {...register('total_pages', { valueAsNumber: true })} />
        {errors.total_pages && <p className="error">{errors.total_pages.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Cover Image URL</label>
        <input type="url" className="form-input" {...register('cover_url')} />
        {errors.cover_url && <p className="error">{errors.cover_url.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">ISBN</label>
        <input type="text" className="form-input" {...register('isbn')} />
        {errors.isbn && <p className="error">{errors.isbn.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Reading Status</label>
        <div className="status-selector">
          <select {...register('status')} className="form-input">
            <option value="want_to_read">Want to Read</option>
            <option value="currently_reading">Currently Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      </div>

      <button type="submit" className="add-book-btn">{book ? 'Update Book' : 'Add Book to Library'}</button>
    </form>
  )
}
