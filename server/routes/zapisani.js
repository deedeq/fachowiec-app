import express from 'express'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// ----------------------------------------------------------------
// GET /api/zapisani  (chroniony JWT)
// ----------------------------------------------------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('zapisani')
      .select('fachowiec_id, created_at, profiles:fachowiec_id(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('GET /zapisani error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// POST /api/zapisani  (chroniony JWT)
// ----------------------------------------------------------------
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fachowiec_id } = req.body

    if (!fachowiec_id) {
      return res.status(400).json({ error: 'fachowiec_id jest wymagane' })
    }

    const { data, error } = await supabase
      .from('zapisani')
      .insert([{ user_id: req.user.id, fachowiec_id }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Fachowiec już jest na liście zapisanych' })
      }
      throw error
    }

    res.status(201).json(data)
  } catch (err) {
    console.error('POST /zapisani error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

// ----------------------------------------------------------------
// DELETE /api/zapisani/:fachowiec_id  (chroniony JWT)
// ----------------------------------------------------------------
router.delete('/:fachowiec_id', authMiddleware, async (req, res) => {
  try {
    const { fachowiec_id } = req.params

    const { error } = await supabase
      .from('zapisani')
      .delete()
      .eq('user_id', req.user.id)
      .eq('fachowiec_id', fachowiec_id)

    if (error) throw error

    res.json({ message: 'Usunięto z zapisanych' })
  } catch (err) {
    console.error('DELETE /zapisani/:fachowiec_id error:', err)
    res.status(500).json({ error: 'Błąd serwera', details: err.message })
  }
})

export default router
