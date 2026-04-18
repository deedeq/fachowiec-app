import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { kategorie } from '../data/fachowcy'

import { LogoIcon } from '../components/Logo'
import { Zap, Droplets, BrickWall, PaintRoller, Home, Paintbrush, Grid2x2, Hammer, Ruler, Flame, DraftingCompass, HardHat, Lamp } from 'lucide-react'

const KATEGORIE_ICONS = {
  'Elektryk': <Zap size={40} className="text-yellow-500" strokeWidth={1.5} />,
  'Hydraulik': <Droplets size={40} className="text-blue-500" strokeWidth={1.5} />,
  'Murarz': <BrickWall size={40} className="text-amber-700" strokeWidth={1.5} />,
  'Tynkarz': <PaintRoller size={40} className="text-slate-400" strokeWidth={1.5} />,
  'Dekarz': <Home size={40} className="text-red-700" strokeWidth={1.5} />,
  'Malarz': <Paintbrush size={40} className="text-indigo-400" strokeWidth={1.5} />,
  'Glazurnik': <Grid2x2 size={40} className="text-emerald-500" strokeWidth={1.5} />,
  'Stolarz': <Hammer size={40} className="text-amber-800" strokeWidth={1.5} />,
  'Cieśla': <Ruler size={40} className="text-violet-500" strokeWidth={1.5} />,
  'Spawacz': <Flame size={40} className="text-orange-500" strokeWidth={1.5} />,
  'Architekt': <DraftingCompass size={40} className="text-blue-600" strokeWidth={1.5} />,
  'Inżynier budowlany': <HardHat size={40} className="text-amber-400" strokeWidth={1.5} />,
  'Projektant wnętrz': <Lamp size={40} className="text-teal-500" strokeWidth={1.5} />,
}

const STATS = [
  { value: '60+', label: 'fachowców', icon: '👷' },
  { value: '16', label: 'województw', icon: '🗺️' },
  { value: '480+', label: 'zleceń', icon: '📋' },
]

const POPULAR_KATEGORIE = ['Elektryk', 'Hydraulik', 'Murarz', 'Tynkarz', 'Dekarz', 'Malarz', 'Glazurnik', 'Stolarz']

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: '🔍',
    title: 'Szukaj',
    desc: 'Wpisz specjalizację i miejscowość. Znajdziemy sprawdzonych fachowców w Twojej okolicy.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    step: '2',
    icon: '📋',
    title: 'Porównaj',
    desc: 'Przeglądaj profile, oceny i ceny. Zapisuj ulubionych i wybierz najlepszego dla siebie.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    step: '3',
    icon: '📞',
    title: 'Zamów',
    desc: 'Skontaktuj się bezpośrednio z fachowcem. Bez pośredników, bez ukrytych opłat.',
    color: 'from-emerald-500 to-green-600',
  },
]

export default function LandingPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [currentSlogan, setCurrentSlogan] = useState(0)

  const dynamicSlogans = ['sloganDynamic1', 'sloganDynamic2', 'sloganDynamic3', 'sloganDynamic4']

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % dynamicSlogans.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

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
            <LogoIcon className="w-16 h-16 text-white drop-shadow-md" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {t('sloganMain')}
            </h1>
          </div>

          <div className="h-10 mb-8 relative text-xl text-blue-100 font-medium">
            {dynamicSlogans.map((slug, idx) => (
              <p
                key={slug}
                className={`absolute inset-0 transition-all duration-500 ease-in-out w-full text-center flex items-center justify-center ${
                  idx === currentSlogan ? 'opacity-100 translate-y-0' : idx < currentSlogan ? 'opacity-0 -translate-y-8' : 'opacity-0 translate-y-8'
                }`}
              >
                {t(slug)}
              </p>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12 relative z-20">
            <input
              id="hero-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('hero_input')}
              className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent text-white font-bold rounded-xl shadow-xl hover:bg-orange-600 transition-all duration-200 hover:shadow-orange-400/30 active:scale-95 whitespace-nowrap"
            >
              🔍 {t('hero_search')}
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
              onClick={() => navigate(`/kategoria/${encodeURIComponent(kat)}`)}
              className="card p-5 flex flex-col items-center gap-3 group hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {KATEGORIE_ICONS[kat] || <Hammer size={40} />}
              </span>
              <span className="font-semibold text-gray-800 text-sm">{kat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Jak to działa?</h2>
            <p className="text-gray-500 text-lg">Trzy proste kroki do znalezienia idealnego fachowca</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-14 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 to-emerald-300 z-0" />

            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                {/* Step badge */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-5 transition-transform duration-300 hover:scale-110 hover:shadow-xl`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>

                {/* Step number pill */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3 bg-gradient-to-r ${item.color} text-white shadow`}>
                  Krok {item.step}
                </span>

                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{item.desc}</p>

                {/* Arrow between steps */}
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="sm:hidden text-3xl text-gray-300 mt-4">↓</div>
                )}
              </div>
            ))}
          </div>

          {/* CTA below steps */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/szukaj')}
              className="btn-primary px-8 py-4 text-base shadow-lg hover:shadow-xl"
            >
              🔍 Zacznij szukać fachowca
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto card p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #1a73e8, #0d47a1)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Jesteś fachowcem?</h2>
          <p className="text-blue-200 mb-8 text-lg">Dołącz do ponad 60 specjalistów i zdobywaj zlecenia online</p>
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
