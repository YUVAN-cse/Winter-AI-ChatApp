import { createContext, useContext, useState, useCallback } from 'react'
import { aiService } from '../services/ai.service'
import toast from 'react-hot-toast'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [threads, setThreads]           = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages]         = useState([])
  const [loading, setLoading]           = useState(false)
  const [streaming, setStreaming]       = useState(false)

  const fetchThreads = useCallback(async () => {
    try {
      const res = await aiService.getAllThreads()
      setThreads(res.data.data || [])
    } catch {
      // silent — user may not have any threads yet
    }
  }, [])

  // Only call this for threads that ALREADY EXIST in the DB
  const openThread = useCallback(async (threadId) => {
    setLoading(true)
    try {
      const res = await aiService.getThread(threadId)
      const thread = res.data.data
      setActiveThread(thread)
      setMessages(thread.messages || [])
    } catch (err) {
      // Thread not found (new UUID never chatted) — treat as blank slate
      setActiveThread(null)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (threadId, text) => {
    // Optimistically add user bubble + AI typing indicator
    const tempUser = { _id: `tmp-u-${Date.now()}`, text, role: 'user', createdAt: new Date().toISOString() }
    const tempAI   = { _id: `tmp-ai-${Date.now()}`, text: '...', role: 'assistant', pending: true }
    setMessages(prev => [...prev, tempUser, tempAI])
    setStreaming(true)

    try {
      // POST /ai/v1/chat/:threadId — creates thread on first message
      await aiService.chat(threadId, text)

      // Fetch the real populated thread to replace optimistic messages
      const full = await aiService.getThread(threadId)
      const thread = full.data.data
      setActiveThread(thread)
      setMessages(thread.messages || [])

      // Refresh sidebar thread list
      await fetchThreads()
    } catch (err) {
      // Remove optimistic messages on failure
      setMessages(prev => prev.filter(m => !m.pending && m._id !== tempUser._id))
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setStreaming(false)
    }
  }, [fetchThreads])

  const deleteThread = useCallback(async (threadId) => {
    try {
      await aiService.deleteThread(threadId)
      setThreads(prev => prev.filter(t => t.threadId !== threadId))
      if (activeThread?.threadId === threadId) {
        setActiveThread(null)
        setMessages([])
      }
      toast.success('Thread deleted')
    } catch {
      toast.error('Failed to delete thread')
    }
  }, [activeThread])

  const newThread = useCallback(() => {
    setActiveThread(null)
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider value={{
      threads, activeThread, messages, loading, streaming,
      fetchThreads, openThread, sendMessage, deleteThread, newThread,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}
