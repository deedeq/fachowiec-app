import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <div className="text-9xl font-extrabold text-gray-100 select-none leading-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-bounce">🔨</span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Strona nie istnieje</h1>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        Wygląda na to, że ta strona jest jeszcze w budowie lub została przeniesiona.
        Nie martw się — nasi fachowcy znają się na remoncie, ale tu nic nie naprawią 😄
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="btn-primary px-8 py-3"
        >
          🏠 Wróć na stronę główną
        </Link>
        <Link
          to="/szukaj"
          className="btn-outline px-8 py-3"
        >
          🔍 Szukaj fachowca
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
        <span>Może szukasz:</span>
        <Link to="/szukaj" className="hover:text-primary transition-colors underline underline-offset-2">Fachowcy</Link>
        <Link to="/rejestracja" className="hover:text-primary transition-colors underline underline-offset-2">Rejestracja</Link>
        <a href="#" className="hover:text-primary transition-colors underline underline-offset-2">Kontakt</a>
      </div>
    </div>
  )
}
