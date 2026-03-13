import { useState, useRef, useCallback } from 'react'
import { SendHorizontalIcon } from 'lucide-react'
import styles from './ChatInput.module.css'
import { clsx } from 'clsx'

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [])

  const handleChange = (e) => {
    setValue(e.target.value)
    resize()
  }

  const handleSend = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Winter AI…"
          rows={1}
          disabled={disabled}
        />
        <button
          className={clsx(styles.sendBtn, value.trim() && styles.active)}
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          title="Send (Enter)"
        >
          <SendHorizontalIcon size={16} />
        </button>
      </div>
      <p className={styles.hint}>Press Enter to send · Shift+Enter for newline</p>
    </div>
  )
}
