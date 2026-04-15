import express from 'express'
import { body, validationResult } from 'express-validator'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// ----------------------------------------------------------------
// GET /api/opinie/:fachowiec_id
// ----------------------------------------------------------------
router.get('/:fachowiec_id', async (req, res) => {
  try {
    const { fachowiec_id } = req.params

    const { data, error } = await supabase
      .from('opinie')
      .select('id, autor_imie, ocena, tresc, created_at')
      .eq('fachowiec_id', fachowiec_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('GET /opinie/:fachowiec_id error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// POST /api/opinie  (chroniony JWT)
// ----------------------------------------------------------------
router.post(
  '/',
  authMiddleware,
  [
    body('fachowiec_id').notEmpty().withMessage('ID fachowca jest wymagane'),
    body('ocena').isInt({ min: 1, max: 5 }).withMessage('Ocena musi być liczbą od 1 do 5'),
    body('tresc').isLength({ min: 20 }).withMessage('Treść opinii musi mieć co najmniej 20 znaków'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { fachowiec_id, ocena, tresc } = req.body
      const autor_imie = `${req.user.imie || ''} ${req.user.nazwisko?.[0] || ''}.`.trim()

      const { data, error } = await supabase
        .from('opinie')
        .insert([{
          fachowiec_id,
          user_id: req.user.id,
          autor_imie,
          ocena: parseInt(ocena, 10),
          tresc,
        }])
        .select()
        .single()

      if (error) {
        // Unique constraint violation — duplicate opinion
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Już dodałeś opinię dla tego fachowca' })
        }
        throw error
      }

      res.status(201).json(data)
    } catch (err) {
      console.error('POST /opinie error:', err)
      res.status(500).json({ error: 'Błąd serwera', details: err.message })
    }
  }
)

// ----------------------------------------------------------------
// DELETE /api/opinie/:id  (chroniony JWT, tylko autor)
// ----------------------------------------------------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('opinie')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) return res.status(404).json({ error: 'Opinia nie znaleziona' })
    if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Brak uprawnień' })

    const { error } = await supabase.from('opinie').delete().eq('id', id)
    if (error) throw error

    res.json({ message: 'Opinia usunięta' })
  } catch (err) {
    console.error('DELETE /opinie/:id error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

export default router
