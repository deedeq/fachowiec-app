import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/client'
import { CheckCircle, XCircle, Edit, Trash2, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [fachowcy, setFachowcy] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    // Basic guard
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    
    fetchFachowcy()
  }, [activeTab, user])

  const fetchFachowcy = async () => {
    setIsLoading(true)
    try {
      // Jeśli jesteśmy na tabie pending, pobierz pending. Inaczej pobierz wszystkie.
      const qs = activeTab === 'pending' ? '?status=pending' : ''
      const res = await apiClient.get(`/admin/fachowcy${qs}`)
      setFachowcy(res.data)
    } catch (err) {
      console.error(err)
      alert('Nie udało się pobrać danych.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Czy na pewno chcesz zmienić status na ${newStatus}?`)) return
    try {
      await apiClient.post(`/admin/fachowcy/${id}/status`, { status: newStatus })
      fetchFachowcy()
    } catch (err) {
      alert('Wystąpił błąd podczas zmiany statusu.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz trwale usunąć tego użytkownika? Tej akcji nie da się cofnąć!')) return
    try {
      await apiClient.delete(`/admin/fachowcy/${id}`)
      fetchFachowcy()
    } catch (err) {
      alert('Błąd podczas usuwania użytkownika.')
    }
  }

  const handleEditRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Czy na pewno chcesz zmienić rolę tego użytkownika na ${newRole}?`)) return
    try {
      await apiClient.put(`/admin/fachowcy/${id}`, { role: newRole })
      fetchFachowcy()
    } catch (err) {
      alert('Błąd podczas zmiany roli.')
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/admin/fachowcy/${editingUser.id}`, {
        imie: editingUser.imie,
        nazwisko: editingUser.nazwisko,
        email: editingUser.email,
        telefon: editingUser.telefon,
        specjalizacja: editingUser.specjalizacja,
        wojewodztwo: editingUser.wojewodztwo,
        miasto: editingUser.miasto,
        role: editingUser.role
      })
      setEditingUser(null)
      fetchFachowcy()
    } catch (err) {
      alert('Błąd podczas zapisywania profilu.')
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-bg py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-10 h-10 text-red-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">Panel Administratora</h1>
        </div>

        {/* Zakładki */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-2 font-bold text-lg transition-colors ${
              activeTab === 'pending' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Oczekujące zgłoszenia
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-2 font-bold text-lg transition-colors ${
              activeTab === 'all' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Wszyscy Użytkownicy (Zarządzanie)
          </button>
        </div>

        {/* Zawartość */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {isLoading ? (
            <p className="text-center py-10 text-gray-500">Ładowanie danych...</p>
          ) : fachowcy.length === 0 ? (
            <p className="text-center py-10 text-gray-500 font-medium">
              Brak wyników do wyświetlenia.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <th className="px-4 py-3 rounded-tl-lg">Imię i nazwisko</th>
                    <th className="px-4 py-3">Specjalizacja</th>
                    <th className="px-4 py-3">Miasto</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Rola</th>
                    <th className="px-4 py-3 rounded-tr-lg w-32 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fachowcy.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {f.imie} {f.nazwisko}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{f.specjalizacja}</td>
                      <td className="px-4 py-3 text-gray-600">{f.miasto}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          f.status === 'approved' ? 'bg-green-100 text-green-800' :
                          f.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {f.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleEditRole(f.id, f.role)}
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            f.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title="Kliknij, aby zmienić rolę"
                        >
                          {f.role.toUpperCase()}
                        </button>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end gap-2">
                        {f.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusChange(f.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Zatwierdź">
                              <CheckCircle size={20} />
                            </button>
                            <button onClick={() => handleStatusChange(f.id, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Odrzuć">
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        {activeTab === 'all' && (
                          <>
                            <button onClick={() => setEditingUser(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edytuj profil">
                              <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Usuń trwale">
                              <Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDYCJI */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edycja Użytkownika</h2>
            <form onSubmit={saveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Imię</label>
                  <input className="input-field" value={editingUser.imie || ''} onChange={e => setEditingUser({...editingUser, imie: e.target.value})} />
                </div>
                <div>
                  <label className="label">Nazwisko</label>
                  <input className="input-field" value={editingUser.nazwisko || ''} onChange={e => setEditingUser({...editingUser, nazwisko: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Telefon</label>
                <input type="text" className="input-field" value={editingUser.telefon || ''} onChange={e => setEditingUser({...editingUser, telefon: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Rola</label>
                  <select className="input-field" value={editingUser.role || 'klient'} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                    <option value="klient">Klient</option>
                    <option value="fachowiec">Fachowiec</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Specjalizacja</label>
                  <input className="input-field" value={editingUser.specjalizacja || ''} onChange={e => setEditingUser({...editingUser, specjalizacja: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingUser(null)} className="btn-outline">Anuluj</button>
                <button type="submit" className="btn-primary">Zapisz zmiany</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
