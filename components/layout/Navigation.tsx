import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/bookshelf', label: 'Bookshelf' },
  { href: '/add-book', label: 'Add Book' },
  { href: '/statistics', label: 'Statistics' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button className="mobile-nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <nav className={`nav ${isOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a className={`nav-item ${router.pathname === item.href ? 'active' : ''}`}>
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </>
  )
}
