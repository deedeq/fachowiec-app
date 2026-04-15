import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { fachowcy } from '../data/fachowcy'
import KartaFachowca from '../components/KartaFachowca'

const KATEGORIE_ICONS = {
  'Elektryk': '⚡',
  'Hydraulik': '🔧',
  'Murarz': '🧱',
  'Tynkarz': '🖌️',
  'Dekarz': '🏠',
  'Malarz': '🎨',
  'Glazurnik': '🔲',
  'Stolarz': '🪵',
  'Cieśla': '🪚',
  'Spawacz': '🔩',
  'Architekt': '📐',
  'Inżynier budowlany': '🏗️',
  'Projektant wnętrz': '🛋️',
}

export default function KategoriaPage() {
  const { nazwa } = useParams()
  const decoded = decodeURIComponent(nazwa)

  const wyniki = useMemo(() => {
    return fachowcy.filter(
      (f) => f.specjalizacja.toLowerCase() === decoded.toLowerCase()
    ).sort((a, b) => b.ocena - a.ocena)
  }, [decoded])

  const icon = KATEGORIE_ICONS[decoded] || '🔨'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Strona główna</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{decoded}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{icon}</span>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{decoded}</h1>
          <p className="text-gray-500 mt-1">
            Znaleziono <strong className="text-gray-800">{wyniki.length}</strong> fachowców
          </p>
        </div>
      </div>

      {wyniki.length > 0 ? (
        <div className="flex flex-col gap-4">
          {wyniki.map((f) => (
            <KartaFachowca key={f.id} fachowiec={f} />
          ))}
        </div>
      ) : (
        <div className="card p-14 text-center flex flex-col items-center gap-4">
          <span className="text-6xl">🔍</span>
          <p className="text-xl font-bold text-gray-700">Brak fachowców w tej kategorii</p>
          <Link to="/szukaj" className="btn-primary mt-2">
            Przeglądaj wszystkich →
          </Link>
        </div>
      )}
    </div>
  )
}
