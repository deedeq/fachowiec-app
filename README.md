# 🛠️ Fachowiec.app

![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Status](https://img.shields.io/badge/status-prototype-orange)
![License](https://img.shields.io/badge/license-MIT-green)

> **Fachowiec.app** to nowoczesny marketplace dla fachowców budowlanych — platforma łącząca specjalistów z branży budowlanej z klientami szukającymi pomocy przy pracach remontowych i budowlanych.

---

## 📋 Opis projektu

Aplikacja jest prototypem serwisu wzorowanego na Oferteo/OLX, skierowanego do rynku usług budowlanych w Polsce. Umożliwia:

- **Klientom** — wyszukiwanie i filtrowanie fachowców według lokalizacji (mapa województw), specjalizacji, ceny i statusu weryfikacji
- **Fachowcom** — rejestrację profilu w intuicyjnym kreatorze 3-krokowym
- Przeglądanie pełnych profili z opisem, zakresem usług, galerią realizacji i opiniami klientów

---

## 🧰 Tech Stack

| Technologia | Wersja | Przeznaczenie |
|---|---|---|
| React | 18 | Framework UI |
| React Router DOM | 6 | Routing SPA |
| Tailwind CSS | 3 | Stylowanie |
| Vite | 5 | Bundler / Dev server |

---

## 📁 Struktura projektu

```
fachowiec-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Filtry.jsx        # Panel filtrów wyszukiwania
│   │   ├── KartaFachowca.jsx # Karta fachowca w liście wyników
│   │   ├── MapaPolski.jsx    # Interaktywna mapa SVG Polski
│   │   ├── Navbar.jsx        # Nawigacja (desktop + mobile hamburger)
│   │   └── Stepper.jsx       # Wskaźnik kroków rejestracji
│   ├── data/
│   │   └── fachowcy.js       # 15 realistycznych profili mockowych
│   ├── pages/
│   │   ├── LandingPage.jsx   # Strona główna (/)
│   │   ├── Szukaj.jsx        # Wyszukiwarka (/szukaj)
│   │   ├── ProfilFachowca.jsx # Profil fachowca (/fachowiec/:id)
│   │   ├── Rejestracja.jsx   # Rejestracja (/rejestracja)
│   │   └── NotFound.jsx      # Strona 404
│   ├── App.jsx               # Routing główny
│   ├── index.css             # Style globalne + Tailwind
│   └── main.jsx              # Punkt wejścia React
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.cjs
└── vite.config.js
```

---

## 🚀 Instrukcja uruchomienia

### Wymagania
- Node.js >= 18
- npm >= 9

### Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/deedeq/fachowiec-app.git
cd fachowiec-app

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173**

### Budowanie produkcyjne

```bash
npm run build
npm run preview
```

---

## 🌐 Wdrożenie na GitHub

```bash
git init
git add .
git commit -m "init: Fachowiec.app prototype"
git branch -M main
git remote add origin https://github.com/deedeq/fachowiec-app.git
git push -u origin main
```

### Deployment na Vercel (zalecany)

```bash
npm install -g vercel
vercel
```

---

## 📱 Funkcje aplikacji

### ✅ Zrealizowane (v1 — prototype)
- [x] Landing page z wyszukiwarką i kategoriami
- [x] Wyszukiwarka z filtrami (województwo, specjalizacja, cena, weryfikacja)
- [x] Interaktywna mapa SVG 16 województw
- [x] 15 realistycznych profili mockowych fachowców
- [x] Pełny widok profilu z galerią i opiniami
- [x] Rejestracja w 3 krokach z walidacją formularzy
- [x] Responsywny design (mobile first)
- [x] Hamburger menu na urządzeniach mobilnych
- [x] Strona 404

---

## 🔮 Planowane funkcje v2

| Funkcja | Opis |
|---|---|
| 🔐 Backend Node.js + Express | REST API, obsługa baz danych |
| 🔑 Autoryzacja JWT | Logowanie i rejestracja użytkowników, sesje |
| 💳 Płatności online | Integracja z Stripe lub Przelewy24 |
| 💬 Czat w czasie rzeczywistym | Komunikator między klientem a fachowcem (Socket.io) |
| 📄 System ofertowania | Klient wystawia zlecenie, fachowcy składają oferty |
| 🛡️ Panel administracyjny | Weryfikacja fachowców, zarządzanie treścią |
| 📊 Dashboard fachowca | Statystyki wyświetleń, zapytań, ocen |
| 🔔 Powiadomienia push | Nowe zlecenia, wiadomości, opinie |
| 🌐 SEO + SSR | Next.js dla lepszego pozycjonowania |
| 📱 Aplikacja mobilna | React Native / Expo |

---

## 👥 Autorzy

| Autor | GitHub |
|---|---|
| deedeq | [@deedeq](https://github.com/deedeq) |

---

## 📄 Licencja

MIT © 2025 Fachowiec.app

---

> Zbudowano z ❤️ używając React + Tailwind CSS
