import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/szukaj?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🛠️</span>
          <span className="font-extrabold text-xl tracking-tight">
            <span className="text-primary">Fachowiec</span>
            <span className="text-accent">.app</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            to="/szukaj"
            className="btn-outline text-sm py-2 px-4"
          >
            🔍 Szukaj fachowca
          </Link>
          <Link
            to="/rejestracja"
            className="btn-accent text-sm py-2 px-4"
          >
            🛠️ Dołącz jako fachowiec
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-48' : 'max-h-0'}`}>
        <div className="px-4 py-3 flex flex-col gap-3 bg-white border-t border-gray-100">
          <Link
            to="/szukaj"
            className="btn-outline text-sm text-center"
            onClick={() => setMenuOpen(false)}
          >
            🔍 Szukaj fachowca
          </Link>
          <Link
            to="/rejestracja"
            className="btn-accent text-sm text-center"
            onClick={() => setMenuOpen(false)}
          >
            🛠️ Dołącz jako fachowiec
          </Link>
        </div>
      </div>
    </header>
  )
}
