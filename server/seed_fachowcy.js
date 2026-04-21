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

const DUMMY_FACHOWCY = [
  { imie: 'Jan', nazwisko: 'Kowalski', email: 'jan.kowalski@test.pl', specjalizacja: 'Hydraulik', miasto: 'Warszawa', wojewodztwo: 'Mazowieckie', cena_od: 100, typ: 'wnetrze', opis: 'Doświadczony hydraulik. Szybko i solidnie.', doswiadczenie_lat: 10, uslugi: ['Naprawa kranów', 'Biały montaż', 'Udrażnianie rur'] },
  { imie: 'Piotr', nazwisko: 'Nowak', email: 'piotr.nowak@test.pl', specjalizacja: 'Elektryk', miasto: 'Kraków', wojewodztwo: 'Małopolskie', cena_od: 120, typ: 'oba', opis: 'Uprawnienia SEP do 1kV. Nowe instalacje i naprawy.', doswiadczenie_lat: 8, uslugi: ['Wymiana gniazdek', 'Rozdzielnice', 'Pomiary'] },
  { imie: 'Marek', nazwisko: 'Wiśniewski', email: 'marek.wisniewski@test.pl', specjalizacja: 'Malarz', miasto: 'Poznań', wojewodztwo: 'Wielkopolskie', cena_od: 80, typ: 'wnetrze', opis: 'Malowanie, szpachlowanie, tapetowanie. Czysto.', doswiadczenie_lat: 5, uslugi: ['Malowanie ścian', 'Szpachlowanie', 'Tapetowanie'] },
  { imie: 'Krzysztof', nazwisko: 'Wójcik', email: 'krzysztof.wojcik@test.pl', specjalizacja: 'Glazurnik', miasto: 'Gdańsk', wojewodztwo: 'Pomorskie', cena_od: 150, typ: 'wnetrze', opis: 'Profesjonalne układanie płytek, gresu, terakoty.', doswiadczenie_lat: 12, uslugi: ['Układanie płytek', 'Fugowanie', 'Biały montaż'] },
  { imie: 'Andrzej', nazwisko: 'Kowalczyk', email: 'andrzej.kowalczyk@test.pl', specjalizacja: 'Stolarz', miasto: 'Wrocław', wojewodztwo: 'Dolnośląskie', cena_od: 180, typ: 'wnetrze', opis: 'Meble na wymiar, kuchnie, szafy przesuwne.', doswiadczenie_lat: 15, uslugi: ['Meble kuchenne', 'Szafy wnękowe', 'Schody'] },
  { imie: 'Tomasz', nazwisko: 'Kamiński', email: 'tomasz.kaminski@test.pl', specjalizacja: 'Murarz', miasto: 'Łódź', wojewodztwo: 'Łódzkie', cena_od: 90, typ: 'zewnetrze', opis: 'Murowanie, tynkowanie, prace ogólnobudowlane.', doswiadczenie_lat: 20, uslugi: ['Murowanie', 'Tynkowanie', 'Wylewki'] },
  { imie: 'Paweł', nazwisko: 'Lewandowski', email: 'pawel.lewandowski@test.pl', specjalizacja: 'Dekarz', miasto: 'Szczecin', wojewodztwo: 'Zachodniopomorskie', cena_od: 200, typ: 'zewnetrze', opis: 'Krycie dachów, naprawy dachów, rynny.', doswiadczenie_lat: 18, uslugi: ['Krycie dachów', 'Naprawa dachu', 'Montaż rynien'] },
  { imie: 'Michał', nazwisko: 'Zieliński', email: 'michal.zielinski@test.pl', specjalizacja: 'Ogrzewanie', miasto: 'Bydgoszcz', wojewodztwo: 'Kujawsko-pomorskie', cena_od: 140, typ: 'wnetrze', opis: 'Instalacje CO, piece, pompy ciepła.', doswiadczenie_lat: 9, uslugi: ['Montaż CO', 'Wymiana pieca', 'Ogrzewanie podłogowe'] },
  { imie: 'Artur', nazwisko: 'Szymański', email: 'artur.szymanski@test.pl', specjalizacja: 'Klimatyzacja', miasto: 'Lublin', wojewodztwo: 'Lubelskie', cena_od: 160, typ: 'oba', opis: 'Montaż i serwis klimatyzacji.', doswiadczenie_lat: 6, uslugi: ['Montaż klimatyzacji', 'Serwis klimatyzacji', 'Odgrzybianie'] },
  { imie: 'Marcin', nazwisko: 'Woźniak', email: 'marcin.wozniak@test.pl', specjalizacja: 'Elewacje', miasto: 'Białystok', wojewodztwo: 'Podlaskie', cena_od: 110, typ: 'zewnetrze', opis: 'Docieplenia, tynki zewnętrzne, malowanie elewacji.', doswiadczenie_lat: 11, uslugi: ['Ocieplenia', 'Tynkowanie', 'Malowanie elewacji'] },
  { imie: 'Dariusz', nazwisko: 'Dąbrowski', email: 'dariusz.dabrowski@test.pl', specjalizacja: 'Brukarnia', miasto: 'Katowice', wojewodztwo: 'Śląskie', cena_od: 100, typ: 'zewnetrze', opis: 'Układanie kostki brukowej, podjazdy.', doswiadczenie_lat: 14, uslugi: ['Układanie kostki', 'Podjazdy', 'Odwodnienia'] },
  { imie: 'Robert', nazwisko: 'Kozłowski', email: 'robert.kozlowski@test.pl', specjalizacja: 'Okna i Drzwi', miasto: 'Gdynia', wojewodztwo: 'Pomorskie', cena_od: 130, typ: 'oba', opis: 'Montaż okien i drzwi, wymiana.', doswiadczenie_lat: 7, uslugi: ['Montaż okien', 'Montaż drzwi', 'Regulacja okien'] },
  { imie: 'Kamil', nazwisko: 'Jankowski', email: 'kamil.jankowski@test.pl', specjalizacja: 'Tynkarz', miasto: 'Częstochowa', wojewodztwo: 'Śląskie', cena_od: 95, typ: 'wnetrze', opis: 'Tynki maszynowe i tradycyjne.', doswiadczenie_lat: 5, uslugi: ['Tynki maszynowe', 'Tynki gipsowe', 'Tynki cementowe'] },
  { imie: 'Łukasz', nazwisko: 'Mazur', email: 'lukasz.mazur@test.pl', specjalizacja: 'Ogrody', miasto: 'Radom', wojewodztwo: 'Mazowieckie', cena_od: 85, typ: 'zewnetrze', opis: 'Zakładanie i pielęgnacja ogrodów.', doswiadczenie_lat: 4, uslugi: ['Zakładanie trawników', 'Przycinanie drzew', 'Systemy nawadniania'] },
  { imie: 'Grzegorz', nazwisko: 'Krawczyk', email: 'grzegorz.krawczyk@test.pl', specjalizacja: 'Hydraulik', miasto: 'Toruń', wojewodztwo: 'Kujawsko-pomorskie', cena_od: 115, typ: 'wnetrze', opis: 'Awarie hydrauliczne, biały montaż, szybki dojazd.', doswiadczenie_lat: 16, uslugi: ['Usuwanie awarii', 'Podłączanie pralek', 'Montaż prysznica'] }
];

