-- This script updates the database schema to support admin, fachowiec, and klient roles.
-- Run this in the Supabase SQL Editor.

-- 1. Drop constraints and make fields nullable for non-fachowiec users
ALTER TABLE profiles ALTER COLUMN specjalizacja DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN wojewodztwo DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN miasto DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN typ DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN opis DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN uslugi DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN doswiadczenie_lat DROP NOT NULL;

-- 2. Update role constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'fachowiec', 'klient'));

-- 3. Update existing user roles if necessary
UPDATE profiles SET role = 'fachowiec' WHERE role = 'user';

-- 4. Recreate the admin user if needed (ensure the user is created in Auth first)
-- You can set your admin manually:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@fachowiec.app';
