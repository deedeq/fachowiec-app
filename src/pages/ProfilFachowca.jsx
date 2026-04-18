import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Stars, Avatar } from '../components/KartaFachowca'
import { useAuth } from '../context/AuthContext'
import { useSaved } from '../context/SavedContext'
import { apiClient } from '../api/client'

function OpiniaCard({ opinia }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
            {(opinia.autor_imie || opinia.autor || 'A')[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{opinia.autor_imie || opinia.autor || 'Anonim'}</p>
            <p className="text-xs text-gray-400">{new Date(opinia.created_at || opinia.data).toLocaleDateString()}</p>
          </div>
        </div>
        <Stars rating={opinia.ocena} />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{opinia.tresc}</p>
    </div>
  )
}

function OrderModal({ fachowiec, onClose }) {
  const [form, setForm] = useState({ usluga: '', opis: '', data: '', budzet: '' })
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-toast">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Zapytanie wysłane!</h3>
          <p className="text-gray-500 mb-6">
            {fachowiec.imie} otrzymał Twoje zapytanie. Odpowie w ciągu 24 godzin.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Usługa</p>
            <p className="font-semibold text-gray-800">{form.usluga || fachowiec.specjalizacja}</p>
            {form.data && <><p className="text-xs text-gray-500 mb-1 mt-2">Termin</p><p className="font-semibold text-gray-800">{form.data}</p></>}
            {form.budzet && <><p className="text-xs text-gray-500 mb-1 mt-2">Budżet</p><p className="font-semibold text-gray-800">{form.budzet} zł</p></>}
          </div>
          <button onClick={onClose} className="btn-primary w-full">Zamknij</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-toast">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Zapytanie o wycenę</h3>
            <p className="text-sm text-gray-500">{fachowiec.imie} {fachowiec.nazwisko} · {fachowiec.specjalizacja}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="p-6 space-y-4">
          <div>
            <label className="label">Rodzaj usługi *</label>
            <select className="input-field" value={form.usluga} onChange={e => setForm(f => ({ ...f, usluga: e.target.value }))} required>
              <option value="">Wybierz usługę...</option>
              {(fachowiec.uslugi || []).map((u, i) => <option key={i} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Opis zlecenia *</label>
            <textarea
              rows={3} className="input-field resize-none"
              placeholder="Opisz czego potrzebujesz, jaki metraż, materiały itp."
              value={form.opis} onChange={e => setForm(f => ({ ...f, opis: e.target.value }))} required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Preferowany termin</label>
              <input type="date" className="input-field" value={form.data}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <div>
              <label className="label">Budżet orientacyjny (zł)</label>
              <input type="number" className="input-field" placeholder="np. 2000"
                value={form.budzet} onChange={e => setForm(f => ({ ...f, budzet: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Anuluj</button>
            <button type="submit" className="btn-primary flex-1">📤 Wyślij zapytanie</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProfilFachowca() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { toggleSave, isSaved } = useSaved()
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [addedReview, setAddedReview] = useState(false)
  const [newReview, setNewReview] = useState({ ocena: 5, tresc: '' })
  const [fachowiec, setFachowiec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFachowiec() {
      try {
        const { data } = await apiClient.get(`/fachowcy/${id}`)
        setFachowiec(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFachowiec()
  }, [id])

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Ładowanie profilu...</div>
  }

  if (!fachowiec) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nie znaleziono fachowca</h2>
        <p className="text-gray-500 mb-6">Profil o id <strong>{id}</strong> nie istnieje.</p>
        <Link to="/szukaj" className="btn-primary">← Wróć do wyszukiwania</Link>
      </div>
    )
  }

  const { imie, nazwisko, specjalizacja, miasto, wojewodztwo, srednia_ocena, liczba_opinii, cena_od, zweryfikowany, opis, uslugi, opinie, typ } = fachowiec
  const ocena = srednia_ocena || 0
  const liczbaOpinii = liczba_opinii || 0
  const cenaOd = cena_od || 0
  const saved = isSaved(fachowiec.id)
  const typLabel = { wnetrze: 'Wnętrze', zewnetrze: 'Zewnętrze', oba: 'Wnętrze i zewnętrze' }
  const galleryColors = ['bg-slate-200', 'bg-stone-200', 'bg-zinc-200', 'bg-neutral-200', 'bg-gray-200', 'bg-slate-300']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {showOrderModal && <OrderModal fachowiec={fachowiec} onClose={() => setShowOrderModal(false)} />}

      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-primary transition-colors mb-6 flex items-center gap-1">
        ← Powrót do wyników
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <Avatar imie={imie} nazwisko={nazwisko} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900">{imie} {nazwisko}</h1>
                  {zweryfikowany && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                      ✓ Zweryfikowany
                    </span>
                  )}
                </div>
                <p className="text-primary font-semibold text-lg mb-2">{specjalizacja}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">📍 {miasto}, {wojewodztwo}</span>
                  <span className="flex items-center gap-2">
                    <Stars rating={ocena} />
                    <strong className="text-gray-800">{ocena}</strong>
                    <span>({liczbaOpinii} opinii)</span>
                  </span>
                  <span className="flex items-center gap-1">🏗️ {typLabel[typ]}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-extrabold text-gray-900">od {cenaOd} zł</div>
                <div className="text-sm text-gray-500">za godzinę</div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                    🟢 Dostępny
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* O mnie */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><span>👤</span> O mnie</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{opis}</p>
          </div>

          {/* Usługi */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🔧</span> Zakres usług</h2>
            <div className="flex flex-wrap gap-2">
              {(uslugi || []).map((u, i) => (
                <span key={i} className="bg-blue-50 text-primary border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">{u}</span>
              ))}
            </div>
          </div>

          {/* Realizacje */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>📷</span> Realizacje</h2>
            <div className="grid grid-cols-3 gap-3">
              {galleryColors.map((color, i) => (
                <div key={i} className={`${color} rounded-xl aspect-square flex items-center justify-center text-4xl relative overflow-hidden group cursor-pointer`}>
                  <span className="opacity-30 text-gray-500">🏠</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-white font-semibold transition-opacity duration-200 bg-black/50 px-2 py-1 rounded-lg">
                      Realizacja {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Zdjęcia realizacji · wkrótce dostępne</p>
          </div>

          {/* Opinie */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>⭐</span> Opinie ({liczbaOpinii})</h2>
            <div className="flex flex-col gap-4">
              {(opinie || []).map((op, i) => <OpiniaCard key={i} opinia={op} />)}
              {(opinie || []).length > 0 && (
                <p className="text-xs text-gray-400 text-center">Wyświetlono {(opinie || []).length} z {liczbaOpinii} opinii</p>
              )}
            </div>

            {isLoggedIn && !addedReview && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Dodaj swoją opinię</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Ocena:</span>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setNewReview(r => ({ ...r, ocena: s }))}
                      className={`text-xl transition-transform hover:scale-110 ${s <= newReview.ocena ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                  ))}
                </div>
                <textarea rows={3} className="input-field resize-none text-sm mb-3"
                  placeholder="Opisz swoje doświadczenie z tym fachowcem..."
                  value={newReview.tresc} onChange={e => setNewReview(r => ({ ...r, tresc: e.target.value }))} />
                <button onClick={() => { if (newReview.tresc.trim()) setAddedReview(true) }}
                  className="btn-primary text-sm px-5" disabled={!newReview.tresc.trim()}>
                  ⭐ Dodaj opinię
                </button>
              </div>
            )}
            {isLoggedIn && addedReview && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
                ✅ Dziękujemy za opinię! Zostanie opublikowana po weryfikacji.
              </div>
            )}
            {!isLoggedIn && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 text-center">
                <Link to="/logowanie" className="text-primary font-semibold hover:underline">Zaloguj się</Link>, żeby dodać opinię
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Skontaktuj się</h3>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">🟢 Dostępny</span>
            </div>

            <div className="flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <button onClick={() => setShowOrderModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:scale-95">
                    📋 Poproś o wycenę
                  </button>
                  <Link to="/wiadomosci"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95">
                    💬 Napisz wiadomość
                  </Link>
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                    📞 Zadzwoń
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 text-center leading-relaxed">
                      🔒 <strong>Zaloguj się</strong> aby kontaktować się z fachowcami
                    </p>
                  </div>
                  <Link to="/logowanie" className="w-full btn-primary text-sm text-center">Zaloguj się</Link>
                  <p className="text-xs text-gray-400 text-center">
                    Nie masz konta?{' '}
                    <Link to="/rejestracja" className="text-primary hover:underline">Zarejestruj się</Link>
                  </p>
                </>
              )}
            </div>

            <button onClick={() => toggleSave(fachowiec)}
              className={`w-full mt-3 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                saved ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100' : 'bg-white border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500'
              }`}>
              {saved ? '❤️ Zapisano' : '🤍 Zapisz fachowca'}
            </button>
          </div>

          {/* Stats */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Statystyki</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ocena</span>
                <div className="flex items-center gap-1.5"><Stars rating={ocena} /><strong>{ocena}/5</strong></div>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Liczba opinii</span><strong>{liczbaOpinii}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Cena od</span><strong className="text-primary">{cenaOd} zł/h</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Zakres prac</span><strong>{typLabel[typ]}</strong></div>
              {zweryfikowany && (
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-emerald-600 font-semibold text-xs">✓ Zweryfikowany</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Czas odpowiedzi</span><strong className="text-green-600">~2 godz.</strong></div>
            </div>
          </div>

          {/* Services */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Główne usługi</h3>
            <ul className="space-y-1.5">
              {(uslugi || []).slice(0, 5).map((u, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{u}
                </li>
              ))}
              {(uslugi || []).length > 5 && <li className="text-xs text-gray-400">+ {(uslugi || []).length - 5} więcej</li>}
            </ul>
          </div>

        </aside>
      </div>
    </div>
  )
}
