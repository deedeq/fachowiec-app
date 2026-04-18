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

async function resetDb() {
  console.log('Fetching all users...')
  const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers()
  if (fetchError) {
    console.error('Error fetching users:', fetchError)
    return
  }

  console.log(`Found ${users.length} users. Deleting them...`)
  for (const user of users) {
    const { error: delError } = await supabase.auth.admin.deleteUser(user.id)
    if (delError) {
      console.error(`Error deleting user ${user.id}:`, delError)
    } else {
      console.log(`Deleted user ${user.id}`)
    }
  }

  // Also delete all profiles just in case cascade didn't work
  const { error: delProfError } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('Profiles deleted:', delProfError ? delProfError : 'success')

  console.log('Creating admin user...')
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@fachowiec.app',
    password: 'admin',
    email_confirm: true,
    user_metadata: { imie: 'Admin', nazwisko: 'Systemu' }
  })

  if (adminError) {
    console.error('Error creating admin user:', adminError)
    return
  }

  const adminUser = adminData.user
  console.log('Admin user created with ID:', adminUser.id)

  // Insert profile for admin
  const { error: profileError } = await supabase.from('profiles').insert([{
    user_id: adminUser.id,
    imie: 'Admin',
    nazwisko: 'Systemu',
    email: 'admin@fachowiec.app',
    role: 'admin',
    status: 'approved'
  }])

  if (profileError) {
    console.error('Error creating admin profile:', profileError)
  } else {
    console.log('Admin profile created.')
  }
}

resetDb()
