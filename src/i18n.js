import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pl: {
    translation: {
      "sloganMain": "Masz robotę? Znajdź fachowca.",
      "sloganDynamic1": "Masz robotę w kuchni? Znajdź hydraulika.",
      "sloganDynamic2": "Masz robotę na dachu? Znajdź dekarza.",
      "sloganDynamic3": "Masz remont w planach? Znajdź malarza.",
      "sloganDynamic4": "Masz problem z prądem? Znajdź elektryka.",
      "sloganRejestracja": "Masz fach w ręku? Znajdź robotę.",
      "nav_szukaj": "Szukaj fachowca",
      "nav_wiadomosci": "Wiadomości",
      "nav_panel": "Panel Administracyjny",
      "nav_moj_panel": "Mój Panel",
      "nav_wyloguj": "Wyloguj",
      "nav_zaloguj": "Zaloguj się",
      "nav_zarejestruj": "Zarejestruj się",
      "nav_zarejestruj_fach": "Zarejestruj się jako fachowiec",
      "hero_subtitle": "Najlepsza baza zweryfikowanych profesjonalistów w Twojej okolicy.",
      "hero_search": "Szukaj",
      "hero_input": "Kogo szukasz? (np. hydraulik, malarz)"
    }
  },
  en: {
    translation: {
      "sloganMain": "Got a job? Find a professional.",
      "sloganDynamic1": "Kitchen job? Find a plumber.",
      "sloganDynamic2": "Roof job? Find a roofer.",
      "sloganDynamic3": "Planning a renovation? Find a painter.",
      "sloganDynamic4": "Electrical issue? Find an electrician.",
      "sloganRejestracja": "Got skills? Find a job.",
      "nav_szukaj": "Find a Pro",
      "nav_wiadomosci": "Messages",
      "nav_panel": "Admin Panel",
      "nav_moj_panel": "My Dashboard",
      "nav_wyloguj": "Log out",
      "nav_zaloguj": "Log in",
      "nav_zarejestruj": "Sign up",
      "nav_zarejestruj_fach": "Register as Pro",
      "hero_subtitle": "The best database of verified professionals in your area.",
      "hero_search": "Search",
      "hero_input": "Who are you looking for? (e.g. plumber, painter)"
    }
  },
  uk: {
    translation: {
      "sloganMain": "Маєш роботу? Знайди фахівця.",
      "sloganDynamic1": "Робота на кухні? Знайди сантехніка.",
      "sloganDynamic2": "Проблеми з дахом? Знайди покрівельника.",
      "sloganDynamic3": "Плануєш ремонт? Знайди маляра.",
      "sloganDynamic4": "Проблеми зі світлом? Знайди електрика.",
      "sloganRejestracja": "Маєш навички? Знайди роботу.",
      "nav_szukaj": "Шукати фахівця",
      "nav_wiadomosci": "Повідомлення",
      "nav_panel": "Панель адміністратора",
      "nav_moj_panel": "Моя панель",
      "nav_wyloguj": "Вийти",
      "nav_zaloguj": "Увійти",
      "nav_zarejestruj": "Зареєструватися",
      "nav_zarejestruj_fach": "Реєстрація як профі",
      "hero_subtitle": "Найкраща база перевірених професіоналів у вашому районі.",
      "hero_search": "Шукати",
      "hero_input": "Кого ви шукаєте? (напр. сантехнік, маляр)"
    }
  },
  de: {
    translation: {
      "sloganMain": "Haben Sie einen Job? Finden Sie einen Profi.",
      "sloganDynamic1": "Job in der Küche? Finden Sie einen Klempner.",
      "sloganDynamic2": "Job auf dem Dach? Finden Sie einen Dachdecker.",
      "sloganDynamic3": "Renovierung geplant? Finden Sie einen Maler.",
      "sloganDynamic4": "Stromproblem? Finden Sie einen Elektriker.",
      "sloganRejestracja": "Haben Sie Fähigkeiten? Finden Sie einen Job.",
      "nav_szukaj": "Profi finden",
      "nav_wiadomosci": "Nachrichten",
      "nav_panel": "Admin-Panel",
      "nav_moj_panel": "Mein Dashboard",
      "nav_wyloguj": "Abmelden",
      "nav_zaloguj": "Anmelden",
      "nav_zarejestruj": "Registrieren",
      "nav_zarejestruj_fach": "Als Profi registrieren",
      "hero_subtitle": "Die beste Datenbank für verifizierte Profis in Ihrer Nähe.",
      "hero_search": "Suchen",
      "hero_input": "Wen suchen Sie? (z.B. Klempner, Maler)"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
