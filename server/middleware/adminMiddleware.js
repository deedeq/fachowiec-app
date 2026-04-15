import { supabase } from '../supabase/client.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokenu lub nieprawidłowy format' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    // Sprawdź czy rola w bazie to admin
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', req.user.id)
      .single()

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Brak uprawnień administratora' })
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token wygasł' })
    }
    return res.status(401).json({ error: 'Nieprawidłowy token' })
  }
}
