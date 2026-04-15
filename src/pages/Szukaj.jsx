import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fachowcy } from '../data/fachowcy'
import KartaFachowca from '../components/KartaFachowca'
import Filtry from '../components/Filtry'

const DEFAULT_FILTRY = {
  wojewodztwo: null,
  typ: null,
  kategoria: null,
  cenaMin: 0,
  tylkoZweryfikowani: false,
}

const SORTOWANIE_OPTIONS = [
  { value: 'ocena', label: '⭐ Najwyżej oceniani' },
  { value: 'cena', label: '💰 Najtańsi' },
  { value: 'opinie', label: '💬 Najwięcej opinii' },
]

function normalizeStr(s) {
  return s.toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź|ż/g, 'z')
}

export default function Szukaj() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '')
  const [filtrySidebar, setFiltrySidebar] = useState(false)
  const [sortowanie, setSortowanie] = useState('ocena')

  const [filtry, setFiltry] = useState(() => ({
    ...DEFAULT_FILTRY,
    kategoria: searchParams.get('kategoria') || null,
  }))

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(inputVal)
  }

  const wyniki = useMemo(() => {
    let lista = fachowcy

    if (query) {
      const q = normalizeStr(query)
      lista = lista.filter((f) => {
        const hay = normalizeStr(`${f.imie} ${f.nazwisko} ${f.specjalizacja} ${f.miasto} ${f.wojewodztwo}`)
        return hay.includes(q)
      })
    }

    if (filtry.wojewodztwo) {
      const wNorm = normalizeStr(filtry.wojewodztwo)
      lista = lista.filter((f) => normalizeStr(f.wojewodztwo) === wNorm)
    }
    if (filtry.typ) {
      lista = lista.filter((f) => f.typ === filtry.typ || f.typ === 'oba')
    }
    if (filtry.kategoria) {
      lista = lista.filter((f) => f.specjalizacja === filtry.kategoria)
    }
    if (filtry.cenaMin > 0) {
      lista = lista.filter((f) => f.cenaOd >= filtry.cenaMin)
    }
    if (filtry.tylkoZweryfikowani) {
      lista = lista.filter((f) => f.zweryfikowany)
    }

    // Sorting
    const sorted = [...lista]
    if (sortowanie === 'ocena') sorted.sort((a, b) => b.ocena - a.ocena)
    else if (sortowanie === 'cena') sorted.sort((a, b) => a.cenaOd - b.cenaOd)
    else if (sortowanie === 'opinie') sorted.sort((a, b) => b.liczbaOpinii - a.liczbaOpinii)

    return sorted
  }, [query, filtry, sortowanie])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          id="search-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Szukaj np. elektryk Katowice"
          className="flex-1 input-field text-base py-3"
        />
        <button type="submit" className="btn-primary px-6 py-3 whitespace-nowrap">
          🔍 Szukaj
        </button>
        {/* Mobile filter toggle */}
        <button
          type="button"
          className="lg:hidden btn-outline px-4 py-3"
          onClick={() => setFiltrySidebar(!filtrySidebar)}
        >
          🎛️
        </button>
      </form>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className={`${filtrySidebar ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
          <Filtry filtry={filtry} onFiltry={setFiltry} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Result count + sorting */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-gray-600 text-sm">
              Znaleziono <span className="font-bold text-gray-900">{wyniki.length}</span> fachowców
              {query && <span className="text-primary"> dla „{query}"</span>}
              {filtry.wojewodztwo && <span className="text-primary"> w {filtry.wojewodztwo}</span>}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sortuj:</span>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                  {SORTOWANIE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortowanie(opt.value)}
                      className={`
                        text-xs font-semibold px-3 py-2 transition-all duration-150 whitespace-nowrap
                        ${sortowanie === opt.value
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {Object.values({ ...filtry, cenaMin: filtry.cenaMin > 0 ? filtry.cenaMin : null }).some(Boolean) && (
                <button
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => setFiltry(DEFAULT_FILTRY)}
                >
                  Wyczyść filtry ×
                </button>
              )}
            </div>
          </div>

          {wyniki.length > 0 ? (
            <div className="flex flex-col gap-4">
              {wyniki.map((f) => (
                <KartaFachowca key={f.id} fachowiec={f} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center text-gray-400 flex flex-col items-center gap-4">
              <span className="text-6xl">🔍</span>
              <div>
                <p className="text-lg font-semibold text-gray-600">Brak wyników</p>
                <p className="text-sm mt-1">Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry</p>
              </div>
              <button
                className="btn-outline text-sm mt-2"
                onClick={() => { setFiltry(DEFAULT_FILTRY); setQuery(''); setInputVal('') }}
              >
                Pokaż wszystkich fachowców
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
