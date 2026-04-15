-- 1. Add new columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- 2. Set all existing profiles to 'approved' to avoid hiding them, and 'user' role
UPDATE profiles SET status = 'approved', role = 'user' WHERE status = 'pending' OR status IS NULL;

-- 3. Drop old RLS policies for profiles update and delete
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

-- 4. Create new RLS policies that include admins
CREATE POLICY "profiles_update_own_or_admin"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );

CREATE POLICY "profiles_delete_own_or_admin"
  ON profiles FOR DELETE
  USING (
    auth.uid() = user_id 
    OR (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- =========================================================
-- !!! WAŻNE !!!
-- Aby dać sobie uprawnienia administratora wklej swój email poniżej:
-- i odkomentuj (usuń -- z początku dwóch poniższych linijek)
-- =========================================================
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'TWOJ_EMAIL_UTWORZONY_W_REJESTRACJI@domena.pl';
