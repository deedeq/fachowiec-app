// Interactive map of Poland with 16 voivodeships using inline SVG
// SVG paths are simplified but representative of Poland's voivodeships

const WOJWODZTWA_MAP = [
  { id: 'dolnoslaskie', name: 'Dolnośląskie', d: 'M130 295 L175 285 L195 305 L200 345 L170 365 L140 355 L120 335 Z' },
  { id: 'kujawskopomorskie', name: 'Kujawsko-Pomorskie', d: 'M240 155 L300 150 L320 170 L315 215 L280 225 L240 210 L225 185 Z' },
  { id: 'lubelskie', name: 'Lubelskie', d: 'M370 265 L420 250 L445 270 L450 320 L430 345 L385 350 L360 320 Z' },
  { id: 'lubuskie', name: 'Lubuskie', d: 'M120 195 L165 185 L185 210 L175 250 L145 260 L115 240 L105 215 Z' },
  { id: 'lodzkie', name: 'Łódzkie', d: 'M268 245 L320 238 L335 265 L325 305 L295 315 L262 300 L250 270 Z' },
  { id: 'malopolskie', name: 'Małopolskie', d: 'M285 355 L345 345 L370 365 L365 400 L330 415 L290 405 L275 385 Z' },
  { id: 'mazowieckie', name: 'Mazowieckie', d: 'M305 185 L385 175 L405 200 L400 255 L365 268 L315 260 L298 230 Z' },
  { id: 'opolskie', name: 'Opolskie', d: 'M198 305 L248 295 L262 318 L252 348 L220 355 L195 340 L188 318 Z' },
  { id: 'podkarpackie', name: 'Podkarpackie', d: 'M368 360 L430 350 L455 375 L448 415 L415 430 L375 420 L358 395 Z' },
  { id: 'podlaskie', name: 'Podlaskie', d: 'M380 135 L445 125 L475 150 L472 200 L435 215 L385 205 L365 175 Z' },
  { id: 'pomorskie', name: 'Pomorskie', d: 'M215 80 L300 68 L325 95 L318 140 L275 155 L225 148 L200 118 Z' },
  { id: 'slaskie', name: 'Śląskie', d: 'M220 325 L275 318 L288 342 L278 375 L248 382 L215 368 L205 342 Z' },
  { id: 'swietokrzyskie', name: 'Świętokrzyskie', d: 'M320 295 L368 285 L382 308 L372 340 L340 348 L315 330 Z' },
  { id: 'warminskomazurskie', name: 'Warmińsko-Mazurskie', d: 'M305 100 L385 88 L415 115 L408 165 L370 178 L310 168 L290 135 Z' },
  { id: 'wielkopolskie', name: 'Wielkopolskie', d: 'M168 215 L245 205 L268 235 L258 285 L215 298 L165 285 L148 252 Z' },
  { id: 'zachodniopomorskie', name: 'Zachodniopomorskie', d: 'M110 95 L215 82 L225 118 L215 155 L165 168 L108 150 L92 118 Z' },
]

// Normalizes voivodeship name for comparison (remove accents etc)
function normalizeWoj(name) {
  return name
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź|ż/g, 'z')
    .replace(/[-\s]/g, '')
}

export default function MapaPolski({ selected, onSelect }) {
  const selectedNorm = selected ? normalizeWoj(selected) : null

  return (
    <div className="w-full">
      <svg
        viewBox="80 60 400 390"
        className="w-full max-w-xs mx-auto"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
        role="img"
        aria-label="Mapa województw Polski"
      >
        {WOJWODZTWA_MAP.map((woj) => {
          const isSelected = selectedNorm === normalizeWoj(woj.name)
          return (
            <g key={woj.id} onClick={() => onSelect(isSelected ? null : woj.name)}>
              <path
                d={woj.d}
                fill={isSelected ? '#1a73e8' : '#dbeafe'}
                stroke="#fff"
                strokeWidth="2"
                className="rsm-geography cursor-pointer transition-all duration-150"
                style={{
                  filter: isSelected ? 'drop-shadow(0 0 4px rgba(26,115,232,0.5))' : undefined,
                }}
              />
              <title>{woj.name}</title>
            </g>
          )
        })}
      </svg>

      {selected && (
        <div className="text-center mt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
            📍 {selected}
            <button
              onClick={() => onSelect(null)}
              className="ml-1 text-gray-400 hover:text-gray-600"
              aria-label="Wyczyść filtr województwa"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-2">Kliknij na województwo aby filtrować</p>
    </div>
  )
}
