import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { logowanie as apiLogowanie, rejestracjaKrok1 as apiRejestracjaKrok1, uzupelnijProfil as apiUzupelnijProfil, wylogowanie as apiWylogowanie, getProfil } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Persist to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = useCallback(async (email, haslo) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiLogowanie(email, haslo)
      setToken(res.token)
      setUser(res.user)
      return res
    } catch (err) {
      const msg = err.response?.data?.error || 'Błąd logowania'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const registerKrok1 = useCallback(async (dane) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiRejestracjaKrok1(dane)
      setToken(res.token)
      setUser(res.user)
      return res
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || err.message || 'Błąd rejestracji'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitProfil = useCallback(async (dane) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiUzupelnijProfil(dane)
      await refreshProfil()
      return res
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Błąd aktualizacji profilu'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [refreshProfil])

  const logout = useCallback(async () => {
    try { await apiWylogowanie() } catch {}
    setToken(null)
    setUser(null)
  }, [])

  const refreshProfil = useCallback(async () => {
    if (!token) return
    try {
      const profil = await getProfil()
      setUser((prev) => ({ ...prev, ...profil }))
    } catch {}
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, logout, registerKrok1, submitProfil, refreshProfil, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
