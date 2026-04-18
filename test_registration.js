import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testRegistration() {
  console.log('--- Testing Registration ---');
  try {
    const res = await axios.post(`${API_URL}/auth/rejestracja`, {
      imie: 'Tester',
      nazwisko: 'Automatyczny',
      email: 'jan_testowy_' + Date.now() + '@gmail.com',
      haslo: 'Password123!',
      telefon: '123456789',
      kategoria: 'Elektryk',
      miasto: 'Poznań',
      wojewodztwo: 'Wielkopolskie',
      opis: 'Testowy opis o długości co najmniej pięćdziesięciu znaków, aby przejść walidację jeśli taka istnieje na poziomie API.',
      typPrac: 'oba',
      doswiadczenie: '3–5 lat'
    });
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error('Error Status:', err.response.status);
      console.error('Error Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Error Message:', err.message);
    }
    process.exit(1);
  }
}

testRegistration();
