import { Link } from 'react-router-dom'
import { useSaved } from '../context/SavedContext'
import KartaFachowca from '../components/KartaFachowca'

export default function Zapisani() {
  const { saved } = useSaved()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
          <span>⭐</span> Ulubieni fachowcy
        </h1>
        <p className="text-gray-500">
          {saved.length > 0
            ? `Masz ${saved.length} zapisanych fachowców`
            : 'Twoja lista zapisanych jest pusta'}
        </p>
      </div>

      {saved.length > 0 ? (
        <div className="flex flex-col gap-4">
          {saved.map((f) => (
            <KartaFachowca key={f.id} fachowiec={f} />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center flex flex-col items-center gap-5">
          <span className="text-7xl">☆</span>
          <div>
            <p className="text-xl font-bold text-gray-700 mb-2">Brak ulubionych fachowców</p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Kliknij przycisk ⭐ na karcie fachowca, aby dodać go do ulubionych
            </p>
          </div>
          <Link
            to="/szukaj"
            className="btn-primary mt-2"
          >
            🔍 Przeglądaj fachowców
          </Link>
        </div>
      )}
    </div>
  )
}
