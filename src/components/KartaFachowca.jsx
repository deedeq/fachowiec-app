import { Link } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import { Star } from 'lucide-react'

function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => <span key={`f${i}`} className="text-yellow-400 text-sm">★</span>)}
      {half && <span className="text-yellow-400 text-sm" style={{background:'linear-gradient(90deg,#facc15 50%,#d1d5db 50%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>★</span>}
      {Array(empty).fill(0).map((_, i) => <span key={`e${i}`} className="text-gray-300 text-sm">★</span>)}
    </span>
  )
}

function Avatar({ imie, nazwisko }) {
  const safeImie = imie || '?'
  const safeNazwisko = nazwisko || '?'
  const initials = `${safeImie[0]}${safeNazwisko[0]}`
  const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-teal-500','bg-rose-500','bg-indigo-500']
  const color = colors[(safeImie.charCodeAt(0) + safeNazwisko.charCodeAt(0)) % colors.length] || colors[0]
  return (
    <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
      {initials.toUpperCase()}
    </div>
  )
}

export default function KartaFachowca({ fachowiec }) {
  const { id, imie, nazwisko, specjalizacja, miasto, wojewodztwo, zweryfikowany } = fachowiec
  const ocena = fachowiec.ocena ?? fachowiec.srednia_ocena ?? 0
  const liczbaOpinii = fachowiec.liczbaOpinii ?? fachowiec.liczba_opinii ?? 0
  const cenaOd = fachowiec.cenaOd ?? fachowiec.cena_od ?? 0
  const { toggleSave, isSaved } = useSaved()
  const saved = isSaved(id)

  return (
    <div className="card p-5 flex flex-col sm:flex-row gap-4">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 sm:items-start">
        <Avatar imie={imie} nazwisko={nazwisko} />
        {zweryfikowany && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 whitespace-nowrap">
            ✓ Zweryfikowany
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{imie} {nazwisko}</h3>
            <p className="text-primary font-semibold text-sm">{specjalizacja}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-extrabold text-gray-900">od {cenaOd} zł<span className="text-sm font-normal text-gray-500">/h</span></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span>📍</span> {miasto}, {wojewodztwo}
          </span>
          <span className="flex items-center gap-1.5">
            <Stars rating={ocena} />
            <span className="font-semibold text-gray-700">{ocena}</span>
            <span>({liczbaOpinii} opinii)</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2">
        {/* Save button */}
        <button
          onClick={() => toggleSave(fachowiec)}
          title={saved ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          className={`
            p-2 rounded-xl border-2 transition-all duration-200 active:scale-95
            ${saved
              ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
              : 'bg-white border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50'}
          `}
        >
          <div className={`transition-transform duration-200 ${saved ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Star size={20} fill={saved ? 'currentColor' : 'none'} strokeWidth={2} />
          </div>
        </button>

        <Link
          to={`/fachowiec/${id}`}
          className="btn-primary text-sm whitespace-nowrap w-full sm:w-auto text-center"
        >
          Zobacz profil →
        </Link>
      </div>
    </div>
  )
}

export { Stars, Avatar }
