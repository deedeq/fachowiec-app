import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndPromote() {
  console.log('--- Checking Profiles ---');
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log('Recent profiles:');
  profiles.forEach(p => console.log(`- ${p.imie} ${p.nazwisko} (${p.email}) Status: ${p.status} Role: ${p.role}`));

  const latestUser = profiles[0];
  if (latestUser) {
    console.log(`\nPromoting ${latestUser.email} to admin...`);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', latestUser.id);

    if (updateError) {
      console.error('Error promoting user:', updateError);
    } else {
      console.log('Successfully promoted to admin!');
    }
  }
}

checkAndPromote();
