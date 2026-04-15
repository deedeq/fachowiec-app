import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Logowanie() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [haslo, setHaslo] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, haslo)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🛠️</span>
            <span className="font-extrabold text-3xl tracking-tight">
              <span className="text-primary">Fachowiec</span>
              <span className="text-accent">.app</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-3">Zaloguj się do swojego konta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Logowanie</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="label">Adres email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan@example.com"
                className="input-field"
                required
                autoComplete="email"
              />
            </div>

            {/* Hasło */}
            <div>
              <label htmlFor="login-haslo" className="label">Hasło</label>
              <div className="relative">
                <input
                  id="login-haslo"
                  type={showPassword ? 'text' : 'password'}
                  value={haslo}
                  onChange={(e) => setHaslo(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : '🔑'}
              {isLoading ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Nie masz konta?{' '}
            <Link to="/rejestracja" className="text-primary font-semibold hover:underline">
              Zarejestruj się
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
