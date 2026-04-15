import MapaPolski from './MapaPolski'
import { kategorie } from '../data/fachowcy'

export default function Filtry({ filtry, onFiltry }) {
  const { wojewodztwo, typ, kategoria, cenaMin, tylkoZweryfikowani } = filtry

  const update = (key, val) => onFiltry({ ...filtry, [key]: val })

  return (
    <aside className="w-full space-y-5">
      {/* Map */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">📍 Województwo</h3>
        <MapaPolski selected={wojewodztwo} onSelect={(woj) => update('wojewodztwo', woj)} />
      </div>

      {/* Typ pracy */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">🏗️ Rodzaj prac</h3>
        <div className="flex gap-2">
          {['wnetrze', 'zewnetrze', 'oba'].map((t) => {
            const labels = { wnetrze: 'Wnętrze', zewnetrze: 'Zewnętrze', oba: 'Oba' }
            const isActive = typ === t
            return (
              <button
                key={t}
                onClick={() => update('typ', isActive ? null : t)}
                className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Kategoria */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">🔧 Specjalizacja</h3>
        <select
          className="input-field"
          value={kategoria || ''}
          onChange={(e) => update('kategoria', e.target.value || null)}
        >
          <option value="">Wszystkie kategorie</option>
          {kategorie.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {/* Cena */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          💰 Cena od <span className="text-primary">{cenaMin} zł/h</span>
        </h3>
        <input
          type="range"
          min={0}
          max={200}
          step={10}
          value={cenaMin}
          onChange={(e) => update('cenaMin', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 zł</span>
          <span>200 zł</span>
        </div>
      </div>

      {/* Zweryfikowani */}
      <div className="card p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tylkoZweryfikowani}
            onChange={(e) => update('tylkoZweryfikowani', e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm font-medium text-gray-700">
            ✓ Tylko zweryfikowani
          </span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => onFiltry({ wojewodztwo: null, typ: null, kategoria: null, cenaMin: 0, tylkoZweryfikowani: false })}
        className="w-full text-sm text-gray-500 hover:text-primary underline underline-offset-2 transition-colors"
      >
        Wyczyść wszystkie filtry
      </button>
    </aside>
  )
}
