import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// ----------------------------------------------------------------
// POST /api/auth/rejestracja-krok1
// ----------------------------------------------------------------
router.post(
  '/rejestracja-krok1',
  [
    body('email').isEmail().withMessage('Nieprawidłowy email'),
    body('haslo').isLength({ min: 6 }).withMessage('Hasło musi mieć co najmniej 6 znaków'),
    body('imie').notEmpty().withMessage('Imię jest wymagane'),
    body('nazwisko').notEmpty().withMessage('Nazwisko jest wymagane'),
    body('isFachowiec').isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, haslo, imie, nazwisko, telefon, isFachowiec } = req.body

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: haslo,
        options: { data: { imie, nazwisko } },
      })

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      const user = data.user
      const role = isFachowiec ? 'fachowiec' : 'klient'
      const status = isFachowiec ? 'pending' : 'approved'
      
      const { error: profileError } = await supabase.from('profiles').insert([{
        user_id: user.id,
        imie,
        nazwisko,
        email,
        telefon: telefon || '',
        status,
        role
      }])
      
      if (profileError) {
          console.error("Profile insert error:", profileError)
          return res.status(500).json({ error: 'Błąd podczas tworzenia profilu. Skontaktuj się z administratorem.' })
      }

      const token = signToken({ id: user.id, email: user.email, imie, nazwisko, role })

      res.status(201).json({ token, user: { id: user.id, email: user.email, imie, nazwisko, role } })
    } catch (err) {
      console.error('POST /auth/rejestracja-krok1 error:', err)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }
)

// ----------------------------------------------------------------
// PUT /api/auth/uzupelnij-profil
// ----------------------------------------------------------------
router.put(
  '/uzupelnij-profil',
  authMiddleware,
  async (req, res) => {
    const { kategoria, dodatkowe, wojewodztwo, miasto, typPrac, opis, doswiadczenie } = req.body
    
    try {
      let doswLat = parseInt(doswiadczenie)
      if (isNaN(doswLat)) doswLat = 0
      
      const { data, error } = await supabase.from('profiles').update({
        specjalizacja: kategoria,
        uslugi: dodatkowe || [],
        wojewodztwo,
        miasto,
        typ: typPrac,
        opis,
        doswiadczenie_lat: doswLat,
        status: 'pending' // ponowna weryfikacja
      })
      .eq('user_id', req.user.id)
      .select()
      .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      res.json(data)
    } catch (err) {
      console.error('PUT /auth/uzupelnij-profil error:', err)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }
)

// ----------------------------------------------------------------
// POST /api/auth/logowanie
// ----------------------------------------------------------------
router.post(
  '/logowanie',
  [
    body('email').isEmail().withMessage('Nieprawidłowy email'),
    body('haslo').notEmpty().withMessage('Hasło jest wymagane'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, haslo } = req.body

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: haslo })

      if (error) {
        return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' })
      }

      // Fetch profile to get Role
      const { data: profilData } = await supabase.from('profiles').select('role').eq('user_id', data.user.id).single()
      const rola = profilData ? profilData.role : 'user'

      const user = data.user
      const meta = user.user_metadata || {}
      const token = signToken({
        id: user.id,
        email: user.email,
        imie: meta.imie || '',
        nazwisko: meta.nazwisko || '',
        role: rola
      })

      res.json({
        token,
        user: { id: user.id, email: user.email, imie: meta.imie, nazwisko: meta.nazwisko, role: rola },
      })
    } catch (err) {
      console.error('POST /auth/logowanie error:', err)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }
)

// ----------------------------------------------------------------
// GET /api/auth/profil  (chroniony JWT)
// ----------------------------------------------------------------
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const { id, email, imie, nazwisko, role } = req.user

    // Fetch profile if fachowiec
    const { data: profil } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .maybeSingle()

    const currentRole = profil ? profil.role : (role || 'user')

    res.json({ id, email, imie, nazwisko, role: currentRole, profil: profil || null })
  } catch (err) {
    console.error('GET /auth/profil error:', err)
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

// ----------------------------------------------------------------
// POST /api/auth/wylogowanie
// ----------------------------------------------------------------
router.post('/wylogowanie', authMiddleware, async (req, res) => {
  try {
    await supabase.auth.signOut()
    res.json({ message: 'Wylogowano pomyślnie' })
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

export default router
