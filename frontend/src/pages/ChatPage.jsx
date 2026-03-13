import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useChat } from '../context/ChatContext'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { ChatMessage } from '../components/chat/ChatMessage'
import { ChatInput } from '../components/chat/ChatInput'
import { WelcomeScreen } from '../components/chat/WelcomeScreen'
import { Spinner } from '../components/ui'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const { threadId } = useParams()
  const navigate     = useNavigate()
  const { messages, loading, streaming, sendMessage, openThread, threads, activeThread } = useChat()
  const scrollRef    = useAutoScroll([messages])

  // Stable real UUID — generated once, never 'new'
  const realId = useRef(null)
  if (!realId.current) {
    realId.current = (threadId && threadId !== 'new') ? threadId : uuidv4()
  }

  useEffect(() => {
    // If URL still says 'new', redirect to real UUID silently
    if (!threadId || threadId === 'new') {
      navigate(`/chat/${realId.current}`, { replace: true })
      return
    }

    realId.current = threadId

    // Only fetch from backend if this thread exists (it's in the sidebar list)
    // Brand-new UUIDs have no DB record yet — opening them would 404
    const exists = threads.some(t => t.threadId === threadId)
    if (exists) {
      openThread(threadId)
    }
    // else: blank welcome screen, thread created on first sendMessage
  }, [threadId, threads])

  const handleSend = async (text) => {
    await sendMessage(realId.current, text)
  }

  const showWelcome = !loading && messages.length === 0

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.headerTitle}>
            {activeThread?.title || 'New conversation'}
          </span>
        </div>
      </header>

      <div className={styles.messages} ref={scrollRef}>
        {loading ? (
          <div className={styles.center}><Spinner size="lg" /></div>
        ) : showWelcome ? (
          <WelcomeScreen onSuggestion={handleSend} />
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg, i) => (
              <ChatMessage key={msg._id || i} message={msg} />
            ))}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={streaming || loading} />
    </div>
  )
}
