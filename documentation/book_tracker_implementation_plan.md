# Book Tracker Implementation Plan
## Next.js + Supabase Full-Stack App

---

## 📋 Project Overview

**Tech Stack:**
- **Frontend/Backend:** Next.js 14 with TypeScript
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel + Supabase
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Image Optimization:** Next.js Image component

---

## 🗂️ Project Structure

```
book-tracker/
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/
│       ├── 20240101000001_create_books_table.sql
│       ├── 20240101000002_create_reading_sessions_table.sql
│       ├── 20240101000003_create_reading_goals_table.sql
│       └── 20240101000004_create_indexes.sql
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── books/
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   ├── BookForm.tsx
│   │   └── IsbnSearch.tsx
│   ├── charts/
│   │   ├── ReadingProgressChart.tsx
│   │   ├── MonthlyChart.tsx
│   │   └── GenreChart.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── ThemeToggle.tsx
│   └── stats/
│       ├── StatCard.tsx
│       └── ReadingGoal.tsx
├── pages/
│   ├── api/
│   │   ├── books/
│   │   │   ├── index.ts
│   │   │   └── [id].ts
│   │   ├── isbn/
│   │   │   └── [isbn].ts
│   │   ├── statistics/
│   │   │   └── index.ts
│   │   └── upload/
│   │       └── cover.ts
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx (Dashboard)
│   ├── bookshelf.tsx
│   ├── add-book.tsx
│   └── statistics.tsx
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   ├── utils.ts
│   └── isbn-api.ts
├── hooks/
│   ├── useBooks.ts
│   ├── useStatistics.ts
│   └── useTheme.ts
├── styles/
│   └── globals.css
└── public/
    └── placeholder-book.jpg
```

---

## 🗄️ Database Schema (Supabase Local)

### Migration Files Structure

**`supabase/migrations/20240101000001_create_books_table.sql`**
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn VARCHAR(13),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  published_year INTEGER,
  genre VARCHAR(100),
  description TEXT,
  cover_url VARCHAR(500),
  total_pages INTEGER,
  status VARCHAR(20) CHECK (status IN ('want_to_read', 'currently_reading', 'finished')),
  current_page INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  started_date DATE,
  finished_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed)
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Books are insertable by everyone" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Books are updatable by everyone" ON books FOR UPDATE USING (true);
CREATE POLICY "Books are deletable by everyone" ON books FOR DELETE USING (true);
```

**`supabase/migrations/20240101000002_create_reading_sessions_table.sql`**
```sql
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  pages_read INTEGER NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reading sessions are viewable by everyone" ON reading_sessions FOR SELECT USING (true);
CREATE POLICY "Reading sessions are insertable by everyone" ON reading_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Reading sessions are updatable by everyone" ON reading_sessions FOR UPDATE USING (true);
CREATE POLICY "Reading sessions are deletable by everyone" ON reading_sessions FOR DELETE USING (true);
```

**`supabase/migrations/20240101000003_create_reading_goals_table.sql`**
```sql
CREATE TABLE reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  target_books INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(year)
);

-- Enable Row Level Security
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reading goals are viewable by everyone" ON reading_goals FOR SELECT USING (true);
CREATE POLICY "Reading goals are insertable by everyone" ON reading_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Reading goals are updatable by everyone" ON reading_goals FOR UPDATE USING (true);
CREATE POLICY "Reading goals are deletable by everyone" ON reading_goals FOR DELETE USING (true);
```

**`supabase/migrations/20240101000004_create_indexes.sql`**
```sql
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_created_at ON books(created_at);
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_date ON reading_sessions(session_date);
```

### Database Seed Data

**`supabase/seed.sql`**
```sql
-- Insert sample reading goal
INSERT INTO reading_goals (year, target_books) VALUES 
  (2025, 50);

-- Insert sample books
INSERT INTO books (isbn, title, author, total_pages, status, genre) VALUES 
  ('9780143127741', 'Atomic Habits', 'James Clear', 320, 'currently_reading', 'Self-Help'),
  ('9780735211292', 'Educated', 'Tara Westover', 334, 'finished', 'Memoir'),
  ('9780525559474', 'Becoming', 'Michelle Obama', 448, 'want_to_read', 'Biography');

-- Insert sample reading sessions
INSERT INTO reading_sessions (book_id, pages_read, session_date) VALUES 
  ((SELECT id FROM books WHERE title = 'Atomic Habits'), 25, '2025-06-28'),
  ((SELECT id FROM books WHERE title = 'Atomic Habits'), 30, '2025-06-29'),
  ((SELECT id FROM books WHERE title = 'Educated'), 50, '2025-06-20');
```

---

## 📦 Phase 1: Project Setup (Week 1)

### Day 1-2: Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest book-tracker --typescript --tailwind --eslint

# Install dependencies
npm install @supabase/supabase-js
npm install recharts
npm install lucide-react
npm install @headlessui/react
npm install date-fns
npm install react-hook-form
npm install zod
npm install @hookform/resolvers
```

