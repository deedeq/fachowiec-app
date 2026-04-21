import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

function normalizeWoj(name) {
  if (!name) return ''
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
      <div className="w-full max-w-xs mx-auto" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 2600, center: [19.2, 52.0] }}
          width={400}
          height={390}
        >
          <Geographies geography="/poland.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const wojName = geo.properties.nazwa
                const isSelected = selectedNorm === normalizeWoj(wojName)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onSelect(isSelected ? null : wojName)}
                    style={{
                      default: {
                        fill: isSelected ? '#1a73e8' : '#dbeafe',
                        stroke: "#fff",
                        strokeWidth: 0.75,
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: isSelected ? '#1a73e8' : '#bfdbfe',
                        stroke: "#fff",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: '#1a73e8',
                        stroke: "#fff",
                        strokeWidth: 0.75,
                        outline: "none"
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

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
