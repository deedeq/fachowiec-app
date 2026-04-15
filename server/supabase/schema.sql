-- ============================================================
-- Fachowiec.app — Schemat bazy danych Supabase (PostgreSQL)
-- ============================================================

-- ============================================================
-- TABELE
-- ============================================================

-- Tabela profiles (fachowcy)
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users ON DELETE CASCADE,
  imie             TEXT NOT NULL,
  nazwisko         TEXT NOT NULL,
  specjalizacja    TEXT NOT NULL,
  miasto           TEXT NOT NULL,
  wojewodztwo      TEXT NOT NULL,
  opis             TEXT,
  cena_od          INTEGER,
  typ              TEXT CHECK (typ IN ('wnetrze', 'zewnetrze', 'oba')),
  zweryfikowany    BOOLEAN DEFAULT false,
  telefon          TEXT,
  email            TEXT,
  doswiadczenie_lat INTEGER,
  uslugi           TEXT[],
  avatar_url       TEXT,
  role             TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  status           TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela opinie
CREATE TABLE IF NOT EXISTS opinie (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fachowiec_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id        UUID REFERENCES auth.users ON DELETE SET NULL,
  autor_imie     TEXT NOT NULL,
  ocena          INTEGER CHECK (ocena BETWEEN 1 AND 5),
  tresc          TEXT NOT NULL,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, fachowiec_id)
);

-- Tabela zapisani (ulubieni fachowcy)
CREATE TABLE IF NOT EXISTS zapisani (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users ON DELETE CASCADE,
  fachowiec_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, fachowiec_id)
);

-- ============================================================
-- WIDOK: fachowcy_z_ocena
-- ============================================================
CREATE OR REPLACE VIEW fachowcy_z_ocena AS
SELECT
  p.*,
  COALESCE(ROUND(AVG(o.ocena)::NUMERIC, 2), 0) AS srednia_ocena,
  COUNT(o.id)::INTEGER                          AS liczba_opinii
FROM profiles p
LEFT JOIN opinie o ON o.fachowiec_id = p.id
GROUP BY p.id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own_or_admin"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );

