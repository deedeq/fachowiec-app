import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    klient: 'Marek Wiśniewski',
    avatar: 'MW',
    color: 'bg-blue-500',
    ostatniaWiadomosc: 'Kiedy możemy się umówić na wycenę?',
    czas: '10 min',
    nieprzeczytane: 2,
    usluga: 'Malowanie mieszkania',
    wiadomosci: [
      { id: 1, autor: 'klient', tekst: 'Dzień dobry! Jestem zainteresowany malowaniem 3 pokoi + salon.', czas: '09:45' },
      { id: 2, autor: 'ja', tekst: 'Dzień dobry! Oczywiście, mogę się tym zająć. Jaki metraż?', czas: '09:52' },
      { id: 3, autor: 'klient', tekst: 'Około 80m². Chcielibyśmy jasne kolory, Farba Dulux lub podobna.', czas: '09:55' },
      { id: 4, autor: 'ja', tekst: 'Rozumiem. Orientacyjny koszt to ok. 4000-5000 zł z materiałami. Kiedy mogę przyjechać na wycenę?', czas: '10:01' },
      { id: 5, autor: 'klient', tekst: 'Kiedy możemy się umówić na wycenę?', czas: '10:08' },
    ]
  },
  {
    id: 2,
    klient: 'Anna Kowalska',
    avatar: 'AK',
    color: 'bg-rose-500',
    ostatniaWiadomosc: 'Super, to do zobaczenia w piątek!',
    czas: '2 godz.',
    nieprzeczytane: 0,
    usluga: 'Glazura łazienka',
    wiadomosci: [
      { id: 1, autor: 'klient', tekst: 'Hej! Mam łazienkę 6m², chcę nowe płytki. Czy mogę prosić o wycenę?', czas: '08:00' },
      { id: 2, autor: 'ja', tekst: 'Cześć! Tak, zajmuję się glazurą. Zależy od wybranego materiału, ale orientacyjnie 2000-3000 zł robocizna.', czas: '08:15' },
      { id: 3, autor: 'klient', tekst: 'OK, to mogę przyjechać w piątek ok 10?', czas: '08:20' },
      { id: 4, autor: 'ja', tekst: 'Piątek 10:00 jest super. Proszę podać adres.', czas: '08:25' },
      { id: 5, autor: 'klient', tekst: 'Super, to do zobaczenia w piątek!', czas: '08:30' },
    ]
  },
  {
    id: 3,
    klient: 'Tomasz Bański',
    avatar: 'TB',
    color: 'bg-emerald-500',
    ostatniaWiadomosc: 'Proszę o fakturę VAT jeśli możliwe.',
    czas: 'wczoraj',
    nieprzeczytane: 1,
    usluga: 'Instalacja elektryczna',
    wiadomosci: [
      { id: 1, autor: 'klient', tekst: 'Potrzebuję wymienić instalację elektryczną w domu 120m².', czas: 'wczoraj' },
      { id: 2, autor: 'ja', tekst: 'To spory zakres. Zależy od stanu obecnej instalacji. Muszę najpierw zrobić przegląd.', czas: 'wczoraj' },
      { id: 3, autor: 'klient', tekst: 'Proszę o fakturę VAT jeśli możliwe.', czas: 'wczoraj' },
    ]
  },
]

function ConversationItem({ conv, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 ${active ? 'bg-blue-50 border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
    >
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-full ${conv.color} flex items-center justify-center text-white font-bold text-sm`}>
          {conv.avatar}
        </div>
        {conv.nieprzeczytane > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">
            {conv.nieprzeczytane}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold truncate ${conv.nieprzeczytane > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
            {conv.klient}
          </span>
          <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.czas}</span>
        </div>
        <p className="text-xs text-primary font-medium">{conv.usluga}</p>
        <p className={`text-xs truncate mt-0.5 ${conv.nieprzeczytane > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
          {conv.ostatniaWiadomosc}
        </p>
      </div>
    </button>
  )
}

function Message({ msg, myName }) {
  const isMe = msg.autor === 'ja'
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1">
          K
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md group`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isMe
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {msg.tekst}
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
          {msg.czas} {isMe && '✓✓'}
        </p>
      </div>
    </div>
  )
}

export default function Wiadomosci() {
  const { isLoggedIn, user } = useAuth()
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeId, setActiveId] = useState(1)
  const [input, setInput] = useState('')
  const [showList, setShowList] = useState(true)
  const messagesEndRef = useRef(null)

  const active = conversations.find(c => c.id === activeId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.wiadomosci])

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">💬</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Zaloguj się, żeby zobaczyć wiadomości</h1>
        <div className="flex gap-3 justify-center">
          <Link to="/logowanie" className="btn-outline">Zaloguj się</Link>
          <Link to="/rejestracja" className="btn-primary">🛠️ Dołącz</Link>
        </div>
      </div>
    )
  }

  const handleSend = () => {
    if (!input.trim()) return
    const now = new Date()
    const czas = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? {
            ...c,
            ostatniaWiadomosc: input.trim(),
            czas: 'teraz',
            nieprzeczytane: 0,
            wiadomosci: [...c.wiadomosci, { id: Date.now(), autor: 'ja', tekst: input.trim(), czas }]
          }
        : c
    ))
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectConversation = (id) => {
    setActiveId(id)
    setShowList(false)
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, nieprzeczytane: 0 } : c))
  }

  const totalUnread = conversations.reduce((s, c) => s + c.nieprzeczytane, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💬 Wiadomości</h1>
          <p className="text-sm text-gray-500">
            {totalUnread > 0 ? `${totalUnread} nieprzeczytanych` : 'Wszystkie wiadomości przeczytane'}
          </p>
        </div>
        <Link to="/panel" className="btn-outline text-sm py-2 px-4">← Panel</Link>
      </div>

      <div className="card overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-gray-100 shrink-0`}>
            <div className="px-4 py-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Szukaj konwersacji..."
                className="input-field text-sm py-2"
              />
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {conversations.map(c => (
                <ConversationItem
                  key={c.id}
                  conv={c}
                  active={c.id === activeId}
                  onClick={() => selectConversation(c.id)}
                />
              ))}
            </div>
          </div>

          {/* Chat panel */}
          {active && (
            <div className={`${showList ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0`}>
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
                <button
                  className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                  onClick={() => setShowList(true)}
                >
                  ←
                </button>
                <div className={`w-9 h-9 rounded-full ${active.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {active.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{active.klient}</p>
                  <p className="text-xs text-primary font-medium">{active.usluga}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                {active.wiadomosci.map(msg => (
                  <Message key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Napisz wiadomość... (Enter = wyślij)"
                      rows={1}
                      className="input-field resize-none text-sm py-2.5 pr-12"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200 ${
                      input.trim() ? 'bg-primary hover:bg-blue-700 shadow-md' : 'bg-gray-200'
                    }`}
                  >
                    ➤
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">Enter aby wysłać · Shift+Enter nowa linia</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
