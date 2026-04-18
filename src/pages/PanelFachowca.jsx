import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Stars } from '../components/KartaFachowca'

// Mock statistics data
const STATS = {
  wyswietlenia: 1284,
  wyswietleniaZmiana: +12.4,
  zapytania: 47,
  zapytaniaZmiana: +5,
  ocena: 4.8,
  ocenaZmiana: +0.2,
  zarobki: 8450,
  zarobkiZmiana: +18.7,
}

const WYKRESY_DANE = [
  { miesiac: 'Lis', wartosc: 4200 },
  { miesiac: 'Gru', wartosc: 5100 },
  { miesiac: 'Sty', wartosc: 3800 },
  { miesiac: 'Lut', wartosc: 6200 },
  { miesiac: 'Mar', wartosc: 7400 },
  { miesiac: 'Kwi', wartosc: 8450 },
]

const OSTATNIE_OPINIE = [
  { id: 1, autor: 'Marek W.', ocena: 5, komentarz: 'Świetna robota, polecam serdecznie!', data: '2026-04-10' },
  { id: 2, autor: 'Anna K.', ocena: 5, komentarz: 'Profesjonalnie i terminowo. Na pewno skorzystam ponownie.', data: '2026-04-07' },
  { id: 3, autor: 'Tomasz B.', ocena: 4, komentarz: 'Dobra jakość, drobne opóźnienie ale efekt bardzo dobry.', data: '2026-04-02' },
]

const NADCHODZACE_ZLECENIA = [
  { id: 1, klient: 'Jarosław M.', usluga: 'Malowanie pokoi', data: '2026-04-18', kwota: 1200, status: 'potwierdzone' },
  { id: 2, klient: 'Katarzyna S.', usluga: 'Glazura łazienka', data: '2026-04-22', kwota: 2100, status: 'oczekuje' },
  { id: 3, klient: 'Piotr R.', usluga: 'Instalacja elektryczna', data: '2026-04-25', kwota: 850, status: 'oczekuje' },
]

function StatCard({ icon, title, value, change, prefix = '', suffix = '' }) {
  const positive = change >= 0
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {positive ? '▲' : '▼'} {Math.abs(change)}{typeof change === 'number' && change % 1 !== 0 ? '' : ''}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
          {prefix}{typeof value === 'number' ? value.toLocaleString('pl-PL') : value}{suffix}
        </p>
      </div>
    </div>
  )
}

