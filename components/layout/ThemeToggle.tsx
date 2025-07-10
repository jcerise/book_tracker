import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark)
  }

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className={`theme-icon ${isDark ? 'dark' : 'light'}`}>
        {isDark ? '🌙' : '☀'}
      </div>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </div>
  )
}
