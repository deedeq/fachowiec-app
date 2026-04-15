import { useState } from 'react'
import Stepper from '../components/Stepper'
import { kategorie, wojewodztwa } from '../data/fachowcy'
import { useAuth } from '../context/AuthContext'

const STEPS = ['Dane osobowe', 'Lokalizacja i usługi', 'Profil']

// ─── Step 1 ───────────────────────────────────────────
function Krok1({ data, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="imie">Imię *</label>
          <input id="imie" className={`input-field ${errors.imie ? 'border-red-400' : ''}`}
            value={data.imie} onChange={e => onChange('imie', e.target.value)} placeholder="np. Jan" />
          {errors.imie && <p className="text-red-500 text-xs mt-1">{errors.imie}</p>}
        </div>
        <div>
          <label className="label" htmlFor="nazwisko">Nazwisko *</label>
          <input id="nazwisko" className={`input-field ${errors.nazwisko ? 'border-red-400' : ''}`}
            value={data.nazwisko} onChange={e => onChange('nazwisko', e.target.value)} placeholder="np. Kowalski" />
          {errors.nazwisko && <p className="text-red-500 text-xs mt-1">{errors.nazwisko}</p>}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="telefon">Telefon *</label>
        <input id="telefon" type="tel" className={`input-field ${errors.telefon ? 'border-red-400' : ''}`}
          value={data.telefon} onChange={e => onChange('telefon', e.target.value)} placeholder="np. 500 123 456" />
        {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
      </div>
      <div>
        <label className="label" htmlFor="email">Adres e-mail *</label>
        <input id="email" type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
          value={data.email} onChange={e => onChange('email', e.target.value)} placeholder="np. jan@kowalski.pl" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="haslo">Hasło *</label>
        <input id="haslo" type="password" className={`input-field ${errors.haslo ? 'border-red-400' : ''}`}
          value={data.haslo} onChange={e => onChange('haslo', e.target.value)} placeholder="Min. 8 znaków" />
        {errors.haslo && <p className="text-red-500 text-xs mt-1">{errors.haslo}</p>}
      </div>
      <div>
        <label className="label" htmlFor="haslo2">Powtórz hasło *</label>
        <input id="haslo2" type="password" className={`input-field ${errors.haslo2 ? 'border-red-400' : ''}`}
          value={data.haslo2} onChange={e => onChange('haslo2', e.target.value)} placeholder="Powtórz hasło" />
        {errors.haslo2 && <p className="text-red-500 text-xs mt-1">{errors.haslo2}</p>}
      </div>
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────
function Krok2({ data, onChange, errors }) {
  const toggleDodatkowa = (kat) => {
    const curr = data.dodatkowe || []
    if (curr.includes(kat)) {
      onChange('dodatkowe', curr.filter(k => k !== kat))
    } else {
      onChange('dodatkowe', [...curr, kat])
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="kategoria">Kategoria główna *</label>
        <select id="kategoria" className={`input-field ${errors.kategoria ? 'border-red-400' : ''}`}
          value={data.kategoria} onChange={e => onChange('kategoria', e.target.value)}>
          <option value="">Wybierz specjalizację</option>
          {kategorie.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {errors.kategoria && <p className="text-red-500 text-xs mt-1">{errors.kategoria}</p>}
      </div>

      <div>
        <label className="label">Dodatkowe kategorie</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {kategorie.filter(k => k !== data.kategoria).map(k => (
            <label key={k} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox"
                checked={(data.dodatkowe || []).includes(k)}
                onChange={() => toggleDodatkowa(k)}
                className="accent-primary w-3.5 h-3.5" />
              {k}
            </label>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="wojewodztwo">Województwo *</label>
          <select id="wojewodztwo" className={`input-field ${errors.wojewodztwo ? 'border-red-400' : ''}`}
            value={data.wojewodztwo} onChange={e => onChange('wojewodztwo', e.target.value)}>
            <option value="">Wybierz województwo</option>
            {wojewodztwa.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          {errors.wojewodztwo && <p className="text-red-500 text-xs mt-1">{errors.wojewodztwo}</p>}
        </div>
        <div>
          <label className="label" htmlFor="miasto">Miasto *</label>
          <input id="miasto" className={`input-field ${errors.miasto ? 'border-red-400' : ''}`}
            value={data.miasto} onChange={e => onChange('miasto', e.target.value)} placeholder="np. Warszawa" />
          {errors.miasto && <p className="text-red-500 text-xs mt-1">{errors.miasto}</p>}
        </div>
      </div>

      <div>
        <label className="label">
          Zasięg działania: <strong className="text-primary">{data.zasieg} km</strong>
        </label>
        <input type="range" min={5} max={200} step={5}
          value={data.zasieg}
          onChange={e => onChange('zasieg', Number(e.target.value))}
          className="w-full mt-1" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5 km</span><span>200 km</span>
        </div>
      </div>

      <div>
        <label className="label">Rodzaj prac</label>
        <div className="flex gap-3">
          {[
            { val: 'wnetrze', label: '🏠 Wnętrze' },
            { val: 'zewnetrze', label: '🌿 Zewnętrze' },
            { val: 'oba', label: '✅ Oba' },
          ].map(({ val, label }) => (
            <button key={val} type="button"
              onClick={() => onChange('typPrac', val)}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                data.typPrac === val
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────
function Krok3({ data, onChange, errors }) {
  const [fileName, setFileName] = useState('')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      onChange('zdjecie', file.name)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="opis">Opis profilu *</label>
        <textarea id="opis"
          rows={5}
          className={`input-field resize-none ${errors.opis ? 'border-red-400' : ''}`}
          value={data.opis}
          onChange={e => onChange('opis', e.target.value)}
          placeholder="Opisz swoje doświadczenie, specjalizacje, sposób pracy. Im bardziej szczegółowy opis, tym więcej zleceń otrzymasz..."
        />
        <div className="flex justify-between">
          {errors.opis
            ? <p className="text-red-500 text-xs mt-1">{errors.opis}</p>
            : <span />}
          <p className={`text-xs mt-1 ${data.opis.length < 50 ? 'text-gray-400' : 'text-emerald-600'}`}>
            {data.opis.length}/50 min. znaków
          </p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="doswiadczenie">Doświadczenie *</label>
        <select id="doswiadczenie"
          className={`input-field ${errors.doswiadczenie ? 'border-red-400' : ''}`}
          value={data.doswiadczenie}
          onChange={e => onChange('doswiadczenie', e.target.value)}>
          <option value="">Wybierz staż pracy</option>
          {['Mniej niż rok', '1–2 lata', '3–5 lat', '6–10 lat', '10–15 lat', 'Ponad 15 lat'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.doswiadczenie && <p className="text-red-500 text-xs mt-1">{errors.doswiadczenie}</p>}
      </div>

      <div>
        <label className="label">Zdjęcie profilowe</label>
        <label htmlFor="zdjecie"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-all duration-200 group">
          <span className="text-4xl">{fileName ? '🖼️' : '📁'}</span>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
              {fileName || 'Kliknij aby wybrać zdjęcie'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5 MB</p>
          </div>
          <input id="zdjecie" type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        <strong>ℹ️ Informacja:</strong> Po wysłaniu formularza Twój profil zostanie zweryfikowany przez nasz zespół w ciągu 24 godzin.
      </div>
    </div>
  )
}

// ─── Success screen ────────────────────────────────────
function Sukces() {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-6">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
        <span className="text-5xl">✅</span>
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Dziękujemy!</h2>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Twój profil jest <strong>w trakcie weryfikacji</strong>. Skontaktujemy się z Tobą w ciągu <strong>24 godzin</strong>.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <a href="/szukaj" className="btn-primary text-center">Przeglądaj fachowców</a>
        <a href="/" className="btn-outline text-center">Wróć na stronę główną</a>
      </div>
    </div>
  )
}

// ─── Validation helpers ────────────────────────────────
function validateStep1(data) {
  const e = {}
  if (!data.imie.trim()) e.imie = 'Imię jest wymagane'
  if (!data.nazwisko.trim()) e.nazwisko = 'Nazwisko jest wymagane'
  if (!data.telefon.trim()) e.telefon = 'Telefon jest wymagany'
  else if (!/^\+?\d[\d\s\-]{7,}$/.test(data.telefon)) e.telefon = 'Nieprawidłowy numer telefonu'
  if (!data.email.trim()) e.email = 'E-mail jest wymagany'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Nieprawidłowy adres e-mail'
  if (!data.haslo) e.haslo = 'Hasło jest wymagane'
  else if (data.haslo.length < 8) e.haslo = 'Hasło musi mieć min. 8 znaków'
  if (data.haslo !== data.haslo2) e.haslo2 = 'Hasła nie są identyczne'
  return e
}

function validateStep2(data) {
  const e = {}
  if (!data.kategoria) e.kategoria = 'Wybierz kategorię główną'
  if (!data.wojewodztwo) e.wojewodztwo = 'Wybierz województwo'
  if (!data.miasto.trim()) e.miasto = 'Miasto jest wymagane'
  return e
}

function validateStep3(data) {
  const e = {}
  if (data.opis.length < 50) e.opis = 'Opis musi mieć min. 50 znaków'
  if (!data.doswiadczenie) e.doswiadczenie = 'Wybierz staż pracy'
  return e
}

// ─── Main Rejestracja page ─────────────────────────────
export default function Rejestracja() {
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Step 1
    imie: '', nazwisko: '', telefon: '', email: '', haslo: '', haslo2: '',
    // Step 2
    kategoria: '', dodatkowe: [], wojewodztwo: '', miasto: '', zasieg: 50, typPrac: 'oba',
    // Step 3
    opis: '', doswiadczenie: '', zdjecie: '',
  })

  const updateField = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const goNext = async () => {
    let e = {}
    if (step === 0) e = validateStep1(formData)
    if (step === 1) e = validateStep2(formData)
    if (step === 2) e = validateStep3(formData)

    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    if (step === 2) {
      try {
        await register(formData)
        setDone(true)
      } catch (err) {
        setErrors({ general: err.message || 'Wystąpił błąd podczas rejestracji, spróbuj ponownie.' })
      }
    } else {
      setStep(s => s + 1)
      setErrors({})
    }
  }

  const goBack = () => {
    setStep(s => s - 1)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛠️</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Zarejestruj się jako fachowiec</h1>
          <p className="text-gray-500 text-sm mt-1">Dołącz do platformy i zdobywaj nowe zlecenia</p>
        </div>

        <div className="card p-6 sm:p-8">
          {done ? (
            <Sukces />
          ) : (
            <>
              <Stepper steps={STEPS} current={step} />

              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{STEPS[step]}</h2>
                <p className="text-sm text-gray-500">Krok {step + 1} z {STEPS.length}</p>
              </div>

              {step === 0 && <Krok1 data={formData} onChange={updateField} errors={errors} />}
              {step === 1 && <Krok2 data={formData} onChange={updateField} errors={errors} />}
              {step === 2 && <Krok3 data={formData} onChange={updateField} errors={errors} />}

              {errors.general && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errors.general}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 gap-3">
                {step > 0 ? (
                  <button onClick={goBack} className="btn-outline px-6">
                    ← Wstecz
                  </button>
                ) : (
                  <span />
                )}
                <button onClick={goNext} className="btn-primary px-8 ml-auto">
                  {step === 2 ? '✅ Wyślij profil' : 'Dalej →'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Login link */}
        {!done && (
          <p className="text-sm text-gray-500 text-center mt-6">
            Masz już konto?{' '}
            <a href="#" className="text-primary hover:underline font-medium">Zaloguj się</a>
          </p>
        )}
      </div>
    </div>
  )
}