### Day 3-4: Supabase Local Development Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
cd book-tracker
supabase init

# Start local Supabase stack (requires Docker)
supabase start
```

**Docker Requirements:**
- Docker Desktop installed and running
- At least 4GB RAM allocated to Docker
- Ports 54321-54324 available

**Local Supabase Stack includes:**
- PostgreSQL database (port 54322)
- PostgREST API (port 54321)
- Supabase Studio (port 54323)
- Supabase Auth (built-in)
- Supabase Storage (built-in)

### Day 5-7: Database Setup & Project Structure
1. Create database schema using migrations
2. Set up folder structure
3. Configure Tailwind CSS
4. Create basic layout components
5. Implement theme toggle functionality

**Environment Variables (.env.local):**
```env
# Local Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key

# Production (when ready to deploy)
# NEXT_PUBLIC_SUPABASE_URL=your_hosted_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_hosted_supabase_anon_key

GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

---

## 📚 Phase 2: Core Book Management (Week 2-3)

### API Routes Implementation

**`/api/books/index.ts`** - CRUD operations
```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Fetch all books with filtering and pagination
      const { status, page = 1, limit = 20 } = req.query
      break
    case 'POST':
      // Create new book
      const bookData = req.body
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

**`/api/isbn/[isbn].ts`** - ISBN lookup
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isbn } = req.query
  
  try {
    // Call Google Books API
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    )
    const data = await response.json()
    
    // Parse and return book data
    const bookInfo = parseGoogleBooksResponse(data)
    res.status(200).json(bookInfo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book data' })
  }
}
```

### Core Components

**Book Management:**
- BookCard component for grid display
- BookForm for adding/editing
- IsbnSearch for book lookup
- BookGrid with filtering

**Data Types (`lib/types.ts`):**
```typescript
export interface Book {
  id: string
  isbn?: string
  title: string
  author: string
  publisher?: string
  published_year?: number
  genre?: string
  description?: string
  cover_url?: string
  total_pages?: number
  status: 'want_to_read' | 'currently_reading' | 'finished'
  current_page: number
  rating?: number
  started_date?: string
  finished_date?: string
  created_at: string
  updated_at: string
}

export interface ReadingSession {
  id: string
  book_id: string
  pages_read: number
  session_date: string
  notes?: string
  created_at: string
}
```

---

## 📊 Phase 3: Statistics & Analytics (Week 4)

### Statistics API
**`/api/statistics/index.ts`**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stats = await calculateReadingStatistics()
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate statistics' })
  }
}

async function calculateReadingStatistics() {
  // Books read this year
  const booksThisYear = await supabase
    .from('books')
    .select('*')
    .eq('status', 'finished')
    .gte('finished_date', `${new Date().getFullYear()}-01-01`)

  // Monthly reading data
  const monthlyData = await getMonthlyReadingData()
  
  // Genre breakdown
  const genreStats = await getGenreStatistics()
  
  return {
    booksThisYear: booksThisYear.data?.length || 0,
    currentlyReading: await getCurrentlyReadingCount(),
    averageRating: await getAverageRating(),
    totalPages: await getTotalPagesRead(),
    monthlyData,
    genreStats,
    readingStreak: await getReadingStreak()
  }
}
```

### Chart Components
- Monthly reading progress chart
- Genre distribution pie chart
- Reading goal progress
- Pages read over time

---

## 🎨 Phase 4: UI Implementation (Week 5-6)

### Pages Implementation

**Dashboard (`pages/index.tsx`):**
- Reading statistics overview
- Quick stats cards
- Current reading progress
- Recent activity

**Bookshelf (`pages/bookshelf.tsx`):**
- Grid view of book covers
- Status filtering (Want to Read, Currently Reading, Finished)
- Search and sort functionality
- Responsive grid layout

**Add Book (`pages/add-book.tsx`):**
- ISBN search form
- Manual book entry form
- Book preview
- Status selection

**Statistics (`pages/statistics.tsx`):**
- Detailed analytics
- Multiple chart views
- Export functionality
- Historical data

### UI Components

**Responsive Design:**
- Mobile-first approach
- Collapsible navigation
- Touch-friendly interactions
- Optimized image loading

**Dark Mode:**
- System preference detection
- Persistent theme storage
- Smooth transitions
- Complete theme coverage

---

## 🚀 Phase 5: Advanced Features (Week 7-8)

### Enhanced Features
1. **Reading Sessions Tracking**
   - Log daily reading progress
   - Reading time tracking
   - Notes and highlights

2. **Advanced Statistics**
   - Reading velocity analysis
   - Genre preferences over time
   - Reading goal projections

3. **Data Import/Export**
   - CSV import for existing collections
   - Backup and restore functionality
   - Integration with Goodreads

4. **Search & Discovery**
   - Advanced book search
   - Reading recommendations
   - Popular books integration

---

## 🌐 Phase 6: Deployment & Optimization (Week 9)

### Deployment Setup

**Option 1: Deploy with Local Database (Development)**
```bash
# Continue using local Supabase for development
# Good for: Local development, testing, offline work
```

**Option 2: Migrate to Hosted Supabase (Production)**
```bash
# Create hosted Supabase project
supabase projects create book-tracker

