import styles from './Button.module.css'
import { clsx } from 'clsx'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  ...props
}) {
  return (
    <button
      className={clsx(styles.btn, styles[variant], styles[size], loading && styles.loading, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}
