import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { kategorie } from '../data/fachowcy'

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

const STATS = [
  { value: '1 200+', label: 'fachowców', icon: '👷' },
  { value: '16', label: 'województw', icon: '🗺️' },
  { value: '4 800+', label: 'zleceń', icon: '📋' },
]

const POPULAR_KATEGORIE = ['Elektryk', 'Hydraulik', 'Murarz', 'Tynkarz', 'Dekarz', 'Malarz', 'Glazurnik', 'Stolarz']

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/szukaj${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #1a73e8 50%, #1565c0 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl drop-shadow-lg">🛠️</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Fachowiec<span className="text-[#ff6d00]">.app</span>
            </h1>
          </div>

          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Znajdź sprawdzonego fachowca budowlanego w Twojej okolicy
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12">
            <input
              id="hero-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj np. elektryk Katowice"
              className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent text-white font-bold rounded-xl shadow-xl hover:bg-orange-600 transition-all duration-200 hover:shadow-orange-400/30 active:scale-95 whitespace-nowrap"
            >
              🔍 Szukaj
            </button>
          </form>

          {/* Role cards */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/szukaj')}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-6 text-left transition-all duration-200 hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold text-xl mb-1">Szukam fachowca</div>
              <div className="text-blue-200 text-sm">Przeglądaj profile i kontaktuj się ze sprawdzonymi specjalistami</div>
              <div className="mt-4 text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform duration-200">
                Przeglądaj fachowców →
              </div>
            </button>

            <button
              onClick={() => navigate('/rejestracja')}
              className="group bg-accent/80 backdrop-blur-sm border border-accent/40 text-white rounded-2xl p-6 text-left transition-all duration-200 hover:bg-accent hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <div className="text-4xl mb-3">🛠️</div>
              <div className="font-bold text-xl mb-1">Jestem fachowcem</div>
              <div className="text-orange-100 text-sm">Dołącz do platformy i zdobywaj nowych klientów w swojej okolicy</div>
              <div className="mt-4 text-sm font-semibold text-white group-hover:translate-x-1 transition-transform duration-200">
                Dołącz teraz →
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-3xl font-extrabold text-primary">{s.value}</span>
              <span className="text-gray-500 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popularne kategorie */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Popularne kategorie</h2>
          <p className="text-gray-500">Wybierz specjalizację i znajdź idealnego fachowca</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {POPULAR_KATEGORIE.map((kat) => (
            <button
              key={kat}
              onClick={() => navigate(`/szukaj?kategoria=${encodeURIComponent(kat)}`)}
              className="card p-5 flex flex-col items-center gap-3 group hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <span className="text-4xl transition-transform duration-200 group-hover:scale-110">
                {KATEGORIE_ICONS[kat] || '🔨'}
              </span>
              <span className="font-semibold text-gray-800 text-sm">{kat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Jak to działa?</h2>
            <p className="text-gray-500">Prosty proces w 3 krokach</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Wyszukaj', desc: 'Podaj lokalizację i typ fachowca którego potrzebujesz' },
              { step: '2', icon: '📋', title: 'Porównaj', desc: 'Przeglądaj profile, opinie i ceny. Wybierz najlepszego' },
              { step: '3', icon: '📞', title: 'Skontaktuj się', desc: 'Zadzwoń lub napisz bezpośrednio do wybranego specjalisty' },
            ].map((item) => (
              <div key={item.step} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto card p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #1a73e8, #0d47a1)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Jesteś fachowcem?</h2>
          <p className="text-blue-200 mb-8 text-lg">Dołącz do ponad 1200 specjalistów i zdobywaj zlecenia online</p>
          <button
            onClick={() => navigate('/rejestracja')}
            className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            🛠️ Zarejestruj się za darmo
          </button>
        </div>
      </section>
    </div>
  )
}
