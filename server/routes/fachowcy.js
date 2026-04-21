import express from 'express'
import { body, query, validationResult } from 'express-validator'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// ----------------------------------------------------------------
// GET /api/fachowcy
// Query params: wojewodztwo, specjalizacja, typ, cena_max,
//   tylko_zweryfikowani, sortuj (ocena|cena|opinie),
//   szukaj, strona, limit
// ----------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const {
      wojewodztwo,
      specjalizacja,
      typ,
      cena_max,
      tylko_zweryfikowani,
      sortuj = 'ocena',
      szukaj,
      strona = 1,
      limit: limitParam = 12,
    } = req.query

    const limit = Math.min(parseInt(limitParam, 10) || 12, 50)
    const offset = (Math.max(parseInt(strona, 10) || 1, 1) - 1) * limit

    let q = supabase
      .from('fachowcy_z_ocena')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .eq('role', 'fachowiec')

    if (wojewodztwo) q = q.ilike('wojewodztwo', wojewodztwo)
    if (specjalizacja) q = q.ilike('specjalizacja', specjalizacja)
    if (typ) q = q.eq('typ', typ)
    if (cena_max) q = q.lte('cena_od', parseInt(cena_max, 10))
    if (tylko_zweryfikowani === 'true') q = q.eq('zweryfikowany', true)

    if (szukaj) {
      q = q.or(
        `imie.ilike.%${szukaj}%,nazwisko.ilike.%${szukaj}%,specjalizacja.ilike.%${szukaj}%,miasto.ilike.%${szukaj}%`
      )
    }

    // Sorting
    if (sortuj === 'cena') {
      q = q.order('cena_od', { ascending: true })
    } else if (sortuj === 'opinie') {
      q = q.order('liczba_opinii', { ascending: false })
    } else {
      q = q.order('srednia_ocena', { ascending: false })
    }

    q = q.range(offset, offset + limit - 1)

    const { data, error, count } = await q

    if (error) throw error

    res.json({
      fachowcy: data,
      paginacja: {
        strona: parseInt(strona, 10),
        limit,
        lacznie: count,
        stron: Math.ceil(count / limit),
      },
    })
  } catch (err) {
    console.error('GET /fachowcy error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// GET /api/fachowcy/kategorie
// ----------------------------------------------------------------
router.get('/kategorie', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('specjalizacja')

    if (error) throw error

    const counts = {}
    for (const row of data) {
      counts[row.specjalizacja] = (counts[row.specjalizacja] || 0) + 1
    }

    const kategorie = Object.entries(counts)
      .map(([nazwa, liczba]) => ({ nazwa, liczba }))
      .sort((a, b) => b.liczba - a.liczba)

    res.json(kategorie)
  } catch (err) {
    console.error('GET /fachowcy/kategorie error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// GET /api/fachowcy/:id
// ----------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: profil, error: profileError } = await supabase
      .from('fachowcy_z_ocena')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError) throw profileError
    if (!profil) return res.status(404).json({ error: 'Fachowiec nie znaleziony' })

    const { data: opinie, error: opinieError } = await supabase
      .from('opinie')
      .select('id, autor_imie, ocena, tresc, created_at')
      .eq('fachowiec_id', id)
      .order('created_at', { ascending: false })

    if (opinieError) throw opinieError

    res.json({ ...profil, opinie: opinie || [] })
  } catch (err) {
    console.error('GET /fachowcy/:id error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// POST /api/fachowcy  (chroniony JWT)
// ----------------------------------------------------------------
router.post(
  '/',
  authMiddleware,
  [
    body('imie').notEmpty().withMessage('Imię jest wymagane'),
    body('nazwisko').notEmpty().withMessage('Nazwisko jest wymagane'),
    body('specjalizacja').notEmpty().withMessage('Specjalizacja jest wymagana'),
    body('miasto').notEmpty().withMessage('Miasto jest wymagane'),
    body('wojewodztwo').notEmpty().withMessage('Województwo jest wymagane'),
    body('cena_od').isInt({ min: 0 }).withMessage('Cena od musi być liczbą dodatnią'),
    body('typ').isIn(['wnetrze', 'zewnetrze', 'oba']).withMessage('Nieprawidłowy typ'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { imie, nazwisko, specjalizacja, miasto, wojewodztwo, opis, cena_od, typ, telefon, email, doswiadczenie_lat, uslugi } = req.body

      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          user_id: req.user.id,
          imie, nazwisko, specjalizacja, miasto, wojewodztwo,
          opis, cena_od, typ, telefon, email, doswiadczenie_lat,
          uslugi: uslugi || [],
        }])
        .select()
        .single()

      if (error) throw error

      res.status(201).json(data)
    } catch (err) {
      console.error('POST /fachowcy error:', err)
      res.status(500).json({ error: 'Błąd serwera', details: err.message })
    }
  }
)

// ----------------------------------------------------------------
// PUT /api/fachowcy/:id  (chroniony JWT, tylko właściciel)
// ----------------------------------------------------------------
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) return res.status(404).json({ error: 'Profil nie znaleziony' })
    if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Brak uprawnień' })

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('PUT /fachowcy/:id error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

export default router
