import ReactMarkdown from 'react-markdown'
import { Avatar } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { SparklesIcon } from 'lucide-react'
import styles from './ChatMessage.module.css'
import { clsx } from 'clsx'

export function ChatMessage({ message }) {
  const { user } = useAuth()
  const isUser = message.role === 'user'
  const isPending = message.pending

  return (
    <div className={clsx(styles.row, isUser && styles.userRow)}>
      {/* Avatar */}
      {!isUser && (
        <div className={styles.aiAvatar}>
          <SparklesIcon size={14} />
        </div>
      )}

      <div className={clsx(styles.bubble, isUser ? styles.userBubble : styles.aiBubble)}>
        {isPending ? (
          <TypingDots />
        ) : (
          <ReactMarkdown
            components={{
              code({ inline, children, ...props }) {
                return inline ? (
                  <code className={styles.inlineCode} {...props}>{children}</code>
                ) : (
                  <pre className={styles.codeBlock}>
                    <code {...props}>{children}</code>
                  </pre>
                )
              },
              p({ children }) { return <p className={styles.para}>{children}</p> },
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <Avatar name={user?.name || 'U'} size="sm" />
      )}
    </div>
  )
}

function TypingDots() {
  return (
    <span className={styles.typing}>
      <span />
      <span />
      <span />
    </span>
  )
}
