import { apiClient } from './client'

/**
 * POST /api/auth/rejestracja-krok1
 */
export async function rejestracjaKrok1(userData) {
  const { data } = await apiClient.post('/auth/rejestracja-krok1', userData)
  return data
}

/**
 * PUT /api/auth/uzupelnij-profil
 */
export async function uzupelnijProfil(userData) {
  const { data } = await apiClient.put('/auth/uzupelnij-profil', userData)
  return data
}

/**
 * POST /api/auth/logowanie
 */
export async function logowanie(email, haslo) {
  const { data } = await apiClient.post('/auth/logowanie', { email, haslo })
  return data
}

/**
 * POST /api/auth/wylogowanie
 */
export async function wylogowanie() {
  const { data } = await apiClient.post('/auth/wylogowanie')
  return data
}

/**
 * GET /api/auth/profil
 */
export async function getProfil() {
  const { data } = await apiClient.get('/auth/profil')
  return data
}
