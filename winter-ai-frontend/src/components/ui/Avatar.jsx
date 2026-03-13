import styles from './Avatar.module.css'

export function Avatar({ name = '', size = 'md' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {initials || '?'}
    </div>
  )
}
