export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, i) => {
        const isCompleted = i < current
        const isActive = i === current
        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : isActive
                    ? 'bg-primary text-white shadow-md shadow-blue-200 ring-4 ring-blue-100'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  isActive ? 'text-primary' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
