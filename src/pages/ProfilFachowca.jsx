import { useParams, Link, useNavigate } from 'react-router-dom'
import { fachowcy } from '../data/fachowcy'
import { Stars, Avatar } from '../components/KartaFachowca'

function OpiniaCard({ opinia }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
            {opinia.autor[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{opinia.autor}</p>
            <p className="text-xs text-gray-400">{opinia.data}</p>
          </div>
        </div>
        <Stars rating={opinia.ocena} />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{opinia.tresc}</p>
    </div>
  )
}

function ContactButton({ children, disabled, className }) {
  return (
    <button
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          : className
      }`}
      title={disabled ? 'Zaloguj się aby kontaktować' : ''}
    >
      {children}
    </button>
  )
}

export default function ProfilFachowca() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fachowiec = fachowcy.find((f) => f.id === Number(id))

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

  const { imie, nazwisko, specjalizacja, miasto, wojewodztwo, ocena, liczbaOpinii, cenaOd, zweryfikowany, opis, uslugi, opinie, typ } = fachowiec

  const typLabel = { wnetrze: 'Wnętrze', zewnetrze: 'Zewnętrze', oba: 'Wnętrze i zewnętrze' }

  // Placeholder gallery colors
  const galleryColors = ['bg-slate-200', 'bg-stone-200', 'bg-zinc-200', 'bg-neutral-200', 'bg-gray-200', 'bg-slate-300']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-primary transition-colors mb-6 flex items-center gap-1"
      >
        ← Powrót do wyników
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header card */}
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
              </div>
            </div>
          </div>

          {/* O mnie */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>👤</span> O mnie
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">{opis}</p>
          </div>

          {/* Usługi */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔧</span> Zakres usług
            </h2>
            <div className="flex flex-wrap gap-2">
              {uslugi.map((u, i) => (
                <span key={i} className="bg-blue-50 text-primary border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Realizacje */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📷</span> Realizacje
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {galleryColors.map((color, i) => (
                <div
                  key={i}
                  className={`${color} rounded-xl aspect-square flex items-center justify-center text-4xl relative overflow-hidden group cursor-pointer`}
                >
                  <span className="opacity-30 text-gray-500">🏠</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-600 font-medium transition-opacity duration-200">
                      Realizacja {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opinie */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⭐</span> Opinie ({liczbaOpinii})
            </h2>
            <div className="flex flex-col gap-4">
              {opinie.map((op, i) => (
                <OpiniaCard key={i} opinia={op} />
              ))}
              <p className="text-xs text-gray-400 text-center">Wyświetlono 3 z {liczbaOpinii} opinii</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Contact sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          {/* Contact card */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Skontaktuj się</h3>

            <div className="flex flex-col gap-3">
              <ContactButton disabled={true} className="bg-primary text-white hover:bg-blue-700">
                📞 Zadzwoń
              </ContactButton>
              <ContactButton disabled={true} className="btn-outline">
                ✉️ Napisz wiadomość
              </ContactButton>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 text-center leading-relaxed">
                🔒 <strong>Zaloguj się</strong> aby kontaktować się z fachowcami
              </p>
            </div>

            <button className="w-full mt-3 btn-outline text-sm">
              Zaloguj się
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Nie masz konta?{' '}
              <Link to="/rejestracja" className="text-primary hover:underline">Zarejestruj się</Link>
            </p>
          </div>

          {/* Quick stats */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Statystyki</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ocena</span>
                <div className="flex items-center gap-1.5">
                  <Stars rating={ocena} />
                  <strong>{ocena}/5</strong>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Liczba opinii</span>
                <strong>{liczbaOpinii}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cena od</span>
                <strong className="text-primary">{cenaOd} zł/h</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zakres prac</span>
                <strong>{typLabel[typ]}</strong>
              </div>
              {zweryfikowany && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-emerald-600 font-semibold text-xs">✓ Zweryfikowany</span>
                </div>
              )}
            </div>
          </div>

          {/* Uslugi quick list */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Główne usługi</h3>
            <ul className="space-y-1.5">
              {uslugi.slice(0, 5).map((u, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {u}
                </li>
              ))}
              {uslugi.length > 5 && (
                <li className="text-xs text-gray-400">+ {uslugi.length - 5} więcej</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
