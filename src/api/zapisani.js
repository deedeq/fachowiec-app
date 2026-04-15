import { apiClient } from './client'

/**
 * GET /api/zapisani
 */
export async function getZapisani() {
  const { data } = await apiClient.get('/zapisani')
  return data
}

/**
 * POST /api/zapisani
 */
export async function dodajZapisanego(fachowiec_id) {
  const { data } = await apiClient.post('/zapisani', { fachowiec_id })
  return data
}

/**
 * DELETE /api/zapisani/:fachowiec_id
 */
export async function usunZapisanego(fachowiec_id) {
  const { data } = await apiClient.delete(`/zapisani/${fachowiec_id}`)
  return data
}
