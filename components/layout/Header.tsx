import Link from 'next/link'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link href="/" className="logo">
          BookTracker
        </Link>
        <ThemeToggle />
      </div>
      <Navigation />
    </header>
  )
}