CREATE POLICY "profiles_delete_own_or_admin"
  ON profiles FOR DELETE
  USING (
    auth.uid() = user_id 
    OR (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- opinie
ALTER TABLE opinie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opinie_select_all"
  ON opinie FOR SELECT USING (true);

CREATE POLICY "opinie_insert_logged"
  ON opinie FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "opinie_delete_own"
  ON opinie FOR DELETE
  USING (auth.uid() = user_id);

-- zapisani
ALTER TABLE zapisani ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zapisani_select_own"
  ON zapisani FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "zapisani_insert_own"
  ON zapisani FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "zapisani_delete_own"
  ON zapisani FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- DANE STARTOWE — 15 profiles
-- (UUID generowane przez gen_random_uuid() przy INSERT)
-- Dla uproszczenia user_id = NULL (seed data bez kont auth)
-- ============================================================

INSERT INTO profiles (imie, nazwisko, specjalizacja, miasto, wojewodztwo, opis, cena_od, typ, zweryfikowany, doswiadczenie_lat, uslugi, role, status) VALUES
('Marek',     'Kowalski',   'Elektryk',           'Warszawa',  'Mazowieckie',       'Certyfikowany elektryk z ponad 15-letnim doświadczeniem. Specjalizuję się w instalacjach elektrycznych nowych budynków, modernizacji starych instalacji oraz instalacjach inteligentnych systemów zarządzania budynkiem.',  120, 'oba',       true,  15, ARRAY['Instalacje elektryczne','Pomiary elektryczne','Wymiana rozdzielnic','Montaż oświetlenia LED','Inteligentny dom','Alarmy i monitoring'], 'user', 'approved'),
('Krzysztof', 'Nowak',      'Hydraulik',          'Kraków',    'Małopolskie',       'Hydraulik z 12-letnim stażem. Zajmuję się kompleksowymi instalacjami wod-kan, CO, montażem armatury łazienkowej i kuchennej.',  100, 'wnetrze',   true,  12, ARRAY['Instalacje wod-kan','Instalacje CO','Montaż armatury','Usuwanie awarii','Instalacja ogrzewania podłogowego']),
('Zbigniew',  'Wiśniewski', 'Murarz',             'Katowice',  'Śląskie',           'Doświadczony murarz z 20-letnim stażem w branży budowlanej. Realizuję projekty od fundamentów aż po dach.',  80, 'oba',        true,  20, ARRAY['Murowanie ścian','Fundamenty','Stropy','Kominy','Przebudowy i rozbudowy','Wyburzenia kontrolowane']),
('Andrzej',   'Dąbrowski',  'Tynkarz',            'Poznań',    'Wielkopolskie',     'Specjalizuję się w tynkach gipsowych i cementowo-wapiennych. Wykonuję tynki maszynowe gwarantujące idealnie gładkie powierzchnie.',  70, 'wnetrze',   false, 10, ARRAY['Tynki gipsowe maszynowe','Tynki cementowo-wapienne','Gładzie gipsowe','Szpachlowanie','Malowanie']),
('Henryk',    'Lewandowski','Dekarz',              'Gdańsk',    'Pomorskie',         'Dekarz z 18-letnim doświadczeniem. Specjalizuję się w pokryciach dachowych wszelkiego rodzaju.',  90, 'zewnetrze',  true,  18, ARRAY['Krycie dachówką ceramiczną','Blachodachówka','Papa termozgrzewalna','Obróbki blacharskie','Rynny i orynnowanie','Okna dachowe']),
('Sławomir',  'Wójcik',     'Malarz',             'Wrocław',   'Dolnośląskie',      'Profesjonalne malowanie wnętrz i elewacji zewnętrznych. Pracuję z farbami najlepszych producentów.',  55, 'wnetrze',   true,  14, ARRAY['Malowanie wnętrz','Malowanie elewacji','Efekty dekoracyjne','Beton architektoniczny','Tapetowanie']),
('Tomasz',    'Kamiński',   'Glazurnik',          'Łódź',      'Łódzkie',           'Glazurnik z certyfikatami międzynarodowymi. Układam płytki gresowe, ceramiczne, mozaikę, kamień naturalny.',  85, 'wnetrze',   true,  11, ARRAY['Układanie płytek i gresu','Mozaika','Kamień naturalny','Płytki wielkoformatowe','Hydroizolacja łazienek']),
('Wojciech',  'Zając',      'Stolarz',            'Białystok', 'Podlaskie',         'Stolarz meblowy i budowlany z własnym warsztatem. Projektuje i wykonuję meble na wymiar.',  110, 'wnetrze',  false, 13, ARRAY['Meble na wymiar','Szafy przesuwne','Zabudowy wnęk','Kuchnie na wymiar','Garderoby','Schody drewniane']),
('Paweł',     'Krawczyk',   'Cieśla',             'Rzeszów',   'Podkarpackie',      'Cieśla budowlany z 14-letnim doświadczeniem przy konstrukcjach drewnianych.',  95, 'zewnetrze',  true,  14, ARRAY['Konstrukcje dachowe','Domy szkieletowe','Altany i wiaty','Pergole','Tarasy drewniane']),
('Ryszard',   'Pawlak',     'Spawacz',            'Bydgoszcz', 'Kujawsko-Pomorskie','Spawacz z uprawnieniami TÜV w metodach MIG/MAG, TIG i elektrodą otuloną.',  130, 'oba',       true,  16, ARRAY['Spawanie MIG/MAG','Spawanie TIG','Balustrady i schody','Konstrukcje stalowe','Bramy wjazdowe']),
('Mariusz',   'Woźniak',    'Architekt',          'Warszawa',  'Mazowieckie',       'Architekt z uprawnieniami budowlanymi, 10 lat praktyki. Projektuję domy jednorodzinne i inwestycje wielorodzinne.',  200, 'oba',      true,  10, ARRAY['Projekty domów jednorodzinnych','Koncepcje architektoniczne','Projekt budowlany','Nadzór autorski']),
('Łukasz',    'Sikora',     'Inżynier budowlany', 'Kraków',    'Małopolskie',       'Inżynier budownictwa z uprawnieniami do kierowania robotami i projektowania.',  180, 'oba',       true,  8,  ARRAY['Kierownik budowy','Kosztorysy budowlane','Odbiory techniczne','Ekspertyzy budowlane','Nadzór inwestorski']),
('Katarzyna', 'Zawadzka',   'Projektant wnętrz',  'Gdynia',    'Pomorskie',         'Projektantka wnętrz z dyplomem ASP i 9-letnim doświadczeniem komercyjnym.',  150, 'wnetrze',   true,  9,  ARRAY['Projekt wnętrza','Wizualizacje 3D','Dobór materiałów','Nadzór realizacji','Home staging']),
('Janusz',    'Michalak',   'Elektryk',           'Wrocław',   'Dolnośląskie',      'Elektryk z 8-letnim doświadczeniem, specjalizuję się w instalacjach przemysłowych i energetyce odnawialnej.',  90, 'oba',       false, 8,  ARRAY['Instalacje fotowoltaiczne','Wallboxy EV','Instalacje przemysłowe','Systemy UPS','Klimatyzacje']),
('Mirosław',  'Grabowski',  'Hydraulik',          'Łódź',      'Łódzkie',           'Hydraulik działający od 5 lat na rynku łódzkim. Oferuję konkurencyjne ceny i szybkie terminy realizacji.',  65, 'wnetrze',   false, 5,  ARRAY['Wymiana baterii i armatury','Usuwanie awarii','Montaż grzejników','Przepychanie kanalizacji']);

-- ============================================================
-- DANE STARTOWE — opinie (po 3 dla każdego fachowca)
-- Używamy subquery by pobrać id po imieniu/nazwisku
-- ============================================================

INSERT INTO opinie (fachowiec_id, autor_imie, ocena, tresc) VALUES
-- Marek Kowalski (elektryk)
((SELECT id FROM profiles WHERE imie='Marek' AND nazwisko='Kowalski' LIMIT 1),  'Tomasz W.',    5, 'Profesjonalne podejście do pracy, terminowość na 5+. Pan Marek wykonał kompletną instalację elektryczną w naszym nowym domu. Polecam!'),
((SELECT id FROM profiles WHERE imie='Marek' AND nazwisko='Kowalski' LIMIT 1),  'Anna K.',      5, 'Wymiana całej tablicy rozdzielczej przeszła bezproblemowo. Czysta robota, pełna dokumentacja powykonawcza.'),
((SELECT id FROM profiles WHERE imie='Marek' AND nazwisko='Kowalski' LIMIT 1),  'Piotr R.',     4, 'Szybka reakcja na awarię, problem z instalacją rozwiązany w ciągu godziny. Cena adekwatna do jakości usługi.'),
-- Krzysztof Nowak (hydraulik)
((SELECT id FROM profiles WHERE imie='Krzysztof' AND nazwisko='Nowak' LIMIT 1), 'Monika S.',    5, 'Wymiana instalacji CO w całym mieszkaniu zrealizowana w ekspresowym tempie. Pan Krzysztof jest bardzo solidny. Gorąco polecam!'),
((SELECT id FROM profiles WHERE imie='Krzysztof' AND nazwisko='Nowak' LIMIT 1), 'Jakub T.',     4, 'Montaż łazienki od podstaw — prysznic, umywalka, wanna. Wszystko działa bez zarzutu, estetycznie poprowadzone rury.'),
((SELECT id FROM profiles WHERE imie='Krzysztof' AND nazwisko='Nowak' LIMIT 1), 'Ewa M.',       5, 'Awaria o 22:00, pan Krzysztof przyjechał w ciągu 30 minut. Zatrzymał wyciek i nie zostawił po sobie bałaganu. Nieoceniony!'),
-- Zbigniew Wiśniewski (murarz)
((SELECT id FROM profiles WHERE imie='Zbigniew' AND nazwisko='Wiśniewski' LIMIT 1), 'Stanisław K.', 5, 'Budowa garażu od fundamentów — praca wykonana starannie i na czas. Pan Zbigniew wie co robi, widać lata doświadczenia.'),
((SELECT id FROM profiles WHERE imie='Zbigniew' AND nazwisko='Wiśniewski' LIMIT 1), 'Renata P.',    4, 'Wyburzenie i murowanie nowej ściany działowej. Dobra komunikacja, czysty plac budowy po zakończeniu prac.'),
((SELECT id FROM profiles WHERE imie='Zbigniew' AND nazwisko='Wiśniewski' LIMIT 1), 'Łukasz B.',    5, 'Rozbudowa domu jednorodzinnego. Solidna robota, konkretne wyceny, dotrzymuje terminów. Zdecydowanie polecam!'),
-- Andrzej Dąbrowski (tynkarz)
((SELECT id FROM profiles WHERE imie='Andrzej' AND nazwisko='Dąbrowski' LIMIT 1),  'Marta W.',     5, 'Otynkowanie całego domu 200m² zakończone w zaplanowanym terminie. Równe ściany, bez rys. Bardzo polecam!'),
((SELECT id FROM profiles WHERE imie='Andrzej' AND nazwisko='Dąbrowski' LIMIT 1),  'Grzegorz N.',  4, 'Dobra robota za rozsądną cenę. Tynki maszynowe wyglądają świetnie.'),
((SELECT id FROM profiles WHERE imie='Andrzej' AND nazwisko='Dąbrowski' LIMIT 1),  'Elżbieta J.',  5, 'Renowacja starego mieszkania — stare tynki zbite, nowe gładzie. Efekt jak z magazynu wnętrzarskiego!'),
-- Henryk Lewandowski (dekarz)
((SELECT id FROM profiles WHERE imie='Henryk' AND nazwisko='Lewandowski' LIMIT 1),  'Bartosz C.',   5, 'Kompletna wymiana dachu na naszym domu. Pan Henryk zrealizował całość w 5 dni roboczych. TOP fachowiec!'),
((SELECT id FROM profiles WHERE imie='Henryk' AND nazwisko='Lewandowski' LIMIT 1),  'Zofia M.',     5, 'Naprawa przeciekającego dachu garażowego. Szybka diagnoza, trwała naprawa. Po silnych deszczach — zero problemów.'),
((SELECT id FROM profiles WHERE imie='Henryk' AND nazwisko='Lewandowski' LIMIT 1),  'Dariusz K.',   4, 'Montaż rynien i okien dachowych. Solidna robota, konkurencyjne ceny w regionie gdańskim. Polecam!'),
-- Sławomir Wójcik (malarz)
((SELECT id FROM profiles WHERE imie='Sławomir' AND nazwisko='Wójcik' LIMIT 1),    'Kamila P.',    5, 'Malowanie całego mieszkania 90m² w 3 dni roboczych. Idealne krawędzie, brak zachlapań. Pan Sławek to prawdziwy artysta!'),
((SELECT id FROM profiles WHERE imie='Sławomir' AND nazwisko='Wójcik' LIMIT 1),    'Rafał O.',     4, 'Elewacja domu — solidna robota. Dobre doradztwo w wyborze koloru, efekt końcowy lepszy niż oczekiwałem.'),
((SELECT id FROM profiles WHERE imie='Sławomir' AND nazwisko='Wójcik' LIMIT 1),    'Natalia G.',   5, 'Efekt betonu architektonicznego w salonie wygląda oszałamiająco. Pan Sławomir to mistrz swojego fachu!'),
-- Tomasz Kamiński (glazurnik)
((SELECT id FROM profiles WHERE imie='Tomasz' AND nazwisko='Kamiński' LIMIT 1),    'Beata S.',     5, 'Łazienka jak z katalogu włoskiego! Wielkoformatowy gres 120x60 ułożony idealnie. Pan Tomasz jest wirtuozem glazury.'),
((SELECT id FROM profiles WHERE imie='Tomasz' AND nazwisko='Kamiński' LIMIT 1),    'Michał Z.',    5, 'Podłoga i ściana w kuchni — mozaika w połączeniu z gresem. Spójne, eleganckie. Termin dotrzymany co do dnia.'),
((SELECT id FROM profiles WHERE imie='Tomasz' AND nazwisko='Kamiński' LIMIT 1),    'Irmina K.',    4, 'Kafelek na kafelek — wzorowe fugowanie, idealne narożniki. Polecam każdemu!'),
-- Wojciech Zając (stolarz)
((SELECT id FROM profiles WHERE imie='Wojciech' AND nazwisko='Zając' LIMIT 1),     'Agnieszka L.', 5, 'Garderoba walk-in zaprojektowana i wykonana przez pana Wojciecha — moje marzenie spełnione!'),
((SELECT id FROM profiles WHERE imie='Wojciech' AND nazwisko='Zając' LIMIT 1),     'Marcin F.',    4, 'Kuchnia na wymiar w kolorze białego połysku. Precyzja wykonania i montażu zachwycająca.'),
((SELECT id FROM profiles WHERE imie='Wojciech' AND nazwisko='Zając' LIMIT 1),     'Halina B.',    5, 'Renowacja zabytkowych mebli — babciny stół jak nowy! Pan Wojciech ma rękę do drewna.'),
-- Paweł Krawczyk (cieśla)
((SELECT id FROM profiles WHERE imie='Paweł' AND nazwisko='Krawczyk' LIMIT 1),     'Leszek G.',    5, 'Wiata garażowa i pergola ogrodowa — kompletne wykonanie w jeden tydzień. Solidna robota, estetyczne połączenia.'),
((SELECT id FROM profiles WHERE imie='Paweł' AND nazwisko='Krawczyk' LIMIT 1),     'Justyna M.',   4, 'Taras drewniany z impregnacją. Dobra cena, terminowe wykonanie.'),
((SELECT id FROM profiles WHERE imie='Paweł' AND nazwisko='Krawczyk' LIMIT 1),     'Szymon W.',    5, 'Pan Paweł zbudował mi dom szkieletowy w czasie o 30% krótszym niż inne oferty. Polecam!'),
-- Ryszard Pawlak (spawacz)
((SELECT id FROM profiles WHERE imie='Ryszard' AND nazwisko='Pawlak' LIMIT 1),     'Krystian O.', 5, 'Balustrada ze stali nierdzewnej w stylu industrialnym — perfekcyjne spawy, idealna geometria.'),
((SELECT id FROM profiles WHERE imie='Ryszard' AND nazwisko='Pawlak' LIMIT 1),     'Dorota S.',   4, 'Brama przesuwna z automatyką — sprawna realizacja, solidna jakość.'),
((SELECT id FROM profiles WHERE imie='Ryszard' AND nazwisko='Pawlak' LIMIT 1),     'Tadeusz K.',  5, 'Schody spiralne ze stali i drewna — dzieło sztuki! Sąsiedzi zazdroszczą.'),
-- Mariusz Woźniak (architekt)
((SELECT id FROM profiles WHERE imie='Mariusz' AND nazwisko='Woźniak' LIMIT 1),    'Wioletta G.', 5, 'Pan Mariusz zaprojektował nasz wymarzony dom. Projekt nowoczesny, energooszczędny i przemyślany w każdym detalu.'),
((SELECT id FROM profiles WHERE imie='Mariusz' AND nazwisko='Woźniak' LIMIT 1),    'Konrad M.',   5, 'Projekt koncepcyjny dla biura — świeże spojrzenie, fantastyczna wizualizacja 3D.'),
((SELECT id FROM profiles WHERE imie='Mariusz' AND nazwisko='Woźniak' LIMIT 1),    'Sylwia C.',   5, 'Adaptacja projektu gotowego — szybko, sprawnie, z pełną dokumentacją.'),
-- Łukasz Sikora (inżynier)
((SELECT id FROM profiles WHERE imie='Łukasz' AND nazwisko='Sikora' LIMIT 1),      'Roman P.',    5, 'Pan Łukasz prowadził budowę naszego domu od fundamentów. Sprawny nadzór, żadnych niespodzianek budżetowych.'),
((SELECT id FROM profiles WHERE imie='Łukasz' AND nazwisko='Sikora' LIMIT 1),      'Magdalena S.',5, 'Ekspertyza budowlana kupowanego domu — rzetelna, szczegółowa, uratowała nas od złego zakupu.'),
((SELECT id FROM profiles WHERE imie='Łukasz' AND nazwisko='Sikora' LIMIT 1),      'Wiesław J.',  4, 'Kosztorys remontu generalnego — dokładny i realistyczny.'),
-- Katarzyna Zawadzka (projektant wnętrz)
((SELECT id FROM profiles WHERE imie='Katarzyna' AND nazwisko='Zawadzka' LIMIT 1), 'Julia H.',    5, 'Projekt salonu i jadalni w stylu skandynawskim — przepiękne wizualizacje i jeszcze piękniejszy efekt końcowy!'),
((SELECT id FROM profiles WHERE imie='Katarzyna' AND nazwisko='Zawadzka' LIMIT 1), 'Michał K.',   5, 'Kompletny projekt mieszkania 65m². Przemyślany każdy centymetr, dobór kolorów na najwyższym poziomie.'),
((SELECT id FROM profiles WHERE imie='Katarzyna' AND nazwisko='Zawadzka' LIMIT 1), 'Alicja M.',   4, 'Home staging przed sprzedażą — mieszkanie sprzedało się w tydzień po cenie wywoławczej!'),
-- Janusz Michalak (elektryk)
((SELECT id FROM profiles WHERE imie='Janusz' AND nazwisko='Michalak' LIMIT 1),    'Krzysztof G.',5, 'Instalacja fotowoltaiczna 8kWp — perfekcyjne wykonanie. Rachunki za prąd spadły do zera!'),
((SELECT id FROM profiles WHERE imie='Janusz' AND nazwisko='Michalak' LIMIT 1),    'Barbara W.',  4, 'Montaż wallboxa 22kW — szybko i profesjonalnie.'),
((SELECT id FROM profiles WHERE imie='Janusz' AND nazwisko='Michalak' LIMIT 1),    'Czesław R.',  4, 'Instalacja elektryczna w warsztacie — trójfazówka, rozdzielnia, gniazda 32A. Dobrze wykonane.'),
-- Mirosław Grabowski (hydraulik)
((SELECT id FROM profiles WHERE imie='Mirosław' AND nazwisko='Grabowski' LIMIT 1), 'Zbigniew D.', 4, 'Wymiana baterii prysznicowej i umywalkowej — sprawna robota. Dobra cena.'),
((SELECT id FROM profiles WHERE imie='Mirosław' AND nazwisko='Grabowski' LIMIT 1), 'Celina P.',   3, 'Przepychanie kanalizacji zrobione, ale pan Mirosław trochę się spóźnił.'),
((SELECT id FROM profiles WHERE imie='Mirosław' AND nazwisko='Grabowski' LIMIT 1), 'Andrzej S.',  4, 'Montaż kabiny prysznicowej z odpływem liniowym. Solidnie wykonane.');
