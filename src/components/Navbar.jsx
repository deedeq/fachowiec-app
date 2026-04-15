import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { saved } = useSaved()
  const { isLoggedIn, user, logout } = useAuth()
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-200 px-1 py-2 ` +
    (isActive
      ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
      : 'text-gray-600 hover:text-primary')

  const initials = user
    ? `${user.imie?.[0] || ''}${user.nazwisko?.[0] || ''}`.toUpperCase() || '?'
    : '?'

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/')
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

          {isLoggedIn ? (
            /* Auth: avatar + dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 group"
                aria-label="Menu użytkownika"
              >
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
                  {user?.imie || 'Konto'}
                </span>
                <span className={`text-gray-400 text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-toast">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400 font-medium">Zalogowany jako</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span> Mój profil
                    </Link>
                    <Link
                      to="/zapisani"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>❤️</span> Zapisani
                      {saved.length > 0 && (
                        <span className="ml-auto text-xs font-bold text-rose-500">{saved.length}</span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span> Wyloguj się
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest: login + register */
            <div className="flex items-center gap-2">
              <Link to="/logowanie" className="btn-outline text-sm py-2 px-4">
                Zaloguj
              </Link>
              <Link to="/rejestracja" className="btn-accent text-sm py-2 px-4">
                🛠️ Dołącz
              </Link>
            </div>
          )}
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
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-72' : 'max-h-0'}`}>
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
          {isLoggedIn ? (
            <>
              <Link
                to="/profil"
                className="btn-outline text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                👤 Mój profil
              </Link>
              <button
                className="btn-outline text-sm text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => { setMenuOpen(false); handleLogout() }}
              >
                🚪 Wyloguj się
              </button>
            </>
          ) : (
            <>
              <Link to="/logowanie" className="btn-outline text-sm text-center" onClick={() => setMenuOpen(false)}>
                Zaloguj się
              </Link>
              <Link to="/rejestracja" className="btn-accent text-sm text-center" onClick={() => setMenuOpen(false)}>
                🛠️ Dołącz jako fachowiec
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
