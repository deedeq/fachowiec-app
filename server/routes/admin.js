import express from 'express'
import { supabase } from '../supabase/client.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Użyj middleware dla całego routera
router.use(adminMiddleware)

// ----------------------------------------------------------------
// GET /api/admin/fachowcy?status=
// Pobierz wszystkich, domyślnie oczekujących
// ----------------------------------------------------------------
router.get('/fachowcy', async (req, res) => {
  try {
    const { status } = req.query
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('GET /api/admin/fachowcy error:', err)
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

// ----------------------------------------------------------------
// POST /api/admin/fachowcy/:id/status
// Zatwierdź lub odrzuć
// ----------------------------------------------------------------
router.post(
  '/fachowcy/:id/status',
  [body('status').isIn(['pending', 'approved', 'rejected'])],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { id } = req.params
      const { status } = req.body

      const { data, error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      res.json(data)
    } catch (err) {
      console.error('POST /api/admin/fachowcy/:id/status error:', err)
      res.status(500).json({ error: 'Błąd serwera' })
    }
  }
)

// ----------------------------------------------------------------
// PUT /api/admin/fachowcy/:id
// Zmien całe dane fachowca (edycja profilu przez admina)
// ----------------------------------------------------------------
router.put('/fachowcy/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error('PUT /api/admin/fachowcy/:id error:', err)
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

// ----------------------------------------------------------------
// DELETE /api/admin/fachowcy/:id
// Usuwanie profilu fachowca (i powiązanych rekordów z racji CASCADE w bazie)
// ----------------------------------------------------------------
router.delete('/fachowcy/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/fachowcy/:id error:', err)
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

export default router
