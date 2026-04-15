import { apiClient } from './client'

/**
 * GET /api/fachowcy
 * @param {Object} filtry - { wojewodztwo, specjalizacja, typ, cena_max,
 *   tylko_zweryfikowani, sortuj, szukaj, strona, limit }
 */
export async function getFachowcy(filtry = {}) {
  const params = {}
  if (filtry.wojewodztwo)        params.wojewodztwo = filtry.wojewodztwo
  if (filtry.specjalizacja)      params.specjalizacja = filtry.specjalizacja
  if (filtry.typ)                params.typ = filtry.typ
  if (filtry.cena_max)           params.cena_max = filtry.cena_max
  if (filtry.tylkoZweryfikowani) params.tylko_zweryfikowani = 'true'
  if (filtry.sortuj)             params.sortuj = filtry.sortuj
  if (filtry.szukaj)             params.szukaj = filtry.szukaj
  if (filtry.strona)             params.strona = filtry.strona
  if (filtry.limit)              params.limit = filtry.limit

  const { data } = await apiClient.get('/fachowcy', { params })
  return data
}

/**
 * GET /api/fachowcy/:id
 */
export async function getFachowiec(id) {
  const { data } = await apiClient.get(`/fachowcy/${id}`)
  return data
}

/**
 * GET /api/fachowcy/kategorie
 */
export async function getKategorie() {
  const { data } = await apiClient.get('/fachowcy/kategorie')
  return data
}

/**
 * POST /api/fachowcy
 */
export async function createFachowiec(dane) {
  const { data } = await apiClient.post('/fachowcy', dane)
  return data
}

/**
 * PUT /api/fachowcy/:id
 */
export async function updateFachowiec(id, dane) {
  const { data } = await apiClient.put(`/fachowcy/${id}`, dane)
  return data
}
