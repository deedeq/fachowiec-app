import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { saved } = useSaved()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/szukaj?q=${encodeURIComponent(query)}`)
  }

  // Base classes for nav links with active underline indicator
  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-200 px-1 py-2 ` +
    (isActive
      ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
      : 'text-gray-600 hover:text-primary')

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
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/szukaj" className={navLinkClass}>
            🔍 Szukaj
          </NavLink>

          <NavLink to="/zapisani" className={navLinkClass}>
            <span className="flex items-center gap-1.5">
              ❤️ Zapisani
              {saved.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-rose-500 text-white rounded-full leading-none">
                  {saved.length}
                </span>
              )}
            </span>
          </NavLink>

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
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-56' : 'max-h-0'}`}>
        <div className="px-4 py-3 flex flex-col gap-3 bg-white border-t border-gray-100">
          <NavLink
            to="/szukaj"
            className={({ isActive }) =>
              `btn-outline text-sm text-center ${isActive ? 'bg-primary text-white' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            🔍 Szukaj fachowca
          </NavLink>
          <NavLink
            to="/zapisani"
            className={({ isActive }) =>
              `btn-outline text-sm text-center flex items-center justify-center gap-2 ${isActive ? 'bg-primary text-white' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            ❤️ Zapisani
            {saved.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-rose-500 text-white rounded-full">
                {saved.length}
              </span>
            )}
          </NavLink>
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
