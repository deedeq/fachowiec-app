# 🛠️ Fachowiec.app (v1.0.0)

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express-4-lightgrey)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![i18next](https://img.shields.io/badge/i18next-MultiLanguage-orange)

> **Fachowiec.app** to nowoczesna aplikacja webowa — platforma łącząca specjalistów z branży budowlanej z klientami szukającymi pomocy przy pracach remontowych i budowlanych.
> **Slogan:** "Masz robotę? Znajdź fachowca."

---

## 📋 Opis projektu

Aplikacja wspiera trzy główne role użytkowników:
- **Klienci** — wyszukiwanie fachowców, przeglądanie profili i kontakt. Rejestracja jako klient.
- **Fachowcy** — rejestracja profesjonalnego profilu, ustalanie cennika, dodawanie usług, zarządzanie profilem z poziomu własnego panelu.
- **Administratorzy** — zarządzanie wszystkimi użytkownikami z poziomu dedykowanego Panelu Administratora (edycja danych dowolnego profilu z zapisem bezpośrednio do bazy).

Dodatkowo aplikacja wspiera **wielojęzyczność (i18n)**, umożliwiając zmianę języka na Polski (domyślny), Angielski, Ukraiński oraz Niemiecki.

Wszystkie dane (profile, usługi, opinie, autoryzacja) pochodzą z **rzeczywistej bazy danych Supabase (PostgreSQL)** i są w pełni zarządzane przez własne backendowe REST API.

---

## 🧰 Tech Stack

| Warstwa | Technologia |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Wielojęzyczność | i18next + react-i18next |
| HTTP Client | Axios |
| Backend | Node.js 20 + Express 4 |
| Baza danych | Supabase (PostgreSQL) |
| Auth | Supabase Auth + integracja kont |
| Walidacja | express-validator |
| Deployment | Vercel (Frontend & Backend) |

---

## 🚀 Uruchomienie lokalne

### 1. Klonowanie i instalacja
```bash
npm install
```

### 2. Zmienne środowiskowe
Musisz utworzyć plik `server/.env` zawierający:
```env
SUPABASE_URL=https://<twoje-id>.supabase.co
SUPABASE_ANON_KEY=<twoj-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<twoj-service-role-key>
JWT_SECRET=<losowy-string-min-32-znaki>
PORT=3001
```

Opcjonalnie dla frontendu w głównym katalogu `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Baza danych Supabase
Uruchom po kolei skrypty w panelu SQL Editor na Supabase:
1. Skrypt inicjalizujący schemat bazy: `server/supabase/schema.sql` (lub `supabase_migration.sql` jeśli używasz migracji z repo).
2. Skrypt aktualizujący politykę bazy dla nowych ról: **`setup_db.sql`** (zdejmuje NOT NULL dla klientów i dodaje nową strukturę uprawnień).

### 4. Uruchomienie
Frontend:
```bash
npm run dev
# -> http://localhost:5173
```
Backend (w osobnym oknie):
```bash
cd server
npm run dev
# -> http://localhost:3001
```

---

## 📱 Najważniejsze funkcje i status

### ✅ Główne zrealizowane funkcjonalności (Gotowe do produkcji)
- **Pełne połączenie z bazą Supabase:** Wszystkie profile na stronie, logowanie i rejestracja operują na realnych danych z PostgreSQL (Brak mockowanych profili dla wyświetlania!).
- **Dynamiczna rejestracja (2 przepływy):** Klienci rejestrują się szybko w 1 kroku. Fachowcy mają 3-krokowy proces uzupełniania profilu usługowego.
- **Role użytkowników:** Wprowadzono typy kont `admin`, `fachowiec` i `klient`.
- **Wielojęzyczność:** Zmiana języka za pomocą flagi (PL, EN, UK, DE) bez przeładowywania strony (nawigacja i kluczowe slogany).
- **Panel Administratora:** Dostępny dla admina system umożliwiający przeglądanie oraz natychmiastową edycję dowolnego fachowca na żywo w bazie danych.
- **Panel Fachowca:** Indywidualny panel ze statystykami i możliwością zaktualizowania swoich danych kontaktowych, opisu itp.
- **Wyszukiwarka z inteligentnym podpowiadaniem:** Integracja parametrów URL z bazą danych (w tym sortowanie: ocena, cena, opinie).

---

## ⚠️ Co musisz wiedzieć / zrobić na produkcji (Vercel & Supabase)

Jeśli na produkcji coś nie działa, upewnij się, że:
1. **Wykonałeś `setup_db.sql` w Supabase!** Jeśli ten plik nie został uruchomiony w zakładce "SQL Editor", klienci nie będą mogli założyć konta z powodu błędu bazy (`null value in column "specjalizacja" violates not-null constraint`).
2. Zmienna **`VITE_API_URL` na Vercelu** wskazuje poprawny adres URL twojego backendu (jeśli backend nie jest postawiony na tym samym Vercelu lub domena się różni). W `vercel.json` jest zasada rewritowania `/api/(.*)` na `server/index.js`, upewnij się, że działa poprawnie.
3. W zmiennych na Vercelu są wgrane zmienne środowiskowe `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (niezbędny do nadpisywania reguł w Panelu Admina).

---
> Fachowiec.app - 2026. Zbudowane z użyciem najnowszych narzędzi React i Supabase.
