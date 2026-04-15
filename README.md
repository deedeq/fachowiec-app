# 🛠️ Fachowiec.app

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express-4-lightgrey)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Status](https://img.shields.io/badge/status-beta-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> **Fachowiec.app** to nowoczesny marketplace dla fachowców budowlanych — platforma łącząca specjalistów z branży budowlanej z klientami szukającymi pomocy przy pracach remontowych i budowlanych.

---

## 📋 Opis projektu

Aplikacja wzorowana na Oferteo/OLX, skierowana na rynek usług budowlanych w Polsce. Umożliwia:

- **Klientom** — wyszukiwanie, filtrowanie i zapisywanie fachowców
- **Fachowcom** — rejestrację profilu z pełną walidacją przez API
- Logowanie i rejestrację przez **Supabase Auth** + własny JWT
- Persystencję zapisanych fachowców w **localStorage** oraz **PostgreSQL**

---

## 🧰 Tech Stack

| Warstwa | Technologia |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Backend | Node.js 20 + Express 4 |
| Baza danych | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT (jsonwebtoken) |
| Walidacja | express-validator |
| Deployment | Vercel (frontend) |

---

## 📁 Struktura projektu

```
fachowiec-app/
├── src/
│   ├── api/
│   │   ├── client.js          # Axios instance z JWT interceptorem
│   │   ├── fachowcy.js        # Funkcje API fachowcy
│   │   ├── auth.js            # Funkcje API auth
│   │   └── zapisani.js        # Funkcje API zapisani
│   ├── components/
│   │   ├── Filtry.jsx
│   │   ├── KartaFachowca.jsx  # Karta z przyciskiem ❤️ Zapisz
│   │   ├── MapaPolski.jsx
│   │   ├── Navbar.jsx         # Auth-aware navbar + dropdown
│   │   └── Stepper.jsx
│   ├── context/
│   │   ├── AuthContext.jsx    # user, token, login/logout/register
│   │   └── SavedContext.jsx   # localStorage + Toast notifications
│   ├── data/
│   │   └── fachowcy.js        # Dane mockowe (fallback)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Szukaj.jsx         # Sortowanie: ocena / cena / opinie
│   │   ├── KategoriaPage.jsx  # /kategoria/:nazwa
│   │   ├── ProfilFachowca.jsx
│   │   ├── Logowanie.jsx      # Strona logowania
│   │   ├── Rejestracja.jsx
│   │   ├── Zapisani.jsx       # /zapisani (localStorage)
│   │   └── NotFound.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── index.js               # Express app
│   ├── .env                   # ⚠️ Nie commitować!
│   ├── routes/
│   │   ├── fachowcy.js        # GET/POST/PUT /api/fachowcy
│   │   ├── auth.js            # POST /api/auth/...
│   │   ├── opinie.js          # GET/POST/DELETE /api/opinie
│   │   └── zapisani.js        # GET/POST/DELETE /api/zapisani
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT Bearer token
│   ├── supabase/
│   │   ├── client.js          # Supabase JS klient
│   │   └── schema.sql         # DDL + RLS + seed data
│   └── package.json
├── vercel.json                # SPA rewrite dla Vercel
├── package.json
└── vite.config.js
```

---

## 🚀 Uruchomienie lokalne

### Wymagania
- Node.js >= 18
- npm >= 9
- Konto Supabase (darmowe)

### 1. Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend

```bash
cd server
npm install
npm run dev
# → http://localhost:3001
```

### 3. Baza danych Supabase

W panelu Supabase → SQL Editor wykonaj skrypt:

```
server/supabase/schema.sql
```

---

## 🔑 Zmienne środowiskowe

### Backend (`server/.env`)

Utwórz plik `server/.env` (nigdy nie commituj!):

```env
SUPABASE_URL=https://<twoje-id>.supabase.co
SUPABASE_ANON_KEY=<twoj-anon-key>
JWT_SECRET=<losowy-string-min-32-znaki>
PORT=3001
```

### Frontend (opcjonalnie `.env` w korzeniu)

```env
VITE_API_URL=http://localhost:3001/api
```

### Vercel Dashboard

W panelu Vercel → Settings → Environment Variables dodaj:

| Nazwa | Wartość |
|---|---|
| `VITE_API_URL` | URL backendu (np. Railway / Render) |

---

## 🌐 API Endpoints

| Metoda | Ścieżka | Opis | Auth |
|---|---|---|---|
| GET | `/api/fachowcy` | Lista z filtrowaniem i paginacją | ❌ |
| GET | `/api/fachowcy/:id` | Pełny profil + opinie | ❌ |
| GET | `/api/fachowcy/kategorie` | Lista kategorii z liczbami | ❌ |
| POST | `/api/fachowcy` | Utwórz profil | ✅ JWT |
| PUT | `/api/fachowcy/:id` | Edytuj profil (tylko właściciel) | ✅ JWT |
| POST | `/api/auth/rejestracja` | Rejestracja | ❌ |
| POST | `/api/auth/logowanie` | Logowanie → token JWT | ❌ |
| GET | `/api/auth/profil` | Dane zalogowanego użytkownika | ✅ JWT |
| POST | `/api/auth/wylogowanie` | Wylogowanie | ✅ JWT |
| GET | `/api/opinie/:fachowiec_id` | Opinie dla fachowca | ❌ |
| POST | `/api/opinie` | Dodaj opinię | ✅ JWT |
| DELETE | `/api/opinie/:id` | Usuń swoją opinię | ✅ JWT |
| GET | `/api/zapisani` | Lista zapisanych | ✅ JWT |
| POST | `/api/zapisani` | Dodaj do ulubionych | ✅ JWT |
| DELETE | `/api/zapisani/:fachowiec_id` | Usuń z ulubionych | ✅ JWT |

---

## 📱 Funkcje aplikacji

### ✅ Zrealizowane (v1 — prototype)
- [x] Landing page z wyszukiwarką i kategoriami
- [x] Wyszukiwarka z filtrami
- [x] Interaktywna mapa SVG 16 województw
- [x] 15 realistycznych profili mockowych
- [x] Pełny widok profilu z opisem, usługami i opiniami
- [x] Rejestracja 3-krokowa z walidacją

### ✅ Zrealizowane (v2 — UX)
- [x] Sortowanie wyników (ocena / cena / opinie)
- [x] Strony kategorii `/kategoria/:nazwa`
- [x] Przycisk ❤️ Zapisz na kartach fachowców
- [x] Strona `/zapisani` (localStorage)
- [x] Toast powiadomienia
- [x] Aktywny stan Navbar (NavLink)

### ✅ Zrealizowane (v3 — Backend)
- [x] REST API Node.js + Express
- [x] Supabase PostgreSQL + RLS
- [x] Auth JWT (logowanie / rejestracja)
- [x] Navbar auth-aware (avatar + dropdown)
- [x] Strona `/logowanie`
- [x] Axios client z interceptorami JWT
- [x] Vercel SPA rewrite

### ✅ Zrealizowane (v4 — Dashboard & UX+)
- [x] Panel fachowca z dashboard statystyk (przychody, wyświetlenia, zapytania, ocena)
- [x] Wykres przychodów (ostatnie 6 miesięcy)
- [x] System wiadomości – lista konwersacji + czat z klientami
- [x] Dzwonek powiadomień w Navbar (🔔 badge z licznikiem)
- [x] Modal "Poproś o wycenę" na profilu fachowca
- [x] Dodawanie opinii z poziomu profilu (zalogowani)
- [x] Status dostępności fachowca (🟢 Dostępny)
- [x] Aktywne przyciski kontaktowe dla zalogowanych

### 🔮 Planowane (v5+)
- [ ] Czat Socket.io w czasie rzeczywistym
- [ ] Powiadomienia push (WebSockets)
- [ ] Next.js SSR dla SEO


---

## 👥 Autorzy

| Autor | GitHub |
|---|---|
| deedeq | [@deedeq](https://github.com/deedeq) |

---

## 📄 Licencja

MIT © 2025 Fachowiec.app

---

> Zbudowano z ❤️ używając React + Node.js + Supabase
