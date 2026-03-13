import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, TrashIcon, MessageSquareIcon, SparklesIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { useThreadId } from '../../hooks/useThreadId'
import { Avatar } from '../ui'
import styles from './Sidebar.module.css'
import { clsx } from 'clsx'

export function Sidebar() {
  const { threads, activeThread, fetchThreads, openThread, deleteThread, newThread } = useChat()
  const { user, logout } = useAuth()
  const { generate } = useThreadId()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchThreads() }, [fetchThreads])

  const handleNew = () => {
    newThread()
    navigate('/chat/' + generate())
  }

  const handleOpen = (threadId) => {
    openThread(threadId)
    navigate('/chat/' + threadId)
  }

  const handleDelete = async (e, threadId) => {
    e.stopPropagation()
    setDeleting(threadId)
    await deleteThread(threadId)
    setDeleting(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <SparklesIcon size={16} />
        </div>
        <span className={styles.logoText}>Winter AI</span>
      </div>

      {/* New Chat */}
      <button className={styles.newChat} onClick={handleNew}>
        <PlusIcon size={15} />
        <span>New conversation</span>
      </button>

      {/* Threads */}
      <nav className={styles.threads}>
        {threads.length === 0 && (
          <p className={styles.empty}>No conversations yet</p>
        )}
        {threads.map((t) => (
          <div
            key={t._id}
            className={clsx(styles.thread, activeThread?.threadId === t.threadId && styles.active)}
            onClick={() => handleOpen(t.threadId)}
          >
            <MessageSquareIcon size={13} className={styles.threadIcon} />
            <span className={styles.threadTitle}>{t.title}</span>
            <button
              className={clsx(styles.deleteBtn, deleting === t.threadId && styles.deleting)}
              onClick={(e) => handleDelete(e, t.threadId)}
              title="Delete"
            >
              <TrashIcon size={12} />
            </button>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={styles.footer}>
        <button className={styles.profileBtn} onClick={() => navigate('/profile')}>
          <Avatar name={user?.name || ''} size="sm" />
          <span className={styles.profileName}>{user?.name}</span>
          <UserIcon size={13} className={styles.profileIcon} />
        </button>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <LogOutIcon size={15} />
        </button>
      </div>
    </aside>
  )
}