function MiniChart({ dane }) {
  const max = Math.max(...dane.map(d => d.wartosc))
  const min = Math.min(...dane.map(d => d.wartosc))
  const range = max - min || 1

  return (
    <div className="flex items-end gap-1 h-24">
      {dane.map((d, i) => {
        const height = ((d.wartosc - min) / range) * 60 + 20
        const isLast = i === dane.length - 1
        return (
          <div key={d.miesiac} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-full rounded-t-md transition-all duration-500 ${isLast ? 'bg-primary' : 'bg-primary/30'}`}
              style={{ height: `${height}px` }}
              title={`${d.miesiac}: ${d.wartosc.toLocaleString('pl-PL')} zł`}
            />
            <span className="text-xs text-gray-400">{d.miesiac}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    potwierdzone: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: '✓ Potwierdzone' },
    oczekuje: { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: '⏳ Oczekuje' },
    anulowane: { cls: 'bg-red-50 text-red-600 border-red-200', label: '✕ Anulowane' },
  }
  const { cls, label } = map[status] || map.oczekuje
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>
  )
}

export default function PanelFachowca() {
  const { user, isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState('przeglad')

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Panel tylko dla fachowców</h1>
        <p className="text-gray-500 mb-8">Zaloguj się lub zarejestruj jako fachowiec, żeby zobaczyć swój panel.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/logowanie" className="btn-outline">Zaloguj się</Link>
          <Link to="/rejestracja" className="btn-primary">🛠️ Dołącz</Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'przeglad', label: '📊 Przegląd' },
    { id: 'zlecenia', label: '📋 Zlecenia' },
    { id: 'opinie', label: '⭐ Opinie' },
    { id: 'ustawienia', label: '⚙️ Profil' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user?.imie?.[0]}{user?.nazwisko?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Cześć, {user?.imie || 'Fachowcu'}! 👋
            </h1>
            <p className="text-sm text-gray-500">Panel fachowca · kwiecień 2026</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/wiadomosci" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
            💬 Wiadomości
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
          </Link>
          <Link to={`/fachowiec/${user?.profil?.id || user?.id}`} className="btn-primary text-sm py-2 px-4">
            👁️ Mój profil
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Przegląd */}
      {activeTab === 'przeglad' && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="👁️" title="Wyświetlenia profilu" value={STATS.wyswietlenia} change={STATS.wyswietleniaZmiana} suffix="%" />
            <StatCard icon="📩" title="Zapytania" value={STATS.zapytania} change={STATS.zapytaniaZmiana} />
            <StatCard icon="⭐" title="Średnia ocena" value={STATS.ocena} change={STATS.ocenaZmiana} />
            <StatCard icon="💰" title="Zarobki (zł)" value={STATS.zarobki} change={STATS.zarobkiZmiana} suffix="%" />
          </div>

          {/* Chart + Quick actions */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Przychody (ostatnie 6 m.)</h2>
                  <p className="text-sm text-gray-400">Trend za kwiecień: <span className="text-emerald-500 font-semibold">+18.7%</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-900">8 450 zł</p>
                  <p className="text-xs text-gray-400">Ten miesiąc</p>
                </div>
              </div>
              <MiniChart dane={WYKRESY_DANE} />
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800">Szybkie akcje</h2>
              <div className="flex flex-col gap-2">
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-sm font-medium">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">📝</span>
                  Edytuj profil
                </button>
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-sm font-medium">
                  <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">📷</span>
                  Dodaj zdjęcia prac
                </button>
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-sm font-medium">
                  <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">🏷️</span>
                  Ustaw dostępność
                </button>
                <Link to="/wiadomosci" className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-sm font-medium">
                  <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">💬</span>
                  Odpisz klientom
                  <span className="ml-auto text-xs font-bold text-primary">3 nowe</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Ostatnie opinie</h2>
              <button onClick={() => setActiveTab('opinie')} className="text-xs text-primary font-semibold hover:underline">
                Wszystkie →
              </button>
            </div>
            <div className="space-y-4">
              {OSTATNIE_OPINIE.map(op => (
                <div key={op.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {op.autor[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-gray-800">{op.autor}</span>
                      <span className="text-xs text-gray-400">{op.data}</span>
                    </div>
                    <Stars rating={op.ocena} />
                    <p className="text-sm text-gray-600 mt-1">{op.komentarz}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Zlecenia */}
      {activeTab === 'zlecenia' && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Nadchodzące zlecenia</h2>
            <span className="text-sm text-gray-400">{NADCHODZACE_ZLECENIA.length} zlecenia</span>
          </div>
          <div className="divide-y divide-gray-50">
            {NADCHODZACE_ZLECENIA.map(z => (
              <div key={z.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-lg">
                  🔧
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{z.usluga}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span>👤 {z.klient}</span>
                    <span>·</span>
                    <span>📅 {z.data}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={z.status} />
                  <span className="font-bold text-gray-900 whitespace-nowrap">{z.kwota.toLocaleString('pl-PL')} zł</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Łączna wartość: <span className="font-bold text-gray-900">
                {NADCHODZACE_ZLECENIA.reduce((s, z) => s + z.kwota, 0).toLocaleString('pl-PL')} zł
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Tab: Opinie */}
      {activeTab === 'opinie' && (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <div className="text-6xl font-extrabold text-gray-900">{STATS.ocena}</div>
                <Stars rating={STATS.ocena} />
                <p className="text-sm text-gray-400 mt-1">Średnia z 47 opinii</p>
              </div>
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = stars === 5 ? 38 : stars === 4 ? 7 : stars === 3 ? 2 : 0
                  const pct = Math.round((count / 47) * 100)
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 w-4">{stars}★</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-yellow-400 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {OSTATNIE_OPINIE.map(op => (
            <div key={op.id} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                {op.autor[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{op.autor}</span>
                  <span className="text-xs text-gray-400">{op.data}</span>
                </div>
                <Stars rating={op.ocena} />
                <p className="text-sm text-gray-600 mt-2">{op.komentarz}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Ustawienia profilu */}
      {activeTab === 'ustawienia' && (
        <ProfileSettingsTab user={user} />
      )}
    </div>
  )
}

function ProfileSettingsTab({ user }) {
  const { submitProfil } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    imie: user?.imie || '',
    nazwisko: user?.nazwisko || '',
    telefon: user?.profil?.telefon || '',
    miasto: user?.profil?.miasto || '',
    opis: user?.profil?.opis || '',
  })

  const handleChange = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitProfil(formData)
      alert('Zapisano zmiany!')
    } catch (err) {
      alert('Błąd: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-800">Dane profilu</h2>
        <form onSubmit={handleSave}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Imię</label>
              <input value={formData.imie} onChange={e => handleChange('imie', e.target.value)} className="input-field" disabled />
              <p className="text-xs text-gray-400 mt-1">Imienia nie można zmienić</p>
            </div>
            <div>
              <label className="label">Nazwisko</label>
              <input value={formData.nazwisko} onChange={e => handleChange('nazwisko', e.target.value)} className="input-field" disabled />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input value={user?.email || ''} className="input-field" type="email" disabled />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input value={formData.telefon} onChange={e => handleChange('telefon', e.target.value)} className="input-field" type="tel" />
            </div>
            <div>
              <label className="label">Miasto</label>
              <input value={formData.miasto} onChange={e => handleChange('miasto', e.target.value)} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Opis profilu</label>
              <textarea
                rows={4}
                className="input-field resize-none"
                value={formData.opis}
                onChange={e => handleChange('opis', e.target.value)}
                placeholder="Napisz coś o sobie i swoich usługach..."
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" disabled={loading} className="btn-primary text-sm px-6">
              {loading ? 'Zapisywanie...' : '💾 Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Bezpieczeństwo</h2>
            <div>
              <label className="label">Nowe hasło</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
            <div>
              <label className="label">Potwierdź hasło</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
            <div className="flex justify-end">
              <button className="btn-outline text-sm px-6">🔒 Zmień hasło</button>
            </div>
          </div>
    </div>
  )
}
