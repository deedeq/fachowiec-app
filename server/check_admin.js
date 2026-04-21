import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkAndFix() {
  // Check admin
  const { data: adminUser } = await supabase.from('profiles').select('*').eq('email', 'admin@fachowiec.app').single()
  console.log('Admin user:', adminUser)
  if (adminUser && adminUser.role !== 'admin') {
    await supabase.from('profiles').update({ role: 'admin' }).eq('email', 'admin@fachowiec.app')
    console.log('Set admin role for admin@fachowiec.app')
  }

  // Check Adam
  const { data: adam } = await supabase.from('profiles').select('*').eq('email', 'adam.testowy@fachowiec.app').single()
  console.log('Adam profile:', adam)
  if (adam && adam.status === 'pending') {
    await supabase.from('profiles').update({ status: 'approved' }).eq('email', 'adam.testowy@fachowiec.app')
    console.log('Approved Adam Testowy')
  }
}

checkAndFix()