async function seedFachowcy() {
  console.log('--- Starting Seeding Fachowcy ---')
  for (const f of DUMMY_FACHOWCY) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: f.email,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { imie: f.imie, nazwisko: f.nazwisko }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`User ${f.email} already exists, skipping.`)
      } else {
        console.error(`Error creating user ${f.email}:`, authError.message)
      }
      continue
    }

    const userId = authData.user.id
    console.log(`Created auth user ${f.email} with ID ${userId}`)

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      user_id: userId,
      imie: f.imie,
      nazwisko: f.nazwisko,
      email: f.email,
      telefon: '123456789',
      specjalizacja: f.specjalizacja,
      miasto: f.miasto,
      wojewodztwo: f.wojewodztwo,
      cena_od: f.cena_od,
      typ: f.typ,
      opis: f.opis,
      doswiadczenie_lat: f.doswiadczenie_lat,
      uslugi: f.uslugi,
      role: 'fachowiec',
      status: 'approved',
      zweryfikowany: Math.random() > 0.5 // Random verification status for test data
    }])

    if (profileError) {
      console.error(`Error creating profile for ${f.email}:`, profileError.message)
    } else {
      console.log(`Profile created for ${f.email}`)
    }
  }
  console.log('--- Seeding Completed ---')
}

seedFachowcy()
