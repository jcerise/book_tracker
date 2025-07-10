# Book Tracker

A personal book tracking application for managing your reading journey. Track books you want to read, are currently reading, and have finished, with detailed progress monitoring and statistics.

**Note**: This is a single-user, self-hosted application with no user accounts. It's designed for personal use to track your reading progress.

## Features

- **Book Management**: Add, edit, and organize books with ISBN lookup via Google Books API
- **Reading Progress**: Track daily reading sessions and page progress
- **Reading Goals**: Set and monitor annual reading targets
- **Statistics Dashboard**: View detailed reading analytics with charts and insights
- **Multiple Status Tracking**: Organize books by "Want to Read", "Currently Reading", and "Finished"
- **Responsive Design**: Works on desktop and mobile with dark/light theme support

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Docker (for local Supabase)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd booktracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Supabase CLI

```bash
npm install -g @supabase/cli
```

### 4. Start Local Supabase Stack

```bash
supabase start
```

This will start the local Supabase instance. Note the API URL and anon key from the output.

### 5. Environment Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
GOOGLE_BOOKS_API_KEY=<your-google-books-api-key>
```

To get a Google Books API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Books API
4. Create credentials (API Key)

### 6. Run Database Migrations

```bash
supabase db reset
```

### 7. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 8. Access Supabase Studio (Optional)

Visit http://localhost:54323 to manage your database directly.

## Production Deployment

1. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
2. Set up a production Supabase project
3. Update environment variables with production Supabase credentials
4. Run migrations on production database

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `supabase status` - Check local Supabase status
- `supabase stop` - Stop local Supabase stack

## Architecture

Built with:
- **Next.js 14** with TypeScript
- **Supabase** for database and authentication
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** with Zod validation

## Usage

1. **Add Books**: Use the ISBN search or manually add book details
2. **Track Progress**: Update reading sessions and page progress
3. **Set Goals**: Create annual reading targets
4. **View Statistics**: Monitor your reading habits and progress

This application stores all data locally in your Supabase instance and is designed for single-user personal tracking.