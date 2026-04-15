import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SavedProvider } from './context/SavedContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Szukaj from './pages/Szukaj'
import ProfilFachowca from './pages/ProfilFachowca'
import Rejestracja from './pages/Rejestracja'
import Logowanie from './pages/Logowanie'
import Zapisani from './pages/Zapisani'
import KategoriaPage from './pages/KategoriaPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedProvider>
          <div className="min-h-screen bg-bg flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"                   element={<LandingPage />} />
                <Route path="/szukaj"             element={<Szukaj />} />
                <Route path="/kategoria/:nazwa"   element={<KategoriaPage />} />
                <Route path="/fachowiec/:id"      element={<ProfilFachowca />} />
                <Route path="/rejestracja"        element={<Rejestracja />} />
                <Route path="/logowanie"          element={<Logowanie />} />
                <Route path="/zapisani"           element={<Zapisani />} />
                <Route path="*"                   element={<NotFound />} />
              </Routes>
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 mt-8">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <div className="font-semibold text-primary">🛠️ Fachowiec.app</div>
                <nav className="flex gap-6">
                  <a href="#" className="hover:text-primary transition-colors">O nas</a>
                  <a href="#" className="hover:text-primary transition-colors">Kontakt</a>
                  <a href="#" className="hover:text-primary transition-colors">Regulamin</a>
                  <a href="#" className="hover:text-primary transition-colors">Polityka prywatności</a>
                </nav>
                <span>© 2025 Fachowiec.app</span>
              </div>
            </footer>
          </div>
        </SavedProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
