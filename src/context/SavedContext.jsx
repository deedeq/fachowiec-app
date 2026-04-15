import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SavedContext = createContext(null)

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedFachowcy') || '[]')
    } catch {
      return []
    }
  })
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem('savedFachowcy', JSON.stringify(saved))
  }, [saved])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const toggleSave = useCallback((fachowiec) => {
    setSaved((prev) => {
      const isSaved = prev.some((f) => f.id === fachowiec.id)
      if (isSaved) {
        addToast(`Usunięto ${fachowiec.imie} ${fachowiec.nazwisko} z zapisanych`, 'info')
        return prev.filter((f) => f.id !== fachowiec.id)
      } else {
        addToast(`❤️ Zapisano ${fachowiec.imie} ${fachowiec.nazwisko}!`)
        return [...prev, fachowiec]
      }
    })
  }, [addToast])

  const isSaved = useCallback((id) => saved.some((f) => f.id === id), [saved])

  return (
    <SavedContext.Provider value={{ saved, toggleSave, isSaved, toasts }}>
      {children}
      <ToastContainer toasts={toasts} />
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error('useSaved must be used within SavedProvider')
  return ctx
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function Toast({ toast }) {
  const isInfo = toast.type === 'info'
  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl
        text-white text-sm font-semibold min-w-[240px] max-w-xs
        animate-toast
        ${isInfo
          ? 'bg-gradient-to-r from-gray-700 to-gray-800'
          : 'bg-gradient-to-r from-emerald-500 to-green-600'}
      `}
    >
      <span className="text-xl shrink-0">{isInfo ? '🗑️' : '❤️'}</span>
      <span>{toast.message}</span>
    </div>
  )
}