# Link your local project to hosted project
supabase link --project-ref your-project-ref

# Push local migrations to hosted database
supabase db push

# Update environment variables for production
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-hosted-anon-key
```

**Vercel Deployment Configuration:**
```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  },
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

**Local vs Production Environment Management:**
```typescript
// lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Automatically works with both local and hosted Supabase
```

2. **Performance Optimization**
   - Image optimization for book covers
   - API response caching
   - Database query optimization
   - Code splitting

3. **SEO & Analytics**
   - Meta tags for each page
   - Sitemap generation
   - Google Analytics integration

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Performance testing

---

## 📱 Bonus Features (Future Enhancements)

### Progressive Web App (PWA)
- Offline functionality
- Install prompt
- Background sync

### Social Features
- Reading challenges
- Book recommendations
- Share reading progress

### Advanced Analytics
- Reading patterns analysis
- Predictive recommendations
- Detailed reporting

---

## 🛠️ Development Tools & Commands

### Essential Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:status": "supabase status",
    "supabase:reset": "supabase db reset",
    "supabase:seed": "supabase db seed",
    "supabase:types": "supabase gen types typescript --local > lib/database.types.ts",
    
    "db:migrate": "supabase migration up",
    "db:new-migration": "supabase migration new",
    "db:studio": "open http://localhost:54323"
  }
}
```

### Daily Development Workflow
```bash
# 1. Start your development session
npm run supabase:start
npm run dev

# 2. Make database changes (create migration)
npm run db:new-migration add_new_feature

# 3. Apply changes
npm run supabase:reset

# 4. Generate new types after schema changes
npm run supabase:types

# 5. End development session
npm run supabase:stop
```

### Database Management & Migration Commands

**Development Workflow:**
```bash
# Start local Supabase (run this each time you start development)
supabase start

# Create a new migration
supabase migration new add_book_ratings

# Apply migrations to local database
supabase db reset

# Generate TypeScript types from your schema
supabase gen types typescript --local > lib/database.types.ts

# View local database in browser
# Navigate to http://localhost:54323

# Stop local Supabase when done
supabase stop
```

**Migration Management:**
```bash
# Check migration status
supabase migration list

# Apply specific migration
supabase migration up

# Rollback migration (if needed)
supabase migration down

# Seed database with sample data
supabase db seed
```

**Local Development URLs:**
- **Supabase Studio**: http://localhost:54323
- **Database URL**: postgresql://postgres:postgres@localhost:54322/postgres
- **API URL**: http://localhost:54321
- **Auth URL**: http://localhost:54321/auth/v1

---

## 📈 Success Metrics

### Technical Goals
- Page load time < 2 seconds
- Mobile responsiveness score > 95
- Accessibility score > 90
- SEO score > 85

### User Experience Goals
- Intuitive book addition process
- Fast book cover loading
- Smooth navigation between views
- Reliable data persistence

---

## 🚦 Getting Started Checklist

**Prerequisites:**
- [ ] Install Docker Desktop and ensure it's running
- [ ] Install Node.js (18.17 or later)
- [ ] Install Supabase CLI: `npm install -g supabase`

**Week 1:**
- [ ] Create Next.js project: `npx create-next-app@latest book-tracker --typescript --tailwind --eslint`
- [ ] Initialize Supabase: `supabase init`
- [ ] Start local Supabase stack: `supabase start`
- [ ] Set up environment variables (.env.local)
- [ ] Create migration files for database schema
- [ ] Apply migrations: `supabase db reset`
- [ ] Generate TypeScript types: `npm run supabase:types`
- [ ] Create basic project structure
- [ ] Verify local Supabase Studio works: http://localhost:54323

**Week 2:**
- [ ] Create book data types using generated Supabase types
- [ ] Implement book CRUD API routes
- [ ] Build ISBN lookup functionality
- [ ] Create basic book components
- [ ] Test database operations in Supabase Studio

**Week 3:**
- [ ] Complete bookshelf grid view
- [ ] Add book filtering and search
- [ ] Implement add book form with ISBN search
- [ ] Create responsive navigation
- [ ] Test all CRUD operations

**Docker Troubleshooting:**
If you encounter issues with `supabase start`:
- Ensure Docker Desktop is running
- Check available ports (54321-54324)
- Try `supabase stop` then `supabase start` again
- Check Docker logs: `docker logs supabase_db_book-tracker`

**Ready to start coding with local Supabase! 🎉**