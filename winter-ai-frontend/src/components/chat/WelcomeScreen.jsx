import { SparklesIcon, ZapIcon, CodeIcon, BookOpenIcon } from 'lucide-react'
import styles from './WelcomeScreen.module.css'

const SUGGESTIONS = [
  { icon: ZapIcon,      text: 'Explain quantum computing simply' },
  { icon: CodeIcon,     text: 'Write a Python script to sort a list' },
  { icon: BookOpenIcon, text: 'Summarise the key ideas in Stoicism' },
  { icon: SparklesIcon, text: 'Give me 5 creative startup ideas' },
]

export function WelcomeScreen({ onSuggestion }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.iconRing}>
          <SparklesIcon size={28} />
        </div>
        <h1 className={styles.title}>How can I help you today?</h1>
        <p className={styles.subtitle}>Ask me anything — I'm powered by Gemini.</p>
      </div>

      <div className={styles.grid}>
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <button key={text} className={styles.card} onClick={() => onSuggestion(text)}>
            <Icon size={16} className={styles.cardIcon} />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
